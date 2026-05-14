export interface ParsedArgs {
  command: string;
  flags: Record<string, string[]>;
  rest: string[];
}

export function parseArgs(argv: string[]): ParsedArgs {
  const [command = "help", ...tail] = argv;
  const flags: Record<string, string[]> = {};
  const rest: string[] = [];
  let passthrough = false;
  for (let index = 0; index < tail.length; index += 1) {
    const token = tail[index]!;
    if (passthrough) {
      rest.push(token);
      continue;
    }
    if (token === "--") {
      passthrough = true;
      continue;
    }
    if (token.startsWith("--")) {
      const [rawKey, inline] = token.slice(2).split(/=(.*)/s, 2);
      const key = rawKey.trim();
      const value = inline ?? (tail[index + 1] && !tail[index + 1]!.startsWith("--") ? tail[++index]! : "true");
      flags[key] = [...(flags[key] ?? []), value];
      continue;
    }
    rest.push(token);
  }
  return { command, flags, rest };
}

export function flag(flags: Record<string, string[]>, name: string, fallback?: string): string | undefined {
  return flags[name]?.at(-1) ?? fallback;
}

export function flagMany(flags: Record<string, string[]>, name: string): string[] {
  return flags[name] ?? [];
}

export function numberFlag(flags: Record<string, string[]>, name: string, fallback: number): number {
  const raw = flag(flags, name);
  if (!raw) return fallback;
  const value = Number.parseInt(raw, 10);
  if (!Number.isFinite(value) || value < 1) throw new Error(`--${name} must be a positive integer`);
  return value;
}
