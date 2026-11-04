import { test } from "node:test";
import assert from "node:assert/strict";
import { statusChangeError } from "../lib/client-status-flow";

test("salesmen can't set system statuses by hand; managers and the owner can", () => {
  assert.match(statusChangeError(3, "enquiry", "onboarded") ?? "", /first order/);
  assert.match(statusChangeError(3, "lead", "enquiry") ?? "", /enquiry is raised/);
  assert.match(statusChangeError(3, "onboarded", "dormant") ?? "", /60 quiet days/);
  assert.equal(statusChangeError(3, "dormant", "lead"), null); // out of a system status is fine
  assert.equal(statusChangeError(3, "onboarded", "onboarded"), null); // editing other fields keeps the status
  assert.equal(statusChangeError(3, "lead", "contacted"), null);
  assert.equal(statusChangeError(2, "enquiry", "onboarded"), null);
  assert.equal(statusChangeError(1, "lead", "onboarded"), null);
  assert.equal(statusChangeError(6, "lead", "onboarded"), null);
  assert.equal(statusChangeError(3, "lead", "blacklisted"), "Only managers can change the black list");
});
