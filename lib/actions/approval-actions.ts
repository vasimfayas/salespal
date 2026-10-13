"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSalesPalSession } from "@/lib/auth";
import { clientScopeWhere, getManagerOrgIds, getSalesmanOrgIds } from "@/lib/scoping";
import { isOwnerRole } from "@/lib/roles";
import { ApprovalError, decideApproval, submitApproval } from "@/lib/approvals";

type Result = { success: true; message?: string } | { success: false; error: string };

export type CreditRequestInput = {
  org_id: number;
  qatari_in_cr: boolean;
  credit_days: number;
  shipments: number;
  duty: string;
  do: string;
  request: string;
};

/** Sales (salesman / manager) or owner / super admin raise a Credit Agreement request for a client they can see. */
export async function createCreditRequest(clientId: number, input: CreditRequestInput): Promise<Result> {
  const session = await getSalesPalSession();
  if (!session) return { success: false, error: "Please sign in again." };
  const user = session.user;
  if (!isOwnerRole(user.role_id) && user.role_id !== 2 && user.role_id !== 3) return { success: false, error: "Only sales can request credit." };

  const client = await prisma.client.findFirst({
    where: { AND: [{ id: clientId }, await clientScopeWhere(user)] },
    select: {
      id: true,
      name: true,
      department: true,
      cr_no: true,
      cr_expiry_date: true,
      parent: { select: { cr_no: true, cr_expiry_date: true } },
      assignedSalesman: { select: { name: true } },
    },
  });
  if (!client) return { success: false, error: "Client not found." };

  const days = Number(input.credit_days);
  const shipments = Number(input.shipments);
  if (!Number.isInteger(days) || days < 1 || days > 365) return { success: false, error: "Credit days must be a whole number from 1 to 365." };
  if (!Number.isInteger(shipments) || shipments < 0) return { success: false, error: "Number of shipments must be a whole number." };
  const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const request = text(input.request, 2000);
  if (!request) return { success: false, error: "Describe the request." };

  const orgId = Number(input.org_id);
  const allowed = isOwnerRole(user.role_id) ? null : user.role_id === 3 ? await getSalesmanOrgIds(user.id) : await getManagerOrgIds(user.id);
  if (allowed && !allowed.includes(orgId)) return { success: false, error: "You don't work for that company." };
  const org = await prisma.organization.findUnique({ where: { id: orgId }, select: { id: true, name: true } });
  if (!org) return { success: false, error: "Pick a company." };

  if (await prisma.approvalRequest.findFirst({ where: { client_id: client.id, type: "credit_agreement", status: "pending" }, select: { id: true } })) {
    return { success: false, error: "This client already has a credit request waiting for approval." };
  }

  const crNo = client.cr_no ?? client.parent?.cr_no ?? null;
  const crExpiry = client.cr_expiry_date ?? client.parent?.cr_expiry_date ?? null;
  await prisma.$transaction((tx) =>
    submitApproval(tx, {
      type: "credit_agreement",
      org_id: org.id,
      client_id: client.id,
      requested_by_id: user.id,
      // Automatic fields are captured as they were at request time.
      data: {
        company: org.name,
        salesperson: client.assignedSalesman.name,
        customer_name: client.department ? `${client.name} · ${client.department}` : client.name,
        cr_no: crNo,
        cr_expiry: crExpiry ? crExpiry.toISOString().slice(0, 10) : null,
        qatari_in_cr: input.qatari_in_cr === true,
        credit_days: days,
        shipments,
        duty: text(input.duty, 200),
        do: text(input.do, 200),
        request,
      },
    }),
  );
  revalidatePath("/dashboard", "layout");
  return { success: true, message: "Credit request sent to accounts for approval" };
}

/** Approve or reject the step a request is waiting on (the queue decides who may). */
export async function decideApprovalAction(requestId: number, decision: "approved" | "rejected", comment: string): Promise<Result> {
  const session = await getSalesPalSession();
  if (!session) return { success: false, error: "Please sign in again." };
  try {
    const res = await decideApproval(requestId, decision, comment || null, { id: session.user.id, role_id: session.user.role_id });
    revalidatePath("/dashboard", "layout");
    return {
      success: true,
      message: decision === "rejected" ? "Rejected" : res.nextStep ? `Approved — moved to ${res.nextStep}` : "Approved — fully approved",
    };
  } catch (error) {
    if (error instanceof ApprovalError) return { success: false, error: error.message };
    throw error;
  }
}
