import { test } from "node:test";
import assert from "node:assert/strict";
import { enquiryNeedsApproval } from "../lib/approvals";

const credit = (days: number | null) => ({ needs_approval: false, payment_mode: "credit", credit_days: days });

test("credit enquiries need approval without an agreement or above its days", () => {
  assert.equal(enquiryNeedsApproval(credit(10), { credit_approved: false, credit_days_approved: null }), true);
  assert.equal(enquiryNeedsApproval(credit(30), { credit_approved: true, credit_days_approved: 30 }), false);
  assert.equal(enquiryNeedsApproval(credit(31), { credit_approved: true, credit_days_approved: 30 }), true);
  assert.equal(enquiryNeedsApproval(credit(90), { credit_approved: true, credit_days_approved: null }), false);
  assert.equal(enquiryNeedsApproval({ needs_approval: false, payment_mode: "cash", credit_days: null }, { credit_approved: false, credit_days_approved: null }), false);
  assert.equal(enquiryNeedsApproval({ needs_approval: true, payment_mode: "cash", credit_days: null }, { credit_approved: true, credit_days_approved: 30 }), true);
});
