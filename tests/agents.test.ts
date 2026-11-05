import { test } from "node:test";
import assert from "node:assert/strict";
import { agentNetworks, distinctNetworks, networkSuggestions, parseAgent, typedNetwork } from "../lib/agents";

const base = { name: "Gulf", email: "a@gulf.com" };
const parsed = (extra: Record<string, unknown>) => {
  const result = parseAgent({ ...base, ...extra });
  if (!result.data) throw new Error(result.error);
  return result;
};

test("the first network is stored as the primary, the rest as extras; blanks and repeats dropped", () => {
  const { data } = parsed({ networks: [" WCA ", "", "JCtrans", "WCA"] });
  assert.equal(data.network, "WCA");
  assert.deepEqual(data.extra_networks, ["JCtrans"]);
});

test("a body with the old network field still saves it", () => {
  const { data } = parsed({ network: "WCA" });
  assert.equal(data.network, "WCA");
  assert.deepEqual(data.extra_networks, []);
});

test("no networks leaves the agent without any", () => {
  const { data } = parsed({ networks: [""] });
  assert.equal(data.network, null);
  assert.deepEqual(agentNetworks(data), []);
});

test("saving an agent never touches its saved code", () => {
  assert.equal("code" in parsed({ code: "G1" }).data, false);
});

test("agentNetworks returns the primary then the extras", () => {
  assert.deepEqual(agentNetworks({ network: "WCA", extra_networks: ["JCtrans"] }), ["WCA", "JCtrans"]);
});

test("the network list has no repeats, ignoring case", () => {
  assert.equal(distinctNetworks(["WCA", "JCtrans", "wca"]).length, 2);
  assert.deepEqual(distinctNetworks(["WCA", "JCtrans", "WCA"]), ["JCtrans", "WCA"]);
});

test("the picker offers known networks not yet selected, filtered by the text", () => {
  const known = ["AWCA", "JCtrans", "WCA"];
  assert.deepEqual(networkSuggestions(known, ["JCtrans"], ""), { matches: ["AWCA", "WCA"], newName: null });
  assert.deepEqual(networkSuggestions(known, ["jctrans"], "c").matches, ["AWCA", "WCA"]);
});

test("an exact match comes first and is not offered as new", () => {
  assert.deepEqual(networkSuggestions(["AWCA", "WCA"], [], "wca"), { matches: ["WCA", "AWCA"], newName: null });
});

test("unknown text is offered as a new network, trimmed; selected text is not", () => {
  assert.equal(networkSuggestions(["WCA"], [], " Global Link ").newName, "Global Link");
  assert.equal(networkSuggestions(["WCA"], ["Global Link"], "global link").newName, null);
});

test("text left in the box becomes the known spelling or the new name, never a duplicate", () => {
  assert.equal(typedNetwork(["WCA"], [], "wca"), "WCA");
  assert.equal(typedNetwork(["WCA"], [], "Global"), "Global");
  assert.equal(typedNetwork(["WCA"], ["WCA"], "wca"), null);
  assert.equal(typedNetwork(["WCA"], [], "  "), null);
  // A partial match with no exact name is a new network, not the partial match.
  assert.equal(typedNetwork(["WCA"], [], "WC"), "WC");
});

test("company ids are de-duplicated and invalid ones dropped", () => {
  assert.deepEqual(parsed({ org_ids: [1, "2", 1, 0, -3, "x"] }).orgIds, [1, 2]);
  assert.deepEqual(parsed({}).orgIds, []);
});
