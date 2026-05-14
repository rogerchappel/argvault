import { promises as fs } from "node:fs";
import path from "node:path";
import { readIfExists } from "./fs.js";

const DEFAULT_CONFIG = `{
  "$schema": "https://example.invalid/argvault.schema.json",
  "envAllowlist": ["CI", "NODE_ENV"],
  "maxSampleBytes": 4096,
  "ignore": [".git", "node_modules", "dist", "build", ".cache", "coverage"]
}
`;

export async function initProject(cwd: string): Promise<string> {
  const configPath = path.join(cwd, ".argvault.json");
  const existing = await readIfExists(configPath);
  if (existing !== undefined) return `kept existing ${path.relative(cwd, configPath)}`;
  await fs.writeFile(configPath, DEFAULT_CONFIG, "utf8");
  return `created ${path.relative(cwd, configPath)}`;
}

export interface ArgVaultConfig {
  envAllowlist: string[];
  maxSampleBytes: number;
}

export async function loadConfig(cwd: string): Promise<ArgVaultConfig> {
  const raw = await readIfExists(path.join(cwd, ".argvault.json"));
  if (!raw) return { envAllowlist: ["CI", "NODE_ENV"], maxSampleBytes: 4096 };
  const parsed = JSON.parse(raw) as Partial<ArgVaultConfig>;
  return {
    envAllowlist: Array.isArray(parsed.envAllowlist) ? parsed.envAllowlist : ["CI", "NODE_ENV"],
    maxSampleBytes: typeof parsed.maxSampleBytes === "number" ? parsed.maxSampleBytes : 4096,
  };
}
