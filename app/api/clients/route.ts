import { NextResponse, type NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { getToken } from "next-auth/jwt";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { literal } from "@/lib/list-params";
import { parentIdsWithCr } from "@/lib/clients-list";
import { clientScopeWhere, getManagerOrgIds, getManagerSalesmanIds, getManagerSalesmanIdsForOrg, getSalesmanOrgIds, getTokenUserId, isRole, hasRole } from "@/lib/scoping";
import { normalizeCrNo, parseCrExpiryDate } from "@/lib/client-fields";
import { isClientStatus, statusChangeError } from "@/lib/client-status-flow";
import { cleanText, contactRequiredMessage, missingContactFields, statusRequiresContact } from "@/lib/client-contact";
import { departmentTaken } from "@/lib/client-fields";
import { MAX_EXTRA_CONTACTS, parseContact } from "@/lib/client-contacts";
import { clientLabel } from "@/types/client";
import { isOwnerRole } from "@/lib/roles";

import { createLeadTasks } from "@/lib/lead-tasks";
import { revalidateTaskViews } from "@/lib/enquiry-follow-ups";
export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);

  // ?cr= (add-client form): is this company already on file, and who handles it? Names only — no contacts or deals —
  // so a salesman can see a company is taken and add their own department instead of a duplicate.
  if (url.searchParams.has("cr")) {
    if (!hasRole(token, [1, 2, 3])) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const crNo = normalizeCrNo(url.searchParams.get("cr"));
    if (!crNo) return NextResponse.json({ company: null });
    const main = await prisma.client.findUnique({
      where: { cr_no: crNo },
      select: {
        id: true,
        name: true,
        org_id: true,
        department: true,
        organization: { select: { name: true } },
        assignedSalesman: { select: { name: true } },
        departments: { select: { id: true, department: true, assignedSalesman: { select: { name: true } } }, orderBy: { department: "asc" } },
      },
    });
    if (!main) return NextResponse.json({ company: null });
    const allowedOrgIds = await allowedOrgIdsFor(token);
    return NextResponse.json({
      company: {
        id: main.id,
        name: main.name,
        org_id: main.org_id,
        org_name: main.organization.name,
        can_add_department: allowedOrgIds.includes(main.org_id),
        departments: [main, ...main.departments].map((d) => ({ id: d.id, department: d.department, salesman: d.assignedSalesman.name })),
      },
    });
  }

  // ?name_like= (add-client form, from 3 letters): companies on file with a similar name and who handles them.
  // Names only, like ?cr=, so a duplicate is spotted before saving.
  if (url.searchParams.has("name_like")) {
    if (!hasRole(token, [1, 2, 3])) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const name = (url.searchParams.get("name_like") ?? "").trim().replace(/\s+/g, " ").slice(0, 120);
    if (name.length < 3) return NextResponse.json({ matches: [] });
    const select = { id: true, name: true, organization: { select: { name: true } }, assignedSalesman: { select: { name: true } } } as const;
    // The exact match (what the server would refuse) first, then up to 5 similar names.
    const [exact, similar] = await Promise.all([
      prisma.client.findFirst({ where: { parent_client_id: null, name: { equals: name, mode: "insensitive" } }, select }),
      prisma.client.findMany({ where: { parent_client_id: null, name: { contains: literal(name), mode: "insensitive" } }, select, orderBy: { name: "asc" }, take: 5 }),
    ]);
    const rows = exact ? [exact, ...similar.filter((c) => c.id !== exact.id).slice(0, 4)] : similar;
    return NextResponse.json({
      matches: rows.map((c) => ({ id: c.id, name: c.name, org_name: c.organization.name, salesman: c.assignedSalesman.name, exact: c.id === exact?.id })),
    });
  }

  // Lightweight search for pickers: ?q=&limit= (max 50) → [{ id, name }]. Never returns the whole table.
  const q = url.searchParams.get("q")?.trim() ?? "";
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 20, 1), 50);
  const parentIds = q ? await parentIdsWithCr(q) : [];
  const search: Prisma.ClientWhereInput = q
    ? {
        OR: [
          { name: { contains: literal(q), mode: "insensitive" } },
          { cr_no: { contains: literal(q), mode: "insensitive" } },
          // Departments have no CR of their own: match their company's.
          ...(parentIds.length ? [{ parent_client_id: { in: parentIds } }] : []),
          { department: { contains: literal(q), mode: "insensitive" } },
          { contact_no: { contains: literal(q) } },
        ],
      }
    : {};
  // ?team=1 (managers): their own and their salesmen's clients — the same rule as the manager client page.
  const team: Prisma.ClientWhereInput =
    url.searchParams.get("team") && isRole(token, 2)
      ? { assigned_salesman_id: { in: [getTokenUserId(token), ...(await getManagerSalesmanIds(getTokenUserId(token)))] } }
      : {};
  // ?details=1 adds status and salesman for richer result rows (client switcher).
  const details = !!url.searchParams.get("details");
  const clients = await prisma.client.findMany({
    where: { AND: [await clientScopeWhere(token), team, search] },
    select: { id: true, name: true, department: true, ...(details ? { status: true, assignedSalesman: { select: { name: true } } } : {}) },
    orderBy: { name: "asc" },
    take: limit,
  });
  // Departments of one company read "Company · Department" so they can be told apart.
  return NextResponse.json({ clients: clients.map(({ department, ...c }) => ({ ...c, name: clientLabel({ name: c.name, department }) })) });
}

/** Companies the user can add clients under: a salesman's, a manager's, or (owner / super admin) every company. */
async function allowedOrgIdsFor(token: { id?: unknown; role_id?: unknown }) {
  const role = Number(token.role_id);
  if (isOwnerRole(role)) return (await prisma.organization.findMany({ select: { id: true } })).map((o) => o.id);
  const userId = getTokenUserId(token as { id?: number });
  return role === 3 ? getSalesmanOrgIds(userId) : role === 2 ? getManagerOrgIds(userId) : [];
}

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasRole(token, [1, 2, 3])) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const crNo = normalizeCrNo(body.cr_no);
  const crExpiry = parseCrExpiryDate(body.cr_expiry_date);
  if ((body.cr_no !== undefined && crNo === undefined) || !crExpiry.valid) {
    return NextResponse.json({ error: "Invalid CR number or expiry date" }, { status: 400 });
  }

  // A CR that's already on file is the same company: with a department filled in, the new client is that
  // company's department (own salesman, contact and pipeline); without one it's a duplicate.
  const department = cleanText(body.department) || null;

  // Extra contact people entered with the client (same rules as adding them on the client page).
  const rawContacts: Record<string, unknown>[] = Array.isArray(body.contacts) ? body.contacts.slice(0, MAX_EXTRA_CONTACTS) : [];
  const extraContacts = [];
  for (const raw of rawContacts) {
    const parsed = parseContact(raw ?? {});
    if ("error" in parsed) return NextResponse.json({ error: `Additional contact: ${parsed.error}` }, { status: 400 });
    extraContacts.push(parsed.data);
  }
  let parent: { id: number; name: string; org_id: number } | null = null;
  if (crNo) {
    const existing = await prisma.client.findUnique({ where: { cr_no: crNo }, select: { id: true, name: true, org_id: true } });
    if (existing) {
      if (!department) {
        return NextResponse.json(
          { error: "This CR number already belongs to a company. Fill in Department to add yours as a separate department of it.", code: "CR_EXISTS" },
          { status: 409 }
        );
      }
      if (await departmentTaken(existing.id, department)) {
        return NextResponse.json({ error: "That department already exists for this company" }, { status: 409 });
      }
      parent = existing;
    }
  }

  // Only Name is required for a Lead; contact details become required past Lead.
  const status = body.status ?? "lead";
  if (!isClientStatus(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  const blocked = statusChangeError(Number(token.role_id), "lead", status);
  if (blocked) return NextResponse.json({ error: blocked === "Only managers can change the black list" ? "Only managers can add a client to the black list" : blocked }, { status: 403 });
  const contactPersonName = cleanText(body.contact_person_name) ?? "";
  const contactNo = cleanText(body.contact_no) ?? "";
  const designation = cleanText(body.contact_person_designation) || null;
  const mailId = cleanText(body.mail_id) || null;
  // New client names are stored in capitals, single-spaced (also on bulk import).
  const name = (cleanText(body.name) ?? "").replace(/\s+/g, " ").toUpperCase();
  if (!name) return NextResponse.json({ error: "Client name is required" }, { status: 400 });
  const missing = statusRequiresContact(status)
    ? missingContactFields({ contact_person_name: contactPersonName, contact_no: contactNo, contact_person_designation: designation })
    : [];
  if (missing.length) {
    return NextResponse.json({ error: contactRequiredMessage(missing), code: "CONTACT_REQUIRED", missing }, { status: 422 });
  }

  // Without a CR, the same name as a company already on file (any case) is a duplicate. With a CR not on file it's a
  // different company even if the name matches (the CR is the identity). Departments keep the parent's name.
  if (!parent && !crNo) {
    const sameName = await prisma.client.findFirst({ where: { parent_client_id: null, name: { equals: name, mode: "insensitive" } }, select: { id: true } });
    if (sameName) {
      return NextResponse.json(
        { error: "A client with this name already exists. If it's a different company, enter its CR number. If it's the same company, enter that company's CR number and a Department.", code: "NAME_EXISTS" },
        { status: 409 }
      );
    }
  }

  // Duplicate check only on details that were actually entered
  const duplicateKeys = [contactNo ? { contact_no: contactNo } : null, mailId ? { mail_id: mailId } : null].filter(
    (k): k is { contact_no: string } | { mail_id: string } => k !== null
  );
  if (duplicateKeys.length) {
    // Don't echo the matching client back: it may belong to another salesman (or another department).
    const duplicate = await prisma.client.findFirst({ where: { OR: duplicateKeys }, select: { id: true } });
    if (duplicate) return NextResponse.json({ error: "A client with this phone number or email already exists" }, { status: 409 });
  }

  // The company must be one the user works for: a salesman's assigned companies, a manager's companies.
  // With a single company it's picked automatically; with several the form has to say which.
  const allowedOrgIds = await allowedOrgIdsFor(token);
  let orgId = parent ? parent.org_id : body.org_id ? Number(body.org_id) : null;
  if (!orgId && allowedOrgIds.length === 1) orgId = allowedOrgIds[0];
  if (!orgId) {
    return NextResponse.json(
      { error: allowedOrgIds.length ? "Select the company this client belongs to" : "You aren't assigned to a company yet", code: "ORG_REQUIRED" },
      { status: 400 }
    );
  }
  if (!allowedOrgIds.includes(orgId)) {
    return NextResponse.json({ error: "You don't work for that company" }, { status: 403 });
  }

  // A manager assigning the client to a salesman: that salesman must work for this company on their team.
  const assignedSalesmanId = Number(body.assigned_salesman_id ?? token.id);
  if (token.role_id === 2 && assignedSalesmanId !== getTokenUserId(token)) {
    if (!(await getManagerSalesmanIdsForOrg(getTokenUserId(token), orgId)).includes(assignedSalesmanId)) {
      return NextResponse.json({ error: "That salesman doesn't work for this company on your team" }, { status: 403 });
    }
  }
  // The owner keeps a client for themselves or hands it to a manager / salesman of that company.
  if (isOwnerRole(Number(token.role_id)) && assignedSalesmanId !== getTokenUserId(token)) {
    const worksThere = await prisma.user.findFirst({
      where: { id: assignedSalesmanId, OR: [{ managerOrgs: { some: { org_id: orgId } } }, { salesmanManager: { some: { org_id: orgId } } }] },
      select: { id: true },
    });
    if (!worksThere) return NextResponse.json({ error: "That person doesn't work for this company" }, { status: 403 });
  }

  // Part of a bulk import: it must be the caller's own, still-running batch.
  let importBatchId: number | null = null;
  if (body.import_batch_id !== undefined && body.import_batch_id !== null) {
    const batch = await prisma.importBatch.findFirst({ where: { id: Number(body.import_batch_id), created_by_id: getTokenUserId(token), status: "importing" }, select: { id: true } });
    if (!batch) return NextResponse.json({ error: "Import not found" }, { status: 400 });
    importBatchId = batch.id;
  }

  let client;
  try {
    client = await prisma.client.create({
      data: {
        import_batch_id: importBatchId,
        name: parent ? parent.name : name,
        contact_person_name: contactPersonName,
        contact_no: contactNo,
        location_coordinates: body.location_coordinates,
        mail_id: mailId,
        cr_no: parent ? null : crNo ?? null,
        cr_expiry_date: parent ? null : crExpiry.value ?? null,
        department,
        parent_client_id: parent?.id ?? null,
        // Pipeline metrics count from the client's first status.
        statusEvents: { create: { to_status: status, owner_id: assignedSalesmanId, actor_id: getTokenUserId(token), org_id: orgId, source: "create" } },
        contacts: { create: extraContacts.map((c) => ({ ...c, created_by_id: getTokenUserId(token) })) },
        contact_person_designation: designation,
        assigned_salesman_id: assignedSalesmanId,
        org_id: orgId,
        notes: body.notes,
        status,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "CR number already exists" }, { status: 409 });
    }
    throw error;
  }

  // A manager / owner handing a new lead to someone else: that salesman gets a follow-up task.
  if (isRole(token, [1, 2]) && assignedSalesmanId !== getTokenUserId(token)) {
    const { created } = await createLeadTasks(prisma, {
      clients: [{ id: client.id, name: client.name, status: client.status, contact_person_name: client.contact_person_name, contact_no: client.contact_no }],
      salesmanId: assignedSalesmanId,
      assignedById: getTokenUserId(token),
    });
    if (created) revalidateTaskViews();
  }
  revalidateTag("salesman-dashboard", { expire: 0 });
  revalidateTag("salesman-clients", { expire: 0 });
  revalidateTag("admin-clients", { expire: 0 });
  revalidateTag("manager-dashboard", { expire: 0 });
  revalidateTag("manager-clients", { expire: 0 });
  return NextResponse.json({ client }, { status: 201 });
}
