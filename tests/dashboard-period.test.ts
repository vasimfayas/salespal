import { test } from "node:test";
import assert from "node:assert/strict";
import { getPeriodRange, getPreviousPeriodRange, isPeriodKey, monthKey, periodLabel } from "../lib/dashboard-period";

const now = new Date(2026, 10, 4); // 4 Nov 2026

test("calendar month periods", () => {
  assert.equal(isPeriodKey("2026-10"), true);
  assert.equal(isPeriodKey("2026-13"), false);
  assert.equal(periodLabel("2026-10"), "Oct 2026");
  assert.equal(monthKey(-1, now), "2026-10");
  assert.equal(monthKey(-11, now), "2025-12");
  const oct = getPeriodRange("2026-10", now);
  assert.deepEqual([oct.start.getMonth(), oct.end?.getMonth(), oct.end?.getDate()], [9, 9, 31]);
  assert.equal(getPeriodRange("2026-11", now).end, undefined); // current month runs until now
  const prev = getPreviousPeriodRange("2026-01", now);
  assert.deepEqual([prev.start.getFullYear(), prev.start.getMonth(), prev.end.getDate()], [2025, 11, 31]);
});
