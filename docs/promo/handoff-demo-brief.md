# ArgVault handoff demo brief

## Demo angle

Show how ArgVault turns a local repro command into a reviewable handoff cassette without uploading logs, fixtures, or environment data.

## 60 second flow

1. Start in a clean checkout and run `bash demo/run-handoff-demo.sh`.
2. Point out the fixture-backed command: `node fixtures/echoer.mjs --mode demo`.
3. Open `tmp/handoff-demo/cassette.json` and show the schema version, redacted command metadata, fixture hash, and bounded output samples.
4. Open `tmp/handoff-demo/report.md` and show the human-readable handoff report.
5. Close on the safety model: env capture is allowlist-only and fixture contents are represented by hashes and sizes.

## Useful hooks

- "Stop pasting fragile repro notes. Record a redacted command cassette instead."
- "A failing CLI run should be portable, inspectable, and boring to review."
- "ArgVault gives agents and maintainers the same local evidence bundle."

## Verification for the demo

Run:

```bash
bash demo/run-handoff-demo.sh
```

The script builds the CLI, records the echo fixture run, renders Markdown, and checks that both generated files contain the expected report markers.
