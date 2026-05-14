import { promises as fs } from "node:fs";
import type { ReportOptions, RunCassette } from "./types.js";
import { ensureDirFor } from "./fs.js";

export async function renderReport(options: ReportOptions): Promise<string> {
  const cassette = JSON.parse(await fs.readFile(options.cassette, "utf8")) as RunCassette;
  const markdown = toMarkdown(cassette);
  if (options.out) {
    await ensureDirFor(options.out);
    await fs.writeFile(options.out, markdown, "utf8");
  }
  return markdown;
}

export function toMarkdown(cassette: RunCassette): string {
  const fixtureRows = cassette.fixtures.length
    ? cassette.fixtures.map((item) => `- \`${item.path}\` (${item.bytes} bytes, sha256 \`${item.sha256.slice(0, 12)}…\`)`).join("\n")
    : "- none";
  const envRows = Object.keys(cassette.env).length
    ? Object.entries(cassette.env).map(([key, value]) => `- ${key}=\`${value}\``).join("\n")
    : "- none captured";
  return `# ArgVault run report\n\n` +
    `- Command: \`${cassette.command}\`\n` +
    `- CWD: \`${cassette.cwd}\`\n` +
    `- Exit: ${cassette.exitCode}${cassette.signal ? ` (${cassette.signal})` : ""}\n` +
    `- Duration: ${cassette.durationMs}ms\n` +
    `- Redactions: ${cassette.redactions.length ? cassette.redactions.join(", ") : "none"}\n\n` +
    `## Environment\n\n${envRows}\n\n` +
    `## Fixtures\n\n${fixtureRows}\n\n` +
    `## stdout\n\n\`\`\`text\n${cassette.stdout.text}\n\`\`\`\n\n` +
    `## stderr\n\n\`\`\`text\n${cassette.stderr.text}\n\`\`\`\n`;
}
