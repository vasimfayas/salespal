import test from "node:test";
import assert from "node:assert/strict";
import { allowAttempt, clearAttempts, clientIp } from "../lib/rate-limit";

test("blocks after the limit and resets after the window", () => {
  const t = 1_000;
  for (let i = 0; i < 3; i++) assert.equal(allowAttempt("k", 3, 60_000, t), true);
  assert.equal(allowAttempt("k", 3, 60_000, t), false);
  assert.equal(allowAttempt("k", 3, 60_000, t + 60_001), true);
});

test("clearAttempts lets the key try again", () => {
  allowAttempt("c", 1, 60_000);
  assert.equal(allowAttempt("c", 1, 60_000), false);
  clearAttempts("c");
  assert.equal(allowAttempt("c", 1, 60_000), true);
});

test("clientIp takes the first forwarded address", () => {
  assert.equal(clientIp(new Headers({ "x-forwarded-for": "1.2.3.4, 10.0.0.1" })), "1.2.3.4");
  assert.equal(clientIp(new Headers()), "unknown");
});
