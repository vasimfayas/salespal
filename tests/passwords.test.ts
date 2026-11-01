import { test } from "node:test";
import assert from "node:assert/strict";
import { newTempPassword } from "../lib/passwords";
import { MIN_PASSWORD_LENGTH } from "../lib/roles";

test("generated passwords are long enough, unambiguous and different each time", () => {
  const all = Array.from({ length: 200 }, () => newTempPassword());
  assert.equal(new Set(all).size, all.length);
  for (const p of all) {
    assert.ok(p.length >= MIN_PASSWORD_LENGTH);
    assert.match(p, /^[a-km-np-zA-HJ-NP-Z2-9]+$/);
  }
});
