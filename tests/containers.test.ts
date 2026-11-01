import { test } from "node:test";
import assert from "node:assert/strict";
import { containersLabel, equipmentLabel, firstReeferTemp, primaryContainer, readContainers } from "../types/enquiry";

test("container counts read in standard order and drop junk", () => {
  const list = readContainers([{ type: "40hc", qty: 1 }, { type: "20dc", qty: 2 }, { type: "nope", qty: 3 }, { type: "40dc", qty: 0 }]);
  assert.deepEqual(list, [{ type: "20dc", qty: 2 }, { type: "40hc", qty: 1 }]);
  assert.equal(containersLabel(list), "2 × 20'DC + 1 × 40'HC");
  assert.equal(equipmentLabel({ mode: "sea", service_type: "20dc", truck_type: null, containers: list }), "2 × 20'DC + 1 × 40'HC");
});

test("primary container prefers reefer, then open top", () => {
  assert.equal(primaryContainer([{ type: "20dc", qty: 1 }, { type: "40ot", qty: 1 }, { type: "20rf", qty: 1 }]), "20rf");
  assert.equal(primaryContainer([{ type: "20dc", qty: 1 }, { type: "40ot", qty: 1 }]), "40ot");
  assert.equal(primaryContainer([]), null);
});

test("reefers keep one temperature per container", () => {
  const list = readContainers([{ type: "40rf", qty: 2, temps: [-18, 4] }, { type: "20rf", qty: 1, temps: [-25, 1] }, { type: "20dc", qty: 1, temps: [5] }]);
  assert.deepEqual(list, [{ type: "20dc", qty: 1 }, { type: "20rf", qty: 1 }, { type: "40rf", qty: 2, temps: [-18, 4] }]);
  assert.equal(firstReeferTemp(list), -18);
  assert.equal(containersLabel(list), "1 × 20'DC + 1 × 20'RF + 2 × 40'RF (-18 °C, +4 °C)");
  assert.equal(containersLabel([{ type: "40rf", qty: 3, temps: [-18, -18, -18] }]), "3 × 40'RF (-18 °C)");
});
