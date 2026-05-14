# ArgVault PRD

Status: in-progress

## Summary

Capture argv, cwd, env allowlists, stdin/stdout samples, exit codes, and fixture paths into portable JSON cassettes so humans and agents can reproduce terminal runs without leaking secrets.

## Why now

Developers increasingly hand terminal work to coding agents, CI bots, and maintainers, but the handoff artifacts are often messy logs, screenshots, or private chat excerpts. ArgVault keeps the workflow local-first, deterministic, inspectable, and safe to share.

## Users

- Maintainers triaging issues from contributors or agents.
- Agentic developers who need durable, reproducible context between runs.
- Small teams that want practical local gates without buying another hosted service.

## Core V1

- TypeScript Node CLI with no required network access.
- Commands: `init`, `scan` or `record`, `report`, and `doctor` as appropriate for the product.
- Reads plain files from the current workspace and writes deterministic JSON plus readable Markdown.
- Secret-aware defaults: redact common token patterns, ignore `.git`, `node_modules`, build caches, and user home paths unless explicitly allowed.
- Fixture-backed tests and at least one realistic CLI smoke.

## Non-goals

- Hosted telemetry, cloud sync, or background daemons.
- Replacing full CI systems or observability platforms.
- Uploading repo contents anywhere by default.

## UX notes

Tone: crisp, practical, memorable. README should feel like a tiny tool a senior maintainer would actually install. Add one tasteful emoji if it helps the identity.

## Acceptance criteria

- `npm test`, `npm run check`, `npm run build`, `npm run smoke`, and `bash scripts/validate.sh` pass where present.
- CLI works against checked-in fixtures with deterministic output.
- README includes install, quickstart, examples, safety model, JSON output notes, and limitations.
- Public GitHub repo under `rogerchappel/argvault` with useful description/topics.

## Inspiration and attribution

Reframed from recurring local developer workflow pain around reproducible bug reports, agent handoffs, fixture drift, privacy-preserving run logs, and diff-risk review. No code copied from external projects.
