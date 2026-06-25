# Release Readiness

Use this checklist before cutting a release or asking a reviewer to trust the package contents.

## Public Package Surface

- Package: `argvault`
- Repository: `https://github.com/rogerchappel/argvault`
- Published files are controlled by the `files` allowlist in `package.json`.

## CLI Surface

- `argvault` -> `./dist/index.js`

## Verification Commands

- `npm run check`: `tsc -p tsconfig.json --noEmit`
- `npm run test`: `node --test dist/**/*.test.js`
- `npm run build`: `tsc -p tsconfig.json`
- `npm run smoke`: `npm run build && bash scripts/smoke.sh`
- `npm run package:smoke`: `npm pack --dry-run`
- `npm run release:check`: `npm run check && npm test && npm run smoke && npm run package:smoke`

Run `npm run release:check` when available before opening a release PR. When a command is unavailable, use the closest listed command and record the reason in the PR.

## Reviewer Notes

- Confirm README examples still match the CLI or module exports.
- Confirm `npm pack --dry-run` does not include local fixtures, generated logs, or build caches beyond the intended allowlist.
- Confirm GitHub Actions runs the same install and package smoke path used locally.
