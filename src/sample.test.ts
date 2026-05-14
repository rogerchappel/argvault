import test from "node:test";
import assert from "node:assert/strict";
import { sampleText } from "./sample.js";

test("samples streams with truncation metadata", () => {
  const result = sampleText("abcdef", 3);
  assert.equal(result.sample.text, "abc");
  assert.equal(result.sample.truncated, true);
  assert.equal(result.sample.bytes, 6);
});

test("samples redacted text", () => {
  const result = sampleText("secret=abc123", 100);
  assert.equal(result.sample.text, "secret=[REDACTED]");
  assert.deepEqual(result.redactions, ["key-value-secret"]);
});
