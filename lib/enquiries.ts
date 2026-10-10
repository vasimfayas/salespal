import type { Prisma } from "@prisma/client";
import { clientLabel } from "@/types/client";
import { companyLogoUrl } from "@/types/company";
import { clientFormPath } from "@/lib/enquiry-client-form";
import { agentQuotePath } from "@/lib/enquiry-agent";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { clientScopeWhere, getAccountantOrgIds, getManagerOrgIds, getManagerSalesmanIds, getSalesmanOrgIds, getTokenUserId, type ScopedToken } from "@/lib/scoping";
import { BLACKLISTED_ERROR, statusAfterEnquiry } from "@/lib/client-status-flow";
import { CONTACT_FIELD_LABELS, missingContactFields } from "@/lib/client-contact";
import { enquiryRef, enquiryStatuses, parseEnquiryRef, type EnquiryListItem, type EnquiryStatus } from "@/types/enquiry";
import { DEFAULT_DIMENSION_UNIT, readPackages } from "@/lib/freight";
import { intParam, literal, pageParam, paging, param, PAGE_SIZE, type Paged, type SearchParams } from "@/lib/list-params";

/** Salesmen: own. Managers: own + their salesmen's. Accountants: their assigned companies' clients. Owner: all. */
export async function enquiryScopeWhere(token: ScopedToken): Promise<Prisma.EnquiryWhereInput> {
  const userId = getTokenUserId(token);
  if (token.role_id === 1) return {};
  if (token.role_id === 4) return { org_id: { in: await getAccountantOrgIds(userId) } };
  if (token.role_id === 2) {
    const salesmanIds = await getManagerSalesmanIds(userId);
    return { created_by_id: { in: [userId, ...salesmanIds] } };
  }
  if (token.role_id === 3) return { created_by_id: userId };
  return { id: -1 };
}

const enquiryListInclude = {
  client: { select: { name: true, department: true, category: true } },
  organization: { select: { id: true, name: true, prefix: true, export_office_no: true, logo_path: true } },
  createdBy: { select: { name: true } },
  order: { select: { id: true, job_no: true, status: true } },
  events: { include: { createdBy: { select: { name: true } } }, orderBy: { created_at: "desc" } },
  cancelledBy: { select: { name: true } },
  followUps: { include: { createdBy: { select: { name: true } } }, orderBy: { created_at: "desc" } },
  followUpTasks: { where: { status: { in: ["pending", "in_process"] } }, select: { id: true } },
  agentRequests: { include: { agent: { select: { name: true, email: true } } }, orderBy: { sent_at: "desc" } },
} satisfies Prisma.EnquiryInclude;

type EnquiryWithList = Prisma.EnquiryGetPayload<{ include: typeof enquiryListInclude }>;

const STATUSES: readonly EnquiryStatus[] = enquiryStatuses;

function toListItem(e: EnquiryWithList): EnquiryListItem {
  return {
    id: e.id,
    ref: enquiryRef(e.id, e.organization.prefix),
    company: { id: e.organization.id, name: e.organization.name, prefix: e.organization.prefix, export_office_no: e.organization.export_office_no, logo_url: companyLogoUrl(e.organization) },
    client_id: e.client_id,
    client_name: clientLabel(e.client),
    client_category: e.client.category,
    enquiry_date: e.enquiry_date.toISOString().slice(0, 10),
    mode: e.mode,
    from: e.from,
    to: e.to,
    collection_address: e.collection_address,
    job_ref: e.job_ref,
    incoterm: e.incoterm,
    payment_mode: e.payment_mode,
    credit_days: e.credit_days,
    clearance: e.clearance,
    is_dg: e.is_dg,
    un_number: e.un_number,
    packages: readPackages(e.packages),
    dimension_unit: e.dimension_unit ?? DEFAULT_DIMENSION_UNIT,
    actual_weight: e.actual_weight?.toNumber() ?? null,
    weight_unit: e.weight_unit ?? "kg",
    stackable: e.stackable,
    chargeable_weight: e.chargeable_weight?.toNumber() ?? null,
    cbm: e.cbm?.toNumber() ?? null,
    service_type: e.service_type,
    reefer_temp: e.reefer_temp?.toNumber() ?? null,
    gauge: e.gauge,
    truck_type: e.truck_type,
    provisional_cost: e.provisional_cost?.toNumber() ?? null,
    provisional_profit: e.provisional_profit?.toNumber() ?? null,
    actual_cost: e.actual_cost?.toNumber() ?? null,
    actual_profit: e.actual_profit?.toNumber() ?? null,
    notes: e.notes,
    status: (STATUSES.includes(e.status as EnquiryStatus) ? e.status : "inquiry_received") as EnquiryStatus,
    created_by: e.createdBy.name,
    created_at: e.created_at.toISOString(),
    order: e.order ? { id: e.order.id, job_no: e.order.job_no, status: e.order.status } : null,
    cancel_reason: e.cancel_reason,
    cancelled_at: e.cancelled_at?.toISOString() ?? null,
    cancelled_by: e.cancelledBy?.name ?? null,
    follow_ups: e.followUps.map((f) => ({ id: f.id, comment: f.comment, by: f.createdBy.name, at: f.created_at.toISOString() })),
    follow_up_due: e.followUpTasks.length > 0,
    events: e.events.map((ev) => ({
      id: ev.id,
      action: ev.action,
      to_status: ev.to_status,
      prev_cost: ev.prev_cost?.toNumber() ?? null,
      prev_profit: ev.prev_profit?.toNumber() ?? null,
      cost: ev.cost?.toNumber() ?? null,
      profit: ev.profit?.toNumber() ?? null,
      note: ev.note,
      order_id: ev.order_id,
      by: ev.createdBy.name,
      at: ev.created_at.toISOString(),
    })),
    client_form: e.client_form_token
      ? { email: e.client_form_email, sent_at: e.client_form_sent_at?.toISOString() ?? null, path: clientFormPath(e.client_form_token) }
      : null,
    agent_requests: e.agentRequests.map((r) => ({
      id: r.id,
      agent: r.agent.name,
      email: r.agent.email,
      sent_at: r.sent_at.toISOString(),
      cost: r.cost?.toNumber() ?? null,
      notes: r.notes,
      replied_at: r.replied_at?.toISOString() ?? null,
      path: agentQuotePath(r.token),
    })),
    client_signature:
      e.client_signed_name && e.client_signed_at
        ? { name: e.client_signed_name, at: e.client_signed_at.toISOString(), url: `/api/enquiries/${e.id}/signature` }
        : null,
  };
}

/** Search by ref (ENQ-00012 / 12), client name or job no. */
function enquirySearchWhere(q: string | undefined): Prisma.EnquiryWhereInput {
  if (!q) return {};
  const or: Prisma.EnquiryWhereInput[] = [
    { client: { name: { contains: literal(q), mode: "insensitive" } } },
    { client: { department: { contains: literal(q), mode: "insensitive" } } },
    { order: { job_no: { contains: literal(q), mode: "insensitive" } } },
  ];
  const refId = parseEnquiryRef(q);
  if (refId) or.push({ id: refId });
  return { OR: or };
}

export type EnquiryPage = Paged<EnquiryListItem> & {
  /** Per-status counts for the filter tabs (scope + search, ignoring the status filter). */
  counts: Record<EnquiryStatus | "all", number>;
  /** Enquiries in scope with an outstanding follow-up task. */
  followUpsDue: number;
  /** Enquiry opened via ?followUp= or ?view=, loaded even when it is not on the current page. */
  focus: EnquiryListItem | null;
};

export async function getEnquiriesPage(token: ScopedToken, params: SearchParams): Promise<EnquiryPage> {
  const page = pageParam(params);
  const status = param(params, "status");
  const scope = await enquiryScopeWhere(token);
  const searched: Prisma.EnquiryWhereInput = { AND: [scope, enquirySearchWhere(param(params, "q"))] };
  const where: Prisma.EnquiryWhereInput = status && STATUSES.includes(status as EnquiryStatus) ? { AND: [searched, { status }] } : searched;
  const focusId = intParam(params, "followUp") ?? intParam(params, "view");

  const [rows, total, grouped, followUpsDue, focus] = await Promise.all([
    prisma.enquiry.findMany({ where, include: enquiryListInclude, orderBy: [{ enquiry_date: "desc" }, { id: "desc" }], ...paging(page) }),
    prisma.enquiry.count({ where }),
    prisma.enquiry.groupBy({ by: ["status"], where: searched, _count: { _all: true } }),
    prisma.enquiry.count({ where: { AND: [scope, { followUpTasks: { some: { status: { in: ["pending", "in_process"] } } } }] } }),
    focusId ? prisma.enquiry.findFirst({ where: { AND: [scope, { id: focusId }] }, include: enquiryListInclude }) : null,
  ]);

  const counts = Object.fromEntries(["all", ...STATUSES].map((k) => [k, 0])) as EnquiryPage["counts"];
  for (const g of grouped) {
    if (g.status in counts) counts[g.status as EnquiryStatus] = g._count._all;
    counts.all += g._count._all;
  }

  return { rows: rows.map(toListItem), total, page, pageSize: PAGE_SIZE, counts, followUpsDue, focus: focus ? toListItem(focus) : null };
}

export function revalidateEnquiryPages() {
  for (const role of ["salesman", "manager", "accountant", "admin"]) revalidatePath(`/dashboard/${role}/enquiries`);
}

/**
 * Checks shared by raising an enquiry and sending the enquiry form to a client: the client is the user's and not
 * black listed, the company is one the user works for (default: the client's), and the client has contact details
 * when raising the enquiry moves their status on.
 */
export async function resolveEnquiryClient(token: ScopedToken, clientId: number, rawOrgId: unknown) {
  const client = await prisma.client.findFirst({
    where: { AND: [{ id: clientId }, await clientScopeWhere(token)] },
    select: { id: true, name: true, org_id: true, status: true, assigned_salesman_id: true, contact_person_name: true, contact_no: true, contact_person_designation: true, mail_id: true },
  });
  if (!client) return { error: "Client not found", status: 404 } as const;
  if (client.status === "blacklisted") return { error: BLACKLISTED_ERROR, status: 403 } as const;

  const orgId = rawOrgId === undefined || rawOrgId === null || rawOrgId === "" ? client.org_id : Number(rawOrgId);
  if (orgId !== client.org_id) {
    const allowed = token.role_id === 3 ? await getSalesmanOrgIds(getTokenUserId(token)) : await getManagerOrgIds(getTokenUserId(token));
    if (!allowed.includes(orgId)) return { error: "You don't work for that company", status: 403 } as const;
  }

  // Raising an enquiry moves the client to "enquiry" (or back to "onboarded" if dormant); past Lead that needs contact details.
  const nextStatus = statusAfterEnquiry(client.status);
  const missing = nextStatus ? missingContactFields(client) : [];
  if (missing.length) {
    return {
      error: `Add the client's ${missing.map((k) => CONTACT_FIELD_LABELS[k].toLowerCase()).join(", ")} before raising an enquiry`,
      status: 422,
      extra: { code: "CONTACT_REQUIRED", missing },
    } as const;
  }
  return { client, orgId, nextStatus } as const;
}
