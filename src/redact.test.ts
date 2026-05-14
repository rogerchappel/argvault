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

test("redacts standalone github tokens", () => {
  const result = redact("ghp_1234567890abcdefghijklmnopqrstuvwxyz");
  assert.equal(result.value, "[REDACTED:github-token]");
  assert.deepEqual(result.labels, ["github-token"]);
});

test("redacts home paths", () => {
  const result = redact(`${process.env.HOME}/project/file.txt`);
  assert.equal(result.value, "~/project/file.txt");
  assert.equal(result.labels.includes("home-path"), true);
});
