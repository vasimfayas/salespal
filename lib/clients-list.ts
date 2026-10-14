import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { dateRange, intParam, literal, pageParam, paging, param, sizeParam, type Paged, type SearchParams } from "@/lib/list-params";
import { kycStatus } from "@/types/client";

/** Client columns shown in client tables (no heavy relations). */
export const clientListSelect = {
  id: true,
  name: true,
  contact_person_name: true,
  contact_no: true,
  cr_no: true,
  cr_expiry_date: true,
  location_coordinates: true,
  mail_id: true,
  status: true,
  category: true,
  notes: true,
  created_at: true,
  org_id: true,
  assigned_salesman_id: true,
  contact_person_designation: true,
  department: true,
  parent_client_id: true,
  // Department rows show their company's CR — and use its KYC documents, which live on the company row.
  parent: { select: { cr_no: true, cr_expiry_date: true, documents: { where: { doc_type: { not: null } }, select: { doc_type: true, expiry_date: true } } } },
  documents: { where: { doc_type: { not: null } }, select: { doc_type: true, expiry_date: true } },
  contacts: { select: { name: true, phone: true, email: true }, take: 20 },
  organization: { select: { name: true } },
  assignedSalesman: { select: { name: true } },
} satisfies Prisma.ClientSelect;

export type ClientListRow = Prisma.ClientGetPayload<{ select: typeof clientListSelect }>;

/** A department row has no CR of its own: show its company's. */
export function withCompanyCr<T extends { cr_no: string | null; cr_expiry_date: Date | null; parent: { cr_no: string | null; cr_expiry_date: Date | null } | null }>(c: T): T {
  return c.parent ? { ...c, cr_no: c.cr_no ?? c.parent.cr_no, cr_expiry_date: c.cr_expiry_date ?? c.parent.cr_expiry_date } : c;
}

/** Filters shared by the client tables: q, status, company, manager, salesman, date (+ day). */
export function clientFilterWhere(params: SearchParams): Prisma.ClientWhereInput {
  const and: Prisma.ClientWhereInput[] = [];
  const q = param(params, "q");
  if (q) {
    and.push({
      OR: [
        { name: { contains: literal(q), mode: "insensitive" } },
        { contact_person_name: { contains: literal(q), mode: "insensitive" } },
        { mail_id: { contains: literal(q), mode: "insensitive" } },
        { cr_no: { contains: literal(q), mode: "insensitive" } },
        { parent: { cr_no: { contains: literal(q), mode: "insensitive" } } },
        { department: { contains: literal(q), mode: "insensitive" } },
        { contact_no: { contains: literal(q) } },
      ],
    });
  }
  const status = param(params, "status");
  if (status) and.push({ status });
  const category = param(params, "category");
  if (category) and.push({ category });
  const company = intParam(params, "company");
  if (company) and.push({ org_id: company });
  const manager = intParam(params, "manager");
  if (manager) and.push({ assignedSalesman: { salesmanManager: { some: { manager_id: manager } } } });
  const salesman = intParam(params, "salesman");
  if (salesman) and.push({ assigned_salesman_id: salesman });
  const range = dateRange(param(params, "date"), param(params, "day"));
  if (range) and.push({ created_at: range });
  return and.length ? { AND: and } : {};
}

/** A list row: the client plus whether its KYC documents are complete and in date (the documents themselves are dropped). */
export type ClientListItem = Omit<ClientListRow, "documents" | "parent"> & {
  parent: { cr_no: string | null; cr_expiry_date: Date | null } | null;
  kyc_ok: boolean;
};

function toListItem(row: ClientListRow): ClientListItem {
  const { documents, ...client } = withCompanyCr(row);
  const kycDocs = [...documents, ...(row.parent?.documents ?? [])].map((d) => ({ doc_type: d.doc_type, expiry_date: d.expiry_date?.toISOString().slice(0, 10) ?? null }));
  return { ...client, parent: row.parent && { cr_no: row.parent.cr_no, cr_expiry_date: row.parent.cr_expiry_date }, kyc_ok: kycStatus(kycDocs).ok };
}

export async function getClientsPage(scope: Prisma.ClientWhereInput, params: SearchParams): Promise<Paged<ClientListItem>> {
  const page = pageParam(params);
  const pageSize = sizeParam(params);
  const where: Prisma.ClientWhereInput = { AND: [scope, clientFilterWhere(params)] };
  const [rows, total] = await Promise.all([
    prisma.client.findMany({ where, select: clientListSelect, orderBy: { id: "desc" }, ...paging(page, pageSize) }),
    prisma.client.count({ where }),
  ]);
  return { rows: rows.map(toListItem), total, page, pageSize };
}

/** { status: count } computed in the database — use instead of loading clients just to count them. */
export async function clientStatusCounts(where: Prisma.ClientWhereInput): Promise<Record<string, number>> {
  const rows = await prisma.client.groupBy({ by: ["status"], where, _count: { _all: true } });
  return Object.fromEntries(rows.map((r) => [r.status, r._count._all]));
}
