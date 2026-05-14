#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
tmp_dir="${TMPDIR:-/tmp}/argvault-smoke-$$"
mkdir -p "$tmp_dir"
trap 'rm -rf "$tmp_dir"' EXIT

cd "$repo_root"
node dist/index.js doctor
node dist/index.js record \
  --out "$tmp_dir/cassette.json" \
  --fixture fixtures/echo-input.txt \
  --stdin-file fixtures/echo-input.txt \
  --env NODE_ENV \
  --note "smoke fixture run" \
  -- node fixtures/echoer.mjs --mode smoke
node dist/index.js report "$tmp_dir/cassette.json" --out "$tmp_dir/report.md"

grep -q 'schemaVersion' "$tmp_dir/cassette.json"
grep -q '\[REDACTED' "$tmp_dir/cassette.json"
grep -q 'ArgVault run report' "$tmp_dir/report.md"
