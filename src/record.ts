import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { RecordOptions, RunCassette } from "./types.js";
import { fixtureRef, writeJsonDeterministic } from "./fs.js";
import { redact } from "./redact.js";
import { mergeRedactions, sampleText } from "./sample.js";

export async function recordRun(options: RecordOptions): Promise<RunCassette> {
  if (options.command.length === 0) throw new Error("record requires a command after --");
  const started = Date.now();
  const stdin = await resolveStdin(options);
  const child = spawn(options.command[0]!, options.command.slice(1), {
    cwd: options.cwd,
    env: process.env,
    stdio: ["pipe", "pipe", "pipe"],
  });
  let stdout = "";
  let stderr = "";
  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");
  child.stdout.on("data", (chunk) => (stdout += String(chunk)));
  child.stderr.on("data", (chunk) => (stderr += String(chunk)));
  if (stdin !== undefined) child.stdin.end(stdin);
  else child.stdin.end();
  const exit = await waitForExit(child);
  const outSample = sampleText(stdout, options.maxSampleBytes);
  const errSample = sampleText(stderr, options.maxSampleBytes);
  const stdinSample = stdin === undefined ? undefined : sampleText(stdin, options.maxSampleBytes);
  const envResult = collectEnv(options.envAllowlist);
  const argResult = options.command.map((item) => redact(item));
  const fixtures = await Promise.all(options.fixturePaths.map((item) => fixtureRef(item, options.cwd)));
  const cassette: RunCassette = {
    schemaVersion: "argvault.cassette/v1",
    tool: "argvault",
    recordedAt: new Date(0).toISOString(),
    cwd: redact(path.resolve(options.cwd)).value,
    argv: argResult.map((item) => item.value),
    command: argResult.map((item) => item.value).join(" "),
    env: envResult.env,
    stdin: stdinSample?.sample,
    stdout: outSample.sample,
    stderr: errSample.sample,
    exitCode: exit.code,
    signal: exit.signal,
    durationMs: Date.now() - started,
    fixtures,
    redactions: mergeRedactions(
      outSample.redactions,
      errSample.redactions,
      stdinSample?.redactions ?? [],
      envResult.redactions,
      argResult.flatMap((item) => item.labels),
    ),
    notes: options.notes,
  };
  await writeJsonDeterministic(options.out, cassette);
  return cassette;
}

async function resolveStdin(options: RecordOptions): Promise<string | undefined> {
  if (options.stdinText !== undefined && options.stdinFile !== undefined) {
    throw new Error("Use --stdin-text or --stdin-file, not both");
  }
  if (options.stdinText !== undefined) return options.stdinText;
  if (options.stdinFile !== undefined) return fs.readFile(path.resolve(options.cwd, options.stdinFile), "utf8");
  return undefined;
}

function collectEnv(names: string[]): { env: Record<string, string>; redactions: string[] } {
  const env: Record<string, string> = {};
  const labels = new Set<string>();
  for (const name of [...new Set(names)].sort()) {
    const raw = process.env[name];
    if (raw === undefined) continue;
    const redacted = redact(raw);
    env[name] = redacted.value;
    redacted.labels.forEach((label) => labels.add(label));
  }
  return { env, redactions: [...labels].sort() };
}

function waitForExit(child: ReturnType<typeof spawn>): Promise<{ code: number | null; signal: NodeJS.Signals | null }> {
  return new Promise((resolve, reject) => {
    child.on("error", reject);
    child.on("close", (code, signal) => resolve({ code, signal }));
  });
}
