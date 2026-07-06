import test from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createRequire } from "node:module";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const require = createRequire(import.meta.url);
const pkg = require("../package.json") as { version: string };

test("prints CLI help", async () => {
  const { stdout } = await execFileAsync("node", ["dist/index.js", "--help"]);
  assert.match(stdout, /ArgVault/);
  assert.match(stdout, /argvault --version/);
});

test("prints package version", async () => {
  const { stdout } = await execFileAsync("node", ["dist/index.js", "--version"]);
  assert.equal(stdout.trim(), pkg.version);
});
