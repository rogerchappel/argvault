import test from "node:test";
import assert from "node:assert/strict";
import { flag, flagMany, parseArgs } from "./args.js";

test("parses repeatable flags and passthrough command", () => {
  const parsed = parseArgs(["record", "--env", "CI", "--env=NODE_ENV", "--", "node", "x.js", "--real"]);
  assert.equal(parsed.command, "record");
  assert.deepEqual(flagMany(parsed.flags, "env"), ["CI", "NODE_ENV"]);
  assert.deepEqual(parsed.rest, ["node", "x.js", "--real"]);
});

test("returns the last flag value", () => {
  const parsed = parseArgs(["record", "--out", "a", "--out", "b"]);
  assert.equal(flag(parsed.flags, "out"), "b");
});
