/** Approval flow definitions and shapes shared by server and browser (no server imports). */

export type ApprovalType = "credit_agreement" | "enquiry";
export type StepKey = "accounts" | "manager" | "management";

export const STEP_LABELS: Record<StepKey, string> = { accounts: "Accounts", manager: "Manager", management: "Owner" };

/** Each type's steps, in order (the "flow"). */
export const APPROVAL_FLOWS: Record<ApprovalType, { label: string; steps: StepKey[] }> = {
  credit_agreement: { label: "Credit agreement", steps: ["accounts", "manager", "management"] },
  enquiry: { label: "Enquiry quote", steps: ["manager"] },
};

/** The Credit Agreement form as stored on the request (automatic fields captured at request time). */
export type CreditAgreementData = {
  company: string;
  salesperson: string;
  customer_name: string;
  cr_no: string | null;
  cr_expiry: string | null;
  qatari_in_cr: boolean;
  credit_days: number;
  shipments: number;
  duty: string;
  do: string;
  request: string;
};

/** Snapshot of the quote sent for an enquiry approval. */
export type EnquiryApprovalData = { cost: number; profit: number; payment_mode: string; credit_days: number | null; mode: string; from: string; to: string };

export type ApprovalLogEntry = { id: number; step: number; action: string; comment: string | null; actor: string; created_at: string };

/** "Accounts", "Manager"… for a step of a type; "Request" for the submit row (-1). */
export function stepLabel(type: string, step: number) {
  const steps = APPROVAL_FLOWS[type as ApprovalType]?.steps ?? [];
  return step < 0 ? "Request" : (STEP_LABELS[steps[step]] ?? `Step ${step + 1}`);
}
