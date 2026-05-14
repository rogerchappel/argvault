import type { StreamSample } from "./types.js";
import { redact } from "./redact.js";

export interface SampleResult {
  sample: StreamSample;
  redactions: string[];
}

export function sampleText(input: string, maxBytes: number): SampleResult {
  const buffer = Buffer.from(input, "utf8");
  const truncated = buffer.byteLength > maxBytes;
  const sliced = truncated ? buffer.subarray(0, maxBytes).toString("utf8") : input;
  const redacted = redact(sliced);
  return {
    sample: {
      text: redacted.value,
      truncated,
      bytes: buffer.byteLength,
    },
    redactions: redacted.labels,
  };
}

export function mergeRedactions(...groups: string[][]): string[] {
  return [...new Set(groups.flat())].sort();
}
