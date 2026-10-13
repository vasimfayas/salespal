import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAccountantOrgIds, getManagerOrgIds, getManagerSalesmanIds } from "@/lib/scoping";
import { SUPER_ADMIN_ROLE } from "@/lib/roles";
import { APPROVAL_FLOWS, STEP_LABELS, type ApprovalType, type StepKey } from "@/types/approval";

export { APPROVAL_FLOWS, STEP_LABELS, type ApprovalType, type StepKey };

/**
 * Approval flows. Each type is a fixed list of steps; a request waits on `current_step` until someone allowed
 * for that step approves (moves on / finishes) or rejects (ends it). Every action is logged in approval_actions.
 * The super admin may act on any step.
 *
 *   credit_agreement  accounts → manager → owner   on approval: the client is credit-approved for the agreed days
 *   enquiry           manager                       on approval: the quote may be confirmed
 */

const STEP_ROLE: Record<StepKey, number> = { accounts: 4, manager: 2, management: 1 };

/** Decided requests (and their log) are kept this long. */
export const APPROVAL_KEEP_MONTHS = 6;

export type Approver = { id: number; role_id: number };

export class ApprovalError extends Error {
  constructor(message: string, public status = 409) {
    super(message);
  }
}

/** Requests the user may see: accounts their companies', managers their companies' team clients, owner / super admin all. */
export async function approvalScopeWhere(user: Approver): Promise<Prisma.ApprovalRequestWhereInput> {
  if (user.role_id === SUPER_ADMIN_ROLE || user.role_id === STEP_ROLE.management) return {};
  if (user.role_id === STEP_ROLE.accounts) return { org_id: { in: await getAccountantOrgIds(user.id) } };
  if (user.role_id === STEP_ROLE.manager) {
    const [orgIds, salesmanIds] = await Promise.all([getManagerOrgIds(user.id), getManagerSalesmanIds(user.id)]);
    return { org_id: { in: orgIds }, client: { assigned_salesman_id: { in: [user.id, ...salesmanIds] } } };
  }
  return { id: -1 };
}

/** Pending requests waiting on this user's step (the super admin: every pending request). */
export async function approvalQueueWhere(user: Approver): Promise<Prisma.ApprovalRequestWhereInput> {
  const scope = await approvalScopeWhere(user);
  if (user.role_id === SUPER_ADMIN_ROLE) return { status: "pending" };
  const key = (Object.keys(STEP_ROLE) as StepKey[]).find((k) => STEP_ROLE[k] === user.role_id);
  if (!key) return { id: -1 };
  const waiting = (Object.keys(APPROVAL_FLOWS) as ApprovalType[])
    .filter((t) => APPROVAL_FLOWS[t].steps.includes(key))
    .map((t) => ({ type: t, current_step: APPROVAL_FLOWS[t].steps.indexOf(key) }));
  return { AND: [scope, { status: "pending", OR: waiting }] };
}

/** Starts a request at its first step. An enquiry's earlier pending request (an older quote) is cancelled. */
export async function submitApproval(
  tx: Prisma.TransactionClient,
  input: { type: ApprovalType; org_id: number; client_id: number; enquiry_id?: number; requested_by_id: number; data: Prisma.InputJsonValue },
) {
  if (input.enquiry_id) {
    const stale = await tx.approvalRequest.findMany({ where: { enquiry_id: input.enquiry_id, status: "pending" }, select: { id: true } });
    for (const r of stale) {
      await tx.approvalRequest.update({ where: { id: r.id }, data: { status: "cancelled", decided_at: new Date() } });
      await tx.approvalAction.create({ data: { request_id: r.id, step: -1, action: "cancelled", comment: "Replaced by a new quote", actor_id: input.requested_by_id } });
    }
  }
  const request = await tx.approvalRequest.create({ data: { ...input, enquiry_id: input.enquiry_id ?? null } });
  await tx.approvalAction.create({ data: { request_id: request.id, step: -1, action: "submitted", actor_id: input.requested_by_id } });
  return request;
}

/** Approve (next step, or done) or reject (done) the step a request is waiting on. */
export async function decideApproval(requestId: number, decision: "approved" | "rejected", comment: string | null, user: Approver) {
  if (decision === "rejected" && !comment?.trim()) throw new ApprovalError("Give a reason for rejecting", 400);
  return prisma.$transaction(async (tx) => {
    const request = await tx.approvalRequest.findFirst({ where: { AND: [{ id: requestId }, await approvalQueueWhere(user)] } });
    if (!request) throw new ApprovalError("This request isn't waiting on you (it may have moved on already)", 404);

    const steps = APPROVAL_FLOWS[request.type as ApprovalType].steps;
    const last = request.current_step >= steps.length - 1;
    const done = decision === "rejected" || last;
    await tx.approvalAction.create({
      data: { request_id: request.id, step: request.current_step, action: decision, comment: comment?.trim().slice(0, 500) || null, actor_id: user.id },
    });
    await tx.approvalRequest.update({
      where: { id: request.id },
      data: done ? { status: decision, decided_at: new Date() } : { current_step: request.current_step + 1 },
    });
    if (done) await applyOutcome(tx, request, decision);
    return { status: done ? decision : "pending", nextStep: done ? null : STEP_LABELS[steps[request.current_step + 1]] };
  });
}

/** What a finished request changes outside the approval tables. */
async function applyOutcome(tx: Prisma.TransactionClient, request: { type: string; client_id: number; enquiry_id: number | null; data: Prisma.JsonValue }, outcome: "approved" | "rejected") {
  if (request.type === "credit_agreement" && outcome === "approved") {
    const days = Number((request.data as { credit_days?: unknown }).credit_days);
    await tx.client.update({
      where: { id: request.client_id },
      data: { credit_approved: true, credit_days_approved: Number.isInteger(days) ? days : null, credit_approved_at: new Date() },
    });
  }
  if (request.type === "enquiry" && request.enquiry_id) {
    await tx.enquiry.update({ where: { id: request.enquiry_id }, data: { approval_status: outcome } });
  }
}

/** Whether confirming this quote needs a manager's approval first. */
export function enquiryNeedsApproval(enquiry: { needs_approval: boolean; payment_mode: string }, client: { credit_approved: boolean }) {
  return enquiry.needs_approval || (enquiry.payment_mode === "credit" && !client.credit_approved);
}

export type ApprovalView = Awaited<ReturnType<typeof getApprovalViews>>[number];

/** Requests as plain objects for the screens: who, what, where it is in its flow, and the full log. */
export async function getApprovalViews(where: Prisma.ApprovalRequestWhereInput, take = 50) {
  const rows = await prisma.approvalRequest.findMany({
    where,
    orderBy: [{ created_at: "desc" }, { id: "desc" }],
    take,
    include: {
      client: { select: { id: true, name: true, department: true } },
      organization: { select: { name: true, prefix: true } },
      requestedBy: { select: { name: true } },
      actions: { include: { actor: { select: { name: true } } }, orderBy: { created_at: "asc" } },
    },
  });
  return rows.map((r) => ({
    id: r.id,
    type: r.type as ApprovalType,
    status: r.status,
    current_step: r.current_step,
    waiting_on: r.status === "pending" ? STEP_LABELS[APPROVAL_FLOWS[r.type as ApprovalType].steps[r.current_step]] : null,
    client: { id: r.client.id, name: r.client.department ? `${r.client.name} · ${r.client.department}` : r.client.name },
    company: r.organization.name,
    org_prefix: r.organization.prefix,
    enquiry_id: r.enquiry_id,
    requested_by: r.requestedBy.name,
    created_at: r.created_at.toISOString(),
    decided_at: r.decided_at?.toISOString() ?? null,
    data: r.data as Record<string, unknown>,
    log: r.actions.map((a) => ({ id: a.id, step: a.step, action: a.action, comment: a.comment, actor: a.actor.name, created_at: a.created_at.toISOString() })),
  }));
}
