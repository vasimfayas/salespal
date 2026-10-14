import test from "node:test";
import assert from "node:assert/strict";
import { isFullyPaid } from "../lib/order-payments";

test("fully paid allows half a cent of rounding", () => {
  assert.equal(isFullyPaid(100, 100), true);
  assert.equal(isFullyPaid(99.996, 100), true);
  assert.equal(isFullyPaid(99.9, 100), false);
});
