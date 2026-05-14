import { homedir } from "node:os";

export interface RedactionResult {
  value: string;
  labels: string[];
}

const SECRET_PATTERNS: Array<[RegExp, string]> = [
  [/\b(?:api[_-]?key|token|secret|password|passwd|pwd)=([^\s&]+)\b/gi, "key-value-secret"],
  [/\b(ghp|github_pat|gho|ghu|ghs|ghr)_[A-Za-z0-9_]{20,}\b/g, "github-token"],
  [/\bsk-[A-Za-z0-9_-]{20,}\b/g, "openai-style-key"],
  [/\b[A-Za-z0-9._%+-]+:[A-Za-z0-9/+=._-]{16,}@/g, "basic-auth-url"],
  [/-----BEGIN [^-]+PRIVATE KEY-----[\s\S]*?-----END [^-]+PRIVATE KEY-----/g, "private-key"],
  [/\b[A-Za-z0-9+/]{40,}={0,2}\b/g, "long-base64-ish"],
];

export function redact(input: string): RedactionResult {
  let value = input;
  const labels = new Set<string>();
  const home = homedir();
  if (home && value.includes(home)) {
    value = value.split(home).join("~");
    labels.add("home-path");
  }
  for (const [pattern, label] of SECRET_PATTERNS) {
    value = value.replace(pattern, (match, firstCapture) => {
      labels.add(label);
      if (label === "key-value-secret") {
        return match.replace(String(firstCapture), "[REDACTED]");
      }
      return "[REDACTED:" + label + "]";
    });
  }
  return { value, labels: [...labels].sort() };
}

export function redactMany(values: string[]): RedactionResult {
  const labels = new Set<string>();
  const value = values
    .map((item) => {
      const result = redact(item);
      result.labels.forEach((label) => labels.add(label));
      return result.value;
    })
    .join("\n");
  return { value, labels: [...labels].sort() };
}
