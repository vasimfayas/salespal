import { test } from "node:test";
import assert from "node:assert/strict";
import { leaveDaysTaken, leaveState } from "../lib/leave";

const d = (s: string) => new Date(`${s}T00:00:00Z`);

test("leave days count inclusively and only up to today", () => {
  const leave = { start_date: d("2026-11-01"), end_date: d("2026-11-10"), returned_at: null };
  assert.equal(leaveDaysTaken(leave, d("2026-10-30")), 0);
  assert.equal(leaveDaysTaken(leave, d("2026-11-01")), 1);
  assert.equal(leaveDaysTaken(leave, d("2026-11-05")), 5);
  assert.equal(leaveDaysTaken(leave, d("2026-12-01")), 10);
});

test("coming back early stops the count the day before return", () => {
  const leave = { start_date: d("2026-11-01"), end_date: d("2026-11-10"), returned_at: new Date("2026-11-04T09:30:00Z") };
  assert.equal(leaveDaysTaken(leave, d("2026-12-01")), 3);
  assert.equal(leaveState(leave, d("2026-11-04")), "ended");
});

test("leave state", () => {
  const leave = { start_date: d("2026-11-05"), end_date: d("2026-11-06"), returned_at: null };
  assert.equal(leaveState(leave, d("2026-11-04")), "upcoming");
  assert.equal(leaveState(leave, d("2026-11-06")), "active");
  assert.equal(leaveState(leave, d("2026-11-07")), "ended");
});
