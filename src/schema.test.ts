import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("cassette schema is valid json and names v1", async () => {
  const raw = await readFile(new URL("../docs/cassette.schema.json", import.meta.url), "utf8");
  const schema = JSON.parse(raw) as { title: string; properties: { schemaVersion: { const: string } } };
  assert.equal(schema.title, "ArgVault cassette v1");
  assert.equal(schema.properties.schemaVersion.const, "argvault.cassette/v1");
});
