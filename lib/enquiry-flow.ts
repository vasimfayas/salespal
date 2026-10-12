import { Prisma } from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { closeFollowUpTasks, noteFollowUpTasks, nextFollowUpDate, revalidateTaskViews } from "@/lib/enquiry-follow-ups";
import { syncOrderPayments, isFullyPaid } from "@/lib/order-payments";
import { missingContactFields, contactRequiredMessage } from "@/lib/client-contact";
import { BLACKLISTED_ERROR, applyClientStatus, revalidateClientViews, statusAfterOrder } from "@/lib/client-status-flow";
import { revalidateEnquiryPages } from "@/lib/enquiries";
import { enquiryRef, isLostReason, lostReasonText, type EnquiryStatus } from "@/types/enquiry";
import { REVISION_TASK_CATEGORY } from "@/types/task";
import type { OrderStatus } from "@/types/order";

import { num } from "@/lib/decimal";
import { SUPER_ADMIN_ROLE } from "@/lib/roles";
/**
 * Enquiry → order workflow.
 *
 * Enquiry (salesman / manager):
 *   inquiry_received | with_agent ─quote→ quoted ─requote→ quoted (new figures; history keeps the old)
 *   quoted | revision_requested ─confirm→ confirmed  (creates the order in "transit", or reopens a sent-back one)
 *   revision_requested ─requote→ quoted
 *   any active stage ─lose (reason)→ lost
 *
 * Order:
 *   transit ─deliver (accounts)→ delivered ─complete (accounts, paid in full)→ completed
 *   transit | delivered ─request revision (salesman / manager, reason)→ revision_requested
 *       (the enquiry becomes "revision_requested"; re-confirming reopens the same order in "transit")
 *   transit | delivered ─cancel (manager / accounts, reason)→ cancelled  (the enquiry becomes lost)
 */

export class FlowError extends Error {
  constructor(message: string, public status = 409, public extra?: Record<string, unknown>) {
    super(message);
  }
}

type Tx = Prisma.TransactionClient;
type Actor = { id: number; role_id: number };

const ROLE = { admin: 1, manager: 2, salesman: 3, accountant: 4, operations: 5, superAdmin: SUPER_ADMIN_ROLE } as const;

/** Operations only price enquiries; every other stage move stays with sales. */
const OPERATIONS_ACTIONS: readonly EnquiryAction[] = ["quote", "requote"];

function money(value: unknown, label: string, { allowNegative = false } = {}) {
  const n = Number(value);
  if (value === undefined || value === null || value === "" || !Number.isFinite(n) || (!allowNegative && n < 0)) {
    throw new FlowError(`Enter a valid ${label}`, 400);
  }
  return Math.round(n * 100) / 100;
}

/** A lost reason picked from the list plus an optional remark → what's stored on the enquiry / order. */
function requireLostReason(body: { reason?: unknown; remark?: unknown }) {
  if (!isLostReason(body.reason)) throw new FlowError("Pick why it was lost", 400);
  const remark = typeof body.remark === "string" ? body.remark.trim().slice(0, 500) : "";
  return { lost_reason: body.reason, text: lostReasonText(body.reason, remark || null) };
}

function requireReason(reason: unknown) {
  const text = typeof reason === "string" ? reason.trim() : "";
  if (!text) throw new FlowError("A reason is required", 400);
  return text;
}

async function logEvent(
  tx: Tx,
  data: {
    enquiry_id: number;
    action: string;
    from_status?: string | null;
    to_status?: string | null;
    prev_cost?: number | null;
    prev_profit?: number | null;
    cost?: number | null;
    profit?: number | null;
    note?: string | null;
    order_id?: number | null;
    created_by_id: number;
  },
) {
  await tx.enquiryEvent.create({ data });
}

/* ───────────────────────────── Enquiry stages ───────────────────────────── */

export type EnquiryAction = "quote" | "requote" | "confirm" | "lose";

const FROM: Record<EnquiryAction, readonly EnquiryStatus[]> = {
  quote: ["inquiry_received", "with_agent"],
  requote: ["quoted", "revision_requested"],
  confirm: ["quoted", "revision_requested"],
  lose: ["sent_to_client", "inquiry_received", "with_agent", "quoted", "revision_requested"],
};

const ACTION_VERB: Record<EnquiryAction, string> = {
  quote: "quoted",
  requote: "requoted",
  confirm: "confirmed",
  lose: "marked lost",
};

/** Applies one stage action to an enquiry the caller has already scoped. Returns the new status and any order created. */
export async function applyEnquiryAction(
  enquiryId: number,
  action: EnquiryAction,
  body: { cost?: unknown; profit?: unknown; reason?: unknown; remark?: unknown },
  actor: Actor,
) {
  const sales = actor.role_id === ROLE.salesman || actor.role_id === ROLE.manager || actor.role_id === ROLE.superAdmin;
  if (!sales && !(actor.role_id === ROLE.operations && OPERATIONS_ACTIONS.includes(action))) {
    throw new FlowError(
      actor.role_id === ROLE.operations ? "Operations can only quote enquiries" : "Only salesmen and managers can move an enquiry through its stages",
      403,
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    const enquiry = await tx.enquiry.findUniqueOrThrow({
      where: { id: enquiryId },
      include: {
        order: { select: { id: true } },
        client: {
          select: { id: true, status: true, assigned_salesman_id: true, contact_person_name: true, contact_no: true, contact_person_designation: true },
        },
      },
    });
    const from = enquiry.status as EnquiryStatus;
    if (!FROM[action].includes(from)) {
      throw new FlowError(`An enquiry that is ${from.replace(/_/g, " ")} can't be ${ACTION_VERB[action]}`);
    }
    const prevCost = enquiry.provisional_cost?.toNumber() ?? null;
    const prevProfit = enquiry.provisional_profit?.toNumber() ?? null;
    const base = { enquiry_id: enquiry.id, from_status: from, created_by_id: actor.id };

    if (action === "quote" || action === "requote") {
      const cost = money(body.cost, "cost");
      const profit = money(body.profit, "profit", { allowNegative: true });
      const to: EnquiryStatus = "quoted";
      // Moving the enquiry on restarts the 30-day clock; its follow-up task stays open until the order is created.
      await tx.enquiry.update({
        where: { id: enquiry.id },
        data: { status: to, provisional_cost: cost, provisional_profit: profit, next_follow_up_at: nextFollowUpDate() },
      });
      // A requote keeps the previous figures in the history (prev_cost / prev_profit).
      await logEvent(tx, { ...base, action: action === "quote" ? "quoted" : "requoted", to_status: to, prev_cost: prevCost, prev_profit: prevProfit, cost, profit });
      await noteFollowUpTasks(tx, enquiry.id, { action: "enquiry_stage", note: action === "quote" ? "Quoted" : "Requoted", by: actor.id });
      // An order sent back for revision is done once the enquiry is requoted.
      if (action === "requote") await closeFollowUpTasks(tx, enquiry.id, "achieved", { action: "enquiry_stage", note: "Requoted", by: actor.id }, "revision");
      return { status: to, orderId: null };
    }

    if (action === "lose") {
      const { lost_reason, text: reason } = requireLostReason(body);
      await tx.enquiry.update({
        where: { id: enquiry.id },
        data: { status: "lost", lost_reason, cancel_reason: reason, cancelled_at: new Date(), cancelled_by_id: actor.id },
      });
      await closeFollowUpTasks(tx, enquiry.id, "unsuccessful", { action: "enquiry_closed", note: `Enquiry marked lost: ${reason}`, by: actor.id });
      await logEvent(tx, { ...base, action: "lost", to_status: "lost", note: reason });
      return { status: "lost" as const, orderId: null };
    }

    // confirm → create the order
    if (enquiry.order) throw new FlowError("This enquiry already has an active order");
    if (prevCost === null || prevProfit === null) throw new FlowError("Quote a cost and profit before confirming");
    if (enquiry.client.status === "blacklisted") throw new FlowError(BLACKLISTED_ERROR, 403);
    const missing = missingContactFields(enquiry.client);
    if (missing.length) throw new FlowError(`Add the client's contact details first (${contactRequiredMessage(missing)})`, 422, { code: "CONTACT_REQUIRED", missing });

    // An order sent back for revision is reopened rather than replaced: same order no, job no,
    // invoice details and payments; only the amount follows the revised offer.
    const revised = await tx.order.findFirst({
      where: { origin_enquiry_id: enquiry.id, status: "revision_requested" },
      orderBy: { updated_at: "desc" },
    });
    if (revised) {
      const amount = prevCost + prevProfit;
      if (num(revised.paid_total) > amount + 0.005) {
        throw new FlowError(`Order #${String(revised.id).padStart(5, "0")} already has ${revised.paid_total.toFixed(2)} paid, more than the revised amount`);
      }
      await tx.order.update({
        where: { id: revised.id },
        data: { status: "transit", enquiry_id: enquiry.id, closed_reason: null, amount, payment_mode: enquiry.payment_mode },
      });
      await syncOrderPayments(tx, revised.id);
      await tx.enquiry.update({ where: { id: enquiry.id }, data: { status: "confirmed" } });
      await closeFollowUpTasks(tx, enquiry.id, "achieved", { action: "enquiry_stage", note: "Enquiry confirmed — order reopened", by: actor.id });
      await logEvent(tx, {
        ...base, action: "order_reopened", to_status: "confirmed", cost: prevCost, profit: prevProfit, order_id: revised.id,
        prev_cost: null, prev_profit: null, note: `Order amount ${revised.amount.toFixed(2)} → ${amount.toFixed(2)}`,
      });
      const next = statusAfterOrder(enquiry.client.status);
      if (next) await applyClientStatus(tx, enquiry.client, next, actor.id, { reason: "order reopened", source: "order" });
      return { status: "confirmed" as const, orderId: revised.id, reopened: true, clientChanged: !!next };
    }

    const order = await tx.order.create({
      data: {
        client_id: enquiry.client_id,
        org_id: enquiry.org_id,
        mode: enquiry.mode,
        description:
          enquiry.notes ||
          `${enquiry.incoterm ? `${enquiry.incoterm} · ` : ""}${enquiry.job_ref ? `${enquiry.job_ref} ` : ""}${enquiry.mode} freight ${enquiry.from} → ${enquiry.to}${enquiry.clearance ? " incl. clearance" : ""}`,
        payment_mode: enquiry.payment_mode,
        amount: prevCost + prevProfit,
        from: enquiry.from,
        to: enquiry.to,
        status: "transit",
        created_by_id: enquiry.created_by_id,
        enquiry_id: enquiry.id,
        origin_enquiry_id: enquiry.id,
      },
    });
    await syncOrderPayments(tx, order.id);
    await tx.enquiry.update({ where: { id: enquiry.id }, data: { status: "confirmed" } });
    await closeFollowUpTasks(tx, enquiry.id, "achieved", { action: "enquiry_stage", note: "Enquiry confirmed — order created", by: actor.id });
    await logEvent(tx, { ...base, action: "confirmed", to_status: "confirmed", cost: prevCost, profit: prevProfit, order_id: order.id });

    const clientNext = statusAfterOrder(enquiry.client.status);
    if (clientNext) await applyClientStatus(tx, enquiry.client, clientNext, actor.id, { reason: "order created", source: "order" });
    return { status: "confirmed" as const, orderId: order.id, reopened: false, clientChanged: !!clientNext };
  });

  revalidateEnquiryPages();
  revalidateTaskViews(); // every stage move updates or closes the enquiry's tasks
  if (result.orderId) revalidateOrderViews();
  if ("clientChanged" in result && result.clientChanged) revalidateClientViews();
  return result;
}

/* ───────────────────────────── Order statuses ───────────────────────────── */

export type OrderAction = "deliver" | "complete" | "request_revision" | "cancel";

export function revalidateOrderViews() {
  for (const tag of ["salesman-orders", "manager-orders", "accountant-orders", "order-stats"]) revalidateTag(tag, { expire: 0 });
  for (const role of ["salesman", "manager", "accountant"]) revalidatePath(`/dashboard/${role}/orders`);
  revalidatePath("/dashboard/accountant");
}

const ORDER_RULES: Record<OrderAction, { from: readonly OrderStatus[]; to: OrderStatus; roles: readonly number[] }> = {
  deliver: { from: ["transit"], to: "delivered", roles: [ROLE.accountant, ROLE.admin] },
  complete: { from: ["delivered"], to: "completed", roles: [ROLE.accountant, ROLE.admin] },
  request_revision: { from: ["transit", "delivered"], to: "revision_requested", roles: [ROLE.salesman, ROLE.manager] },
  cancel: { from: ["transit", "delivered"], to: "cancelled", roles: [ROLE.manager, ROLE.accountant, ROLE.admin] },
};

export function allowedOrderActions(status: string, roleId: number): OrderAction[] {
  return (Object.keys(ORDER_RULES) as OrderAction[]).filter(
    (a) => ORDER_RULES[a].from.includes(status as OrderStatus) && (roleId === ROLE.superAdmin || ORDER_RULES[a].roles.includes(roleId)),
  );
}

/** Returns the order's new status: "deliver" on an order already paid in full goes straight to "completed". */
export async function applyOrderAction(orderId: number, action: OrderAction, body: { reason?: unknown; remark?: unknown }, actor: Actor) {
  const rule = ORDER_RULES[action];
  if (actor.role_id !== ROLE.superAdmin && !rule.roles.includes(actor.role_id)) throw new FlowError("You don't have permission for this action", 403);

  const newStatus = await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUniqueOrThrow({ where: { id: orderId } });
    if (!rule.from.includes(order.status as OrderStatus)) {
      throw new FlowError(`An order in ${order.status.replace(/_/g, " ")} can't be moved to ${rule.to.replace(/_/g, " ")}`);
    }

    if (action === "deliver" && (!order.job_no || !order.invoice_date)) {
      throw new FlowError("Add the job no and invoice date before marking it delivered");
    }
    if (action === "complete" && !isFullyPaid(num(order.paid_total), num(order.amount))) {
      throw new FlowError("Record the full payment before completing the order");
    }

    // Cancelling loses the enquiry: a reason from the list (+ remark). A revision request explains itself in free text.
    const lost = action === "cancel" ? requireLostReason(body) : null;
    const reason = action === "request_revision" ? requireReason(body.reason) : lost?.text ?? null;
    const to = action === "deliver" && isFullyPaid(num(order.paid_total), num(order.amount)) ? "completed" : rule.to;
    await tx.order.update({
      where: { id: order.id },
      data: {
        status: to,
        closed_reason: reason ?? undefined,
        // Release the link while the enquiry is renegotiated; re-confirming reopens this order via origin_enquiry_id.
        enquiry_id: action === "request_revision" ? null : undefined,
      },
    });

    const enquiryId = order.enquiry_id;
    if (!enquiryId) return to;
    if (action === "request_revision") {
      const enquiry = await tx.enquiry.update({
        where: { id: enquiryId },
        data: { status: "revision_requested" },
        select: { created_by_id: true, organization: { select: { prefix: true } } },
      });
      // The enquiry's salesman revises the offer; the task completes when they do (or re-confirm, or it's lost).
      await tx.task.create({
        data: {
          enquiry_id: enquiryId,
          category: REVISION_TASK_CATEGORY,
          assigned_to_id: enquiry.created_by_id,
          created_by_id: actor.id,
          description: `Revise the offer for enquiry ${enquiryRef(enquiryId, enquiry.organization.prefix)} — order #${String(order.id).padStart(5, "0")} was sent back for revision: ${reason}`,
          due_date: new Date(new Date().toISOString().slice(0, 10)),
          status: "pending",
          notification: true,
        },
      });
      await logEvent(tx, {
        enquiry_id: enquiryId, action: "revision_requested", from_status: "confirmed", to_status: "revision_requested",
        note: reason, order_id: order.id, created_by_id: actor.id,
      });
    } else if (action === "cancel") {
      await tx.enquiry.update({
        where: { id: enquiryId },
        data: { status: "lost", lost_reason: lost!.lost_reason, cancel_reason: reason, cancelled_at: new Date(), cancelled_by_id: actor.id },
      });
      await logEvent(tx, {
        enquiry_id: enquiryId, action: "order_cancelled", from_status: "confirmed", to_status: "lost",
        note: reason, order_id: order.id, created_by_id: actor.id,
      });
    }
    return to;
  });

  revalidateOrderViews();
  if (action === "request_revision" || action === "cancel") revalidateEnquiryPages();
  if (action === "request_revision") revalidateTaskViews();
  return newStatus;
}

/** Accounts fill in the operational details: job no, actual cost / profit, invoice and due dates. */
export async function updateOrderDetails(
  orderId: number,
  body: { job_no?: unknown; actual_cost?: unknown; actual_profit?: unknown; invoice_date?: unknown; due_date?: unknown; credit_days?: unknown },
  actor: Actor,
  parseDate: (v: unknown) => Date | null,
) {
  if (actor.role_id !== ROLE.accountant && actor.role_id !== ROLE.admin && actor.role_id !== ROLE.superAdmin) {
    throw new FlowError("Only accounts can update order details", 403);
  }

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUniqueOrThrow({ where: { id: orderId }, include: { enquiry: true } });
    if (order.status !== "transit" && order.status !== "delivered") {
      throw new FlowError("Only orders in transit or delivered can be edited");
    }

    const jobNo = typeof body.job_no === "string" ? body.job_no.trim().toUpperCase() : "";
    if (!jobNo) throw new FlowError("Job no is required", 400);
    const invoiceDate = parseDate(body.invoice_date);
    if (!invoiceDate) throw new FlowError("Enter a valid invoice date", 400);

    let dueDate: Date | null = null;
    if (order.payment_mode === "credit") {
      const days = Number(body.credit_days ?? order.enquiry?.credit_days);
      if (!Number.isInteger(days) || days < 0) throw new FlowError("Credit days must be a whole number", 400);
      dueDate = new Date(invoiceDate.getTime() + days * 86_400_000);
    } else if (body.due_date) {
      dueDate = parseDate(body.due_date);
      if (!dueDate) throw new FlowError("Enter a valid due date", 400);
      if (dueDate < invoiceDate) throw new FlowError("Due date cannot be before the invoice date", 400);
    }

    let amount = num(order.amount);
    if (order.enquiry) {
      const cost = money(body.actual_cost, "actual cost");
      const profit = money(body.actual_profit, "actual profit", { allowNegative: true });
      amount = cost + profit;
      if (amount < 0) throw new FlowError("Cost + profit cannot be negative", 400);
      if (num(order.paid_total) > amount + 0.005) throw new FlowError("Order amount cannot be less than what has already been paid", 400);
      await tx.enquiry.update({ where: { id: order.enquiry.id }, data: { actual_cost: cost, actual_profit: profit } });
    }

    try {
      await tx.order.update({ where: { id: order.id }, data: { job_no: jobNo, invoice_date: invoiceDate, due_date: dueDate, amount } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") throw new FlowError("Job no already exists");
      throw error;
    }
    await syncOrderPayments(tx, order.id);
  }).then(() => {
    revalidateOrderViews();
    revalidateEnquiryPages();
  });
}

