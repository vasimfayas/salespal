import { prisma } from "@/lib/prisma";
import { applyClientStatus } from "@/lib/client-status-flow";
import { cleanText, contactRequiredMessage, missingContactFields } from "@/lib/client-contact";
import { LEAD_TASK_CATEGORY, isOpenTask, leadOutcomeLabels, type LeadOutcome } from "@/types/task";
import type { ClientStatus } from "@/types/client";

/**
 * Lead follow-up outcomes. One call updates the task, the client and both histories together,
 * so the salesman never enters the same thing twice:
 *   contacted → client contact details + status "contacted", task done
 *   follow_up → reason + new due date, client status "follow_up", task stays open
 *   rejected  → reason, client status "lost", task closed unsuccessful
 * The client only moves forward through the lead stages; customers further along are never pulled back.
 */

export class OutcomeError extends Error {
  constructor(message: string, public status = 400, public extra?: Record<string, unknown>) {
    super(message);
  }
}

/** Status a lead outcome moves the client to, if the client is at or before that stage. */
const OUTCOME_STATUS: Record<LeadOutcome, ClientStatus> = { contacted: "contacted", follow_up: "follow_up", rejected: "lost" };
const MOVES_FROM: Record<LeadOutcome, readonly string[]> = {
  contacted: ["lead", "dormant", "lost"],
  follow_up: ["lead", "contacted", "dormant", "lost"],
  rejected: ["lead", "contacted", "follow_up", "dormant"],
};

const DAY = 86_400_000;
const todayUtc = () => {
  const n = new Date();
  return new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate()));
};

export type OutcomeInput = {
  outcome: LeadOutcome;
  /** Contacted: who was reached. */
  contact_person_name?: string;
  contact_no?: string;
  contact_person_designation?: string;
  mail_id?: string;
  /** Follow-up / rejected: why (required). Contacted: optional note. */
  note?: string;
  /** Follow-up: next due date, YYYY-MM-DD, after today. */
  due_date?: string;
};

export async function applyLeadOutcome(taskId: number, input: OutcomeInput, actorId: number) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { client: true },
  });
  if (!task || task.category !== LEAD_TASK_CATEGORY || !task.client) throw new OutcomeError("This isn't a lead follow-up task", 400);
  if (!isOpenTask(task.status)) throw new OutcomeError("This task is already closed", 409);
  const client = task.client;
  if (client.status === "blacklisted") throw new OutcomeError("This client is on the black list", 409);

  const note = cleanText(input.note) || "";
  if (note.length > 1000) throw new OutcomeError("Note is too long (1000 characters max)");
  const now = new Date();

  if (input.outcome === "contacted") {
    const fields = {
      contact_person_name: cleanText(input.contact_person_name) ?? "",
      contact_no: cleanText(input.contact_no) ?? "",
      contact_person_designation: cleanText(input.contact_person_designation) ?? "",
    };
    const missing = missingContactFields(fields);
    if (missing.length) throw new OutcomeError(contactRequiredMessage(missing), 422, { code: "CONTACT_REQUIRED", missing });
    const mail = cleanText(input.mail_id) || null;
    // Same duplicate rule as editing a client: phone / email can't belong to another client.
    const duplicate = await prisma.client.findFirst({
      where: { id: { not: client.id }, OR: [{ contact_no: fields.contact_no }, ...(mail ? [{ mail_id: mail }] : [])] },
      select: { name: true },
    });
    if (duplicate) throw new OutcomeError(`That phone or email already belongs to ${duplicate.name}`, 409);

    await prisma.$transaction(async (tx) => {
      await tx.client.update({ where: { id: client.id }, data: { ...fields, ...(mail ? { mail_id: mail } : {}) } });
      if (MOVES_FROM.contacted.includes(client.status)) {
        await applyClientStatus(tx, client, OUTCOME_STATUS.contacted, actorId, { reason: "lead contacted" });
      }
      const summary = `Contacted ${fields.contact_person_name} (${fields.contact_person_designation}, ${fields.contact_no}${mail ? `, ${mail}` : ""})${note ? ` — ${note}` : ""}`;
      await tx.task.update({ where: { id: task.id }, data: { status: "achieved", outcome: "contacted", closed_at: now } });
      await tx.taskUpdate.create({ data: { task_id: task.id, action: "contacted", note: summary, created_by_id: actorId } });
      await tx.clientLog.create({ data: { client_id: client.id, action: summary, done_by: actorId } });
    });
    return { status: "achieved", outcome: "contacted" as const };
  }

  if (!note) throw new OutcomeError(input.outcome === "rejected" ? "Give the reason the lead was rejected" : "Give the reason for the follow-up");

  if (input.outcome === "follow_up") {
    const due = input.due_date ? new Date(`${input.due_date}T00:00:00Z`) : new Date(todayUtc().getTime() + 7 * DAY);
    if (Number.isNaN(due.getTime()) || due.getTime() <= todayUtc().getTime()) throw new OutcomeError("Pick a follow-up date after today");
    await prisma.$transaction(async (tx) => {
      // Follow-up status needs contact details (client-contact rule); without them the lead stays a lead.
      if (MOVES_FROM.follow_up.includes(client.status) && missingContactFields(client).length === 0) {
        await applyClientStatus(tx, client, OUTCOME_STATUS.follow_up, actorId, { reason: note });
      }
      await tx.task.update({ where: { id: task.id }, data: { status: "in_process", outcome: "follow_up", due_date: due } });
      await tx.taskUpdate.create({
        data: { task_id: task.id, action: "follow_up", note, prev_due_date: task.due_date, new_due_date: due, created_by_id: actorId },
      });
      await tx.clientLog.create({
        data: { client_id: client.id, action: `Follow-up planned for ${due.toISOString().slice(0, 10)}: ${note}`, done_by: actorId },
      });
    });
    return { status: "in_process", outcome: "follow_up" as const, due_date: due.toISOString() };
  }

  // rejected
  await prisma.$transaction(async (tx) => {
    if (MOVES_FROM.rejected.includes(client.status)) {
      await applyClientStatus(tx, client, OUTCOME_STATUS.rejected, actorId, { reason: note });
    }
    await tx.task.update({ where: { id: task.id }, data: { status: "unsuccessful", outcome: "rejected", closed_at: now } });
    await tx.taskUpdate.create({ data: { task_id: task.id, action: "rejected", note, created_by_id: actorId } });
    await tx.clientLog.create({ data: { client_id: client.id, action: `Lead ${leadOutcomeLabels.rejected.toLowerCase()}: ${note}`, done_by: actorId } });
  });
  return { status: "unsuccessful", outcome: "rejected" as const };
}
