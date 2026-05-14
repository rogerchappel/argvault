# ArgVault 🔐

Redacted CLI run cassettes for agent handoffs.

ArgVault records the boring-but-critical details of a terminal repro: argv, cwd, selected env vars, stdin/stdout/stderr samples, exit code, duration, notes, and fixture hashes. It writes portable JSON plus a readable Markdown report, without uploading anything.

## Install

```bash
npm install -g argvault
```

For local development:

```bash
npm install
npm run build
node dist/index.js doctor
```

## Quickstart

```bash
argvault init
argvault record \
  --out .argvault/runs/repro.json \
  --env NODE_ENV \
  --fixture fixtures/input.txt \
  --stdin-file fixtures/input.txt \
  --note "fails on the tiny fixture" \
  -- node scripts/repro.js --case tiny
argvault report .argvault/runs/repro.json --out .argvault/runs/repro.md
```

Open the JSON and Markdown before sharing them. ArgVault is a seatbelt, not a lawyer.

## Commands

- `argvault init` creates `.argvault.json` with safe defaults.
- `argvault record -- <command>` runs a command and writes a cassette.
- `argvault scan` is an alias for `record` for teams that prefer scan language.
- `argvault report <cassette.json>` renders Markdown from a cassette.
- `argvault doctor` checks the local workspace basics.

## Practical examples

Record a failing test while keeping env capture tight:

```bash
argvault record --env CI --env NODE_ENV -- npm test -- --runInBand
```

Capture stdin from a fixture and attach fixture metadata:

```bash
argvault record \
  --fixture fixtures/login.json \
  --stdin-file fixtures/login.json \
  -- node ./bin/replay.js
```

Generate a handoff note:

```bash
argvault report .argvault/runs/latest.json > HANDOFF.md
```

## JSON output notes

Cassettes use `schemaVersion: "argvault.cassette/v1"` and deterministic key ordering. `recordedAt` is fixed at the Unix epoch in v1 so fixture-backed examples are stable; use file metadata or surrounding reports if wall-clock time matters.

A cassette includes:

- redacted command argv and cwd
- allowlisted env values only
- bounded stdin/stdout/stderr samples with byte counts and truncation flags
- exit code, signal, and duration
- fixture path, size, and SHA-256 metadata
- redaction labels so reviewers know what was touched

## Safety model

ArgVault is local-first:

- no required network access
- no telemetry or background daemon
- env capture is allowlist-only
- common tokens, private keys, key-value secrets, long base64-ish blobs, and home paths are redacted
- `.git`, `node_modules`, `dist`, `build`, `.cache`, and `coverage` are ignored for fixture references
- fixture contents are not embedded; hashes and sizes are recorded instead

Still review before posting. Custom secrets can have weird shapes.

## Limitations

- v1 redaction patterns are intentionally conservative and not a formal DLP engine.
- Interactive TTY programs are not the target; record deterministic commands.
- Fixture hashes prove identity, not availability. Share fixtures separately when needed.
- Duration naturally varies between machines.

## Development

```bash
npm install
npm test
npm run check
npm run build
npm run smoke
bash scripts/validate.sh
```

## License

MIT
