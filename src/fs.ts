import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { FixtureRef } from "./types.js";
import { redact } from "./redact.js";

const IGNORED_PARTS = new Set([".git", "node_modules", "dist", "build", ".cache", "coverage"]);

export async function ensureDirFor(filePath: string): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

export async function readIfExists(filePath: string): Promise<string | undefined> {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return undefined;
    throw error;
  }
}

export function isIgnoredPath(filePath: string): boolean {
  return filePath.split(path.sep).some((part) => IGNORED_PARTS.has(part));
}

export async function fixtureRef(filePath: string, cwd: string): Promise<FixtureRef> {
  if (isIgnoredPath(filePath)) {
    throw new Error(`Refusing ignored fixture path: ${filePath}`);
  }
  const absolute = path.resolve(cwd, filePath);
  const data = await fs.readFile(absolute);
  const relative = path.relative(cwd, absolute) || path.basename(absolute);
  return {
    path: redact(relative).value,
    sha256: createHash("sha256").update(data).digest("hex"),
    bytes: data.byteLength,
  };
}

export async function writeJsonDeterministic(filePath: string, value: unknown): Promise<void> {
  await ensureDirFor(filePath);
  await fs.writeFile(filePath, `${JSON.stringify(sortForJson(value), null, 2)}\n`, "utf8");
}

function sortForJson(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortForJson);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, item]) => [key, sortForJson(item)]),
    );
  }
  return value;
}
