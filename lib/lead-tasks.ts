import type { Prisma, PrismaClient } from "@prisma/client";
import { LEAD_TASK_CATEGORY, OPEN_TASK_STATUSES } from "@/types/task";

type Db = Prisma.TransactionClient | PrismaClient;

/** Days a salesman gets to work a newly assigned lead. */
export const LEAD_TASK_DAYS = 30;

/** Clients still in the lead pipeline. Customers (enquiry / onboarded …) don't get a "new lead" task. */
const LEAD_PIPELINE = ["lead", "contacted", "follow_up", "dormant", "lost"];

type LeadClient = { id: number; name: string; status: string; contact_person_name: string; contact_no: string };

function describe(c: LeadClient) {
  const contact = [c.contact_person_name, c.contact_no].map((v) => v?.trim()).filter((v) => v && v !== "-").join(", ");
  return `New lead assigned: ${c.name}${contact ? ` — ${contact}` : ""}. Contact them and record the outcome (contacted, follow-up or rejected).`;
}

/**
 * A manager handed these clients to a salesman: give the salesman one follow-up task per lead,
 * due in LEAD_TASK_DAYS. Leads that already have an open lead task with this salesman are skipped;
 * an open lead task held by a previous salesman is closed as reassigned, so nobody works the same lead twice.
 */
export async function createLeadTasks(
  db: Db,
  { clients, salesmanId, assignedById }: { clients: LeadClient[]; salesmanId: number; assignedById: number },
) {
  const leads = clients.filter((c) => LEAD_PIPELINE.includes(c.status));
  if (leads.length === 0) return { created: 0, reassigned: 0 };
  const ids = leads.map((c) => c.id);
  const now = new Date();

  const open = await db.task.findMany({
    where: { category: LEAD_TASK_CATEGORY, client_id: { in: ids }, status: { in: [...OPEN_TASK_STATUSES] } },
    select: { id: true, client_id: true, assigned_to_id: true },
  });

  // Previous salesman's open lead tasks → closed as reassigned.
  const stale = open.filter((t) => t.assigned_to_id !== salesmanId);
  if (stale.length) {
    const salesman = await db.user.findUnique({ where: { id: salesmanId }, select: { name: true } });
    await db.task.updateMany({ where: { id: { in: stale.map((t) => t.id) } }, data: { status: "unsuccessful", closed_at: now } });
    await db.taskUpdate.createMany({
      data: stale.map((t) => ({ task_id: t.id, action: "reassigned", note: `Lead reassigned to ${salesman?.name ?? "another salesman"}`, created_by_id: assignedById, created_at: now })),
    });
  }

  const alreadyHas = new Set(open.filter((t) => t.assigned_to_id === salesmanId).map((t) => t.client_id));
  const due = new Date(now.getTime() + LEAD_TASK_DAYS * 86_400_000);
  const toCreate = leads.filter((c) => !alreadyHas.has(c.id));
  if (toCreate.length) {
    await db.task.createMany({
      data: toCreate.map((c) => ({
        category: LEAD_TASK_CATEGORY,
        client_id: c.id,
        assigned_to_id: salesmanId,
        created_by_id: assignedById,
        description: describe(c),
        due_date: due,
        status: "pending",
        notification: true,
      })),
    });
  }
  return { created: toCreate.length, reassigned: stale.length };
}

/** Columns createLeadTasks needs from each client. */
export const leadClientSelect = { id: true, name: true, status: true, contact_person_name: true, contact_no: true } as const;
