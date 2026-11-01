import { test } from "node:test";
import assert from "node:assert/strict";
import { lineCbm } from "../lib/freight";

test("mm dimensions convert like the other units", () => {
  assert.equal(lineCbm({ length: 1000, width: 1000, height: 1000, qty: 2 }, "mm"), lineCbm({ length: 1, width: 1, height: 1, qty: 2 }, "m"));
  assert.ok(Math.abs(lineCbm({ length: 1200, width: 800, height: 1500, qty: 1 }, "mm") - 1.44) < 1e-9);
});
