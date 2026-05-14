import test from "node:test";
import assert from "node:assert/strict";
import { redact } from "./redact.js";

test("redacts common key value secrets", () => {
  const result = redact("api_key=supersecret password=hunter2 token=ghp_1234567890abcdefghijklmnopqrstuv");
  assert.match(result.value, /api_key=\[REDACTED\]/);
  assert.match(result.value, /password=\[REDACTED\]/);
  assert.doesNotMatch(result.value, /ghp_1234567890/);
  assert.deepEqual(result.labels, ["key-value-secret"]);
});

test("redacts home paths", () => {
  const result = redact(`${process.env.HOME}/project/file.txt`);
  assert.equal(result.value, "~/project/file.txt");
  assert.equal(result.labels.includes("home-path"), true);
});
