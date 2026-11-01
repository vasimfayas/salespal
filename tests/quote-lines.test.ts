import { test } from "node:test";
import assert from "node:assert/strict";
import { parseQuoteLines, quoteTotals } from "../lib/quote-lines";

test("profit is selling minus cost across lines", () => {
  const r = parseQuoteLines([
    { label: "Transport", cost: 500, selling: 550 },
    { label: "Clearance", cost: "120.10", selling: "150.25" },
  ]);
  assert.ok(!("error" in r));
  assert.equal(r.cost, 620.1);
  assert.equal(r.profit, 80.15);
  assert.deepEqual(quoteTotals([{ cost: 500, selling: 450 }]), { cost: 500, selling: 450, profit: -50 });
});

test("rejects incomplete lines", () => {
  assert.ok("error" in parseQuoteLines([]));
  assert.ok("error" in parseQuoteLines([{ label: "", cost: 1, selling: 2 }]));
  assert.ok("error" in parseQuoteLines([{ label: "Transport", cost: "", selling: 2 }]));
  assert.ok("error" in parseQuoteLines([{ label: "Transport", cost: -1, selling: 2 }]));
});
