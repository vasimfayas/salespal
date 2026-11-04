import { NextResponse, type NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { canAccessSalesman, clientScopeWhere, getManagerOrgIds, getTokenUserId, isRole } from "@/lib/scoping";

import { createLeadTasks, leadClientSelect } from "@/lib/lead-tasks";
import { revalidateTaskViews } from "@/lib/enquiry-follow-ups";
import { isOwnerRole } from "@/lib/roles";
/**
 * Managers reassign several of their organization's clients to one salesman on their team — or to themselves —
 * optionally under another of their companies. The owner / super admin reassign any client to a manager or salesman
 * who works for the client's company — or to themselves. Body: salesman_id, and either client_ids or from_salesman_id (transfer all of that salesman's clients).
 */
export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const owner = isOwnerRole(Number(token.role_id));
  if (!owner && !isRole(token, 2)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const salesmanId = Number(body.salesman_id);
  let clientIds: number[] = Array.isArray(body.client_ids) ? [...new Set<number>(body.client_ids.map(Number))] : [];

  if (!Number.isInteger(salesmanId)) return NextResponse.json({ error: "Invalid salesman" }, { status: 400 });

  // Transfer every client of another salesman on the team (e.g. someone leaving).
  if (body.from_salesman_id !== undefined) {
    const fromId = Number(body.from_salesman_id);
    if (!Number.isInteger(fromId) || fromId === salesmanId) return NextResponse.json({ error: "Pick a different salesman to transfer to" }, { status: 400 });
    if (!(await canAccessSalesman(token, fromId))) return NextResponse.json({ error: "Salesman is not on your team" }, { status: 403 });
    const owned = await prisma.client.findMany({ where: { AND: [{ assigned_salesman_id: fromId }, await clientScopeWhere(token)] }, select: { id: true } });
    if (owned.length === 0) return NextResponse.json({ error: "This salesman has no clients to transfer" }, { status: 400 });
    clientIds = owned.map((c) => c.id);
  }
  if (clientIds.length === 0 || clientIds.some((id) => !Number.isInteger(id))) {
    return NextResponse.json({ error: "Select at least one client" }, { status: 400 });
  }
  const toSelf = salesmanId === getTokenUserId(token);
  if (!toSelf && !(await canAccessSalesman(token, salesmanId))) return NextResponse.json({ error: "Salesman is not on your team" }, { status: 403 });

  // Owner: the target is themselves, a manager or a salesman. Manager: themselves or a salesman.
  const targetRoles = owner ? (toSelf ? [Number(token.role_id)] : [2, 3]) : [toSelf ? 2 : 3];
  const salesman = await prisma.user.findFirst({
    where: { id: salesmanId, role_id: { in: targetRoles } },
    select: { name: true, role_id: true, managerOrgs: { select: { org_id: true } }, salesmanManager: { select: { org_id: true } } },
  });
  if (!salesman) return NextResponse.json({ error: owner ? "Manager or salesman not found" : "Salesman not found" }, { status: 404 });

  // Optional: move the clients to another company the manager is assigned to.
  let org: { id: number; name: string } | null = null;
  if (body.org_id !== undefined && body.org_id !== null && body.org_id !== "") {
    const orgId = Number(body.org_id);
    const managerOrgIds = owner ? [orgId] : await getManagerOrgIds(getTokenUserId(token));
    if (!Number.isInteger(orgId) || !managerOrgIds.includes(orgId)) {
      return NextResponse.json({ error: "Company is not assigned to you" }, { status: 403 });
    }
    org = await prisma.organization.findUnique({ where: { id: orgId }, select: { id: true, name: true } });
    if (!org) return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  const clients = await prisma.client.findMany({
    where: { AND: [{ id: { in: clientIds } }, await clientScopeWhere(token)] },
    select: { id: true, assigned_salesman_id: true, org_id: true },
  });
  if (clients.length !== clientIds.length) return NextResponse.json({ error: "Some clients are outside your organization" }, { status: 403 });

  // The salesman must work for each client's (target) company on this manager's team; the manager for any of their companies.
  // Owner: the person must work for each client's company (a manager assigned to it, or a salesman on a team in it).
  const salesmanOrgIds: number[] | null = owner
    ? toSelf
      ? null
      : (salesman.role_id === 2 ? salesman.managerOrgs : salesman.salesmanManager).map((r) => r.org_id)
    : toSelf
      ? await getManagerOrgIds(getTokenUserId(token))
      : (await prisma.managerSalesman.findMany({ where: { manager_id: getTokenUserId(token), salesman_id: salesmanId }, select: { org_id: true } })).map((r) => r.org_id);
  const outside = new Set(salesmanOrgIds ? clients.map((client) => org?.id ?? client.org_id).filter((id) => !salesmanOrgIds.includes(id)) : []);
  if (outside.size && owner) {
    const names = await prisma.organization.findMany({ where: { id: { in: [...outside] } }, select: { name: true } });
    return NextResponse.json({ error: `${salesman.name} doesn't work for ${names.map((n) => n.name).join(", ")}. Add them to the company first.` }, { status: 403 });
  }
  if (outside.size) {
    const names = await prisma.organization.findMany({ where: { id: { in: [...outside] } }, select: { name: true } });
    return NextResponse.json(
      { error: `${salesman.name} doesn't work for ${names.map((n) => n.name).join(", ")} on your team. Give them the company on the Team page first.` },
      { status: 403 }
    );
  }

  const toMove = clients
    .filter((client) => client.assigned_salesman_id !== salesmanId || (org && client.org_id !== org.id))
    .map((client) => client.id);
  const action = `Assigned to ${salesman.name}${org ? ` (${org.name})` : ""} for follow-up`;
  let tasks = { created: 0, reassigned: 0 };
  if (toMove.length) {
    tasks = await prisma.$transaction(async (tx) => {
      await tx.client.updateMany({
        where: { id: { in: toMove } },
        data: { assigned_salesman_id: salesmanId, ...(org ? { org_id: org.id } : {}) },
      });
      await tx.clientLog.createMany({
        data: toMove.map((id) => ({ client_id: id, action, done_by: getTokenUserId(token) })),
      });
      // One follow-up task per lead for the salesman (lib/lead-tasks.ts).
      const leads = await tx.client.findMany({ where: { id: { in: toMove } }, select: leadClientSelect });
      return createLeadTasks(tx, { clients: leads, salesmanId, assignedById: getTokenUserId(token) });
    });
  }

  revalidateTag("salesman-dashboard", { expire: 0 });
  revalidateTag("salesman-clients", { expire: 0 });
  revalidateTag("admin-clients", { expire: 0 });
  revalidateTag("manager-dashboard", { expire: 0 });
  revalidateTag("manager-clients", { expire: 0 });
  if (tasks.created || tasks.reassigned) revalidateTaskViews();
  return NextResponse.json({ updated: toMove.length, tasks_created: tasks.created });
}
