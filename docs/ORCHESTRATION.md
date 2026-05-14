# ArgVault Orchestration

ArgVault is built for local-first agent handoffs. The safe loop is:

1. Human or agent runs `argvault init` once in a workspace.
2. Repro commands run through `argvault record -- <command>`.
3. The resulting JSON cassette stays local until a human chooses to share it.
4. `argvault report` produces Markdown suitable for issues, PRs, and handoff notes.
5. Maintainers reproduce from the command, cwd, env allowlist, fixture hashes, and samples.

## Guardrails

- No network calls are required by the CLI.
- Environment capture is allowlist-only.
- `.git`, `node_modules`, build caches, and home paths are treated as sensitive by default.
- Cassettes store fixture metadata, not fixture file contents.
- Reports are derived from cassettes and should be reviewed before posting publicly.

## Recommended agent use

Use ArgVault at the boundary between agents: record the failing command, include only relevant fixtures, and attach the cassette plus Markdown report to the handoff.
