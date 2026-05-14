#!/usr/bin/env node
import path from "node:path";
import { parseArgs, flag, flagMany, numberFlag } from "./args.js";
import { doctor } from "./doctor.js";
import { help } from "./help.js";
import { initProject, loadConfig } from "./init.js";
import { recordRun } from "./record.js";
import { renderReport } from "./report.js";

export async function main(argv = process.argv.slice(2)): Promise<number> {
  const parsed = parseArgs(argv);
  if (["help", "--help", "-h"].includes(parsed.command)) {
    console.log(help());
    return 0;
  }
  if (parsed.command === "init") {
    console.log(await initProject(process.cwd()));
    return 0;
  }
  if (parsed.command === "doctor") {
    const result = await doctor(process.cwd());
    console.log(result.lines.join("\n"));
    return result.ok ? 0 : 1;
  }
  if (parsed.command === "record" || parsed.command === "scan") {
    const cwd = path.resolve(flag(parsed.flags, "cwd", process.cwd())!);
    const config = await loadConfig(cwd);
    const cassette = await recordRun({
      out: path.resolve(cwd, flag(parsed.flags, "out", ".argvault/runs/latest.json")!),
      cwd,
      command: parsed.rest,
      envAllowlist: [...config.envAllowlist, ...flagMany(parsed.flags, "env")],
      fixturePaths: flagMany(parsed.flags, "fixture"),
      stdinText: flag(parsed.flags, "stdin-text"),
      stdinFile: flag(parsed.flags, "stdin-file"),
      maxSampleBytes: numberFlag(parsed.flags, "max-sample-bytes", config.maxSampleBytes),
      notes: flagMany(parsed.flags, "note"),
    });
    console.log(`recorded ${cassette.command} -> ${flag(parsed.flags, "out", ".argvault/runs/latest.json")}`);
    return cassette.exitCode ?? 1;
  }
  if (parsed.command === "report") {
    const cassette = parsed.rest[0];
    if (!cassette) throw new Error("report requires a cassette path");
    const markdown = await renderReport({ cassette, out: flag(parsed.flags, "out") });
    if (!flag(parsed.flags, "out")) console.log(markdown);
    return 0;
  }
  throw new Error(`Unknown command: ${parsed.command}`);
}

main().then((code) => {
  process.exitCode = code;
}).catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
