import { access, constants } from "node:fs/promises";
import path from "node:path";

export async function doctor(cwd: string): Promise<{ ok: boolean; lines: string[] }> {
  const lines: string[] = [];
  lines.push(`node ${process.version}`);
  try {
    await access(cwd, constants.R_OK | constants.W_OK);
    lines.push(`workspace writable: ${path.resolve(cwd)}`);
  } catch {
    lines.push(`workspace not writable: ${path.resolve(cwd)}`);
  }
  const ok = !lines.some((line) => line.includes("not writable"));
  lines.push(ok ? "argvault is ready" : "argvault found problems");
  return { ok, lines };
}
