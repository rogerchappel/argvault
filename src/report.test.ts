import test from "node:test";
import assert from "node:assert/strict";
import { toMarkdown } from "./report.js";
import type { RunCassette } from "./types.js";

test("renders report markdown", () => {
  const cassette: RunCassette = {
    schemaVersion: "argvault.cassette/v1",
    tool: "argvault",
    recordedAt: "1970-01-01T00:00:00.000Z",
    cwd: "~/repo",
    argv: ["node", "ok.js"],
    command: "node ok.js",
    env: { CI: "true" },
    stdout: { text: "ok", truncated: false, bytes: 2 },
    stderr: { text: "", truncated: false, bytes: 0 },
    exitCode: 0,
    signal: null,
    durationMs: 7,
    fixtures: [],
    redactions: [],
    notes: [],
  };
  const markdown = toMarkdown(cassette);
  assert.match(markdown, /ArgVault run report/);
  assert.match(markdown, /node ok\.js/);
});
