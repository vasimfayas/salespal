import { Prisma } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { DORMANT_AFTER_DAYS, MANAGER_ONLY_STATUSES, clientStatuses, type ClientStatus } from "@/types/client";

/**
 * Automatic client status moves:
 *   raise an enquiry  → lead / contacted / follow up / lost become "enquiry"; dormant returns to "onboarded"
 *   first order       → anything short of onboarded becomes "onboarded"
 *   60 days quiet     → onboarded becomes "dormant" (sweepDormantClients)
 * Black-listed clients can't get new enquiries or orders.
 */

export function isClientStatus(value: unknown): value is ClientStatus {
  return typeof value === "string" && (clientStatuses as readonly string[]).includes(value);
}

/** Only managers (2) and admins (1) may set or clear a manager-only status. */
export function canSetStatus(roleId: number, from: string, to: string) {
  const restricted = MANAGER_ONLY_STATUSES as readonly string[];
  if (!restricted.includes(from) && !restricted.includes(to)) return true;
  return roleId === 1 || roleId === 2;
}

export const BLACKLISTED_ERROR = "This client is on the black list — no new enquiries or orders.";

export function statusAfterEnquiry(current: string): ClientStatus | null {
  if (current === "dormant") return "onboarded";
  if (current === "lead" || current === "contacted" || current === "follow_up" || current === "lost") return "enquiry";
  return null;
}

export function statusAfterOrder(current: string): ClientStatus | null {
  return current === "onboarded" || current === "blacklisted" ? null : "onboarded";
}

type Tx = Prisma.TransactionClient;

/** What caused a status change (client_status_events.source). */
export type StatusSource = "manual" | "lead_outcome" | "enquiry" | "order" | "dormant_sweep" | "create";

/**
 * The one place a client's status changes (besides creation and the dormant sweep's bulk SQL): updates the status
 * and when it was entered, writes the history line, and records a status event credited to the client's salesman.
 * A "change" to the status the client already has records nothing. Returns whether the status changed.
 */
export async function applyClientStatus(
  tx: Tx,
  client: { id: number },
  status: ClientStatus,
  doneBy: number,
  { reason, source }: { reason?: string; source: StatusSource },
) {
  const current = await tx.client.findUniqueOrThrow({ where: { id: client.id }, select: { status: true, assigned_salesman_id: true, org_id: true } });
  if (current.status === status) return false;
  const now = new Date();
  await tx.client.update({ where: { id: client.id }, data: { status, status_changed_at: now } });
  await tx.clientLog.create({
    data: { client_id: client.id, action: `Status changed to ${status}${reason ? ` (${reason})` : ""}`, done_by: doneBy, created_at: now },
  });
  await tx.clientStatusEvent.create({
    data: {
      client_id: client.id,
      from_status: current.status,
      to_status: status,
      owner_id: current.assigned_salesman_id,
      actor_id: doneBy,
      org_id: current.org_id,
      source,
      created_at: now,
    },
  });
  return true;
}

export function revalidateClientViews() {
  for (const tag of ["salesman-dashboard", "salesman-clients", "admin-clients", "manager-dashboard", "manager-clients"]) {
    revalidateTag(tag, { expire: 0 });
  }
}

const SWEEP_EVERY_MS = 60 * 60 * 1000;
let lastSweep = 0;

/**
 * Onboarded clients whose latest enquiry / order (or creation, if neither) is older than
 * DORMANT_AFTER_DAYS become "dormant". Runs at most hourly per server process; the log entry
 * is attributed to the assigned salesman (logs need an author).
 */
export async function sweepDormantClients(force = false) {
  if (!force && Date.now() - lastSweep < SWEEP_EVERY_MS) return 0;
  lastSweep = Date.now();

  const moved = await prisma.$queryRaw<{ id: number }[]>(Prisma.sql`
    WITH stale AS (
      SELECT c.id, c.assigned_salesman_id
      FROM clients c
      WHERE c.status = 'onboarded'
        AND COALESCE(
              GREATEST(
                (SELECT MAX(e.enquiry_date) FROM enquiries e WHERE e.client_id = c.id),
                (SELECT MAX(o.created_at)::date FROM orders o WHERE o.client_id = c.id)
              ),
              c.created_at::date
            ) < CURRENT_DATE - ${DORMANT_AFTER_DAYS}::int
    ),
    updated AS (
      UPDATE clients c SET status = 'dormant', status_changed_at = NOW()
      FROM stale s
      WHERE c.id = s.id AND c.status = 'onboarded'
      RETURNING c.id, c.assigned_salesman_id, c.org_id
    ),
    events AS (
      INSERT INTO client_status_events (client_id, from_status, to_status, owner_id, actor_id, org_id, source, created_at)
      SELECT id, 'onboarded', 'dormant', assigned_salesman_id, NULL, org_id, 'dormant_sweep', NOW()
      FROM updated
    ),
    logged AS (
      INSERT INTO client_logs (client_id, action, done_by, created_at)
      SELECT id, ${`Status changed to dormant (no enquiry in ${DORMANT_AFTER_DAYS} days)`}, assigned_salesman_id, NOW()
      FROM updated
      RETURNING client_id
    )
    SELECT client_id AS id FROM logged`);

  if (moved.length > 0) revalidateClientViews();
  return moved.length;
}
