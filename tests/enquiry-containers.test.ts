import { test } from "node:test";
import assert from "node:assert/strict";
import { parseEnquiryDetails } from "../lib/enquiry-fields";

const base = { enquiry_date: "2026-11-01", mode: "sea", from: "Jebel Ali", to: "Sohar", job_ref: "SEFL", incoterm: "FOB", payment_mode: "cash" };

test("two reefers at different temperatures are saved per container", () => {
  const r = parseEnquiryDetails({ ...base, containers: [{ type: "40rf", qty: 2 }, { type: "20dc", qty: 1 }], container_temps: { "40rf": ["-18", "4"] } });
  assert.ok(!("error" in r));
  assert.equal(r.data.service_type, "40rf");
  assert.equal(r.data.reefer_temp, -18);
  assert.deepEqual(r.data.containers, [{ type: "20dc", qty: 1 }, { type: "40rf", qty: 2, temps: [-18, 4] }]);
});

test("a reefer container without its temperature is refused", () => {
  const r = parseEnquiryDetails({ ...base, containers: [{ type: "40rf", qty: 2 }], container_temps: { "40rf": ["-18"] } });
  assert.ok("error" in r);
  assert.ok("error" in parseEnquiryDetails({ ...base, containers: [{ type: "20rf", qty: 1 }], container_temps: { "20rf": ["-99"] } }));
});

test("an open top next to a reefer still keeps its gauge", () => {
  const r = parseEnquiryDetails({ ...base, containers: [{ type: "40rf", qty: 1 }, { type: "40ot", qty: 1 }], container_temps: { "40rf": ["-18"] }, gauge: "og" });
  assert.ok(!("error" in r));
  assert.equal(r.data.service_type, "40rf");
  assert.equal(r.data.gauge, "og");
  assert.ok("error" in parseEnquiryDetails({ ...base, containers: [{ type: "40rf", qty: 1 }, { type: "20ot", qty: 1 }], container_temps: { "40rf": ["-18"] } }));
});
