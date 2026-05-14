export type OutputStream = "stdout" | "stderr";

export interface StreamSample {
  text: string;
  truncated: boolean;
  bytes: number;
}

export interface FixtureRef {
  path: string;
  sha256: string;
  bytes: number;
}

export interface RunCassette {
  schemaVersion: "argvault.cassette/v1";
  tool: "argvault";
  recordedAt: string;
  cwd: string;
  argv: string[];
  command: string;
  env: Record<string, string>;
  stdin?: StreamSample;
  stdout: StreamSample;
  stderr: StreamSample;
  exitCode: number | null;
  signal: NodeJS.Signals | null;
  durationMs: number;
  fixtures: FixtureRef[];
  redactions: string[];
  notes: string[];
}

export interface RecordOptions {
  out: string;
  cwd: string;
  command: string[];
  envAllowlist: string[];
  fixturePaths: string[];
  stdinText?: string;
  stdinFile?: string;
  maxSampleBytes: number;
  notes: string[];
}

export interface ReportOptions {
  cassette: string;
  out?: string;
}
