#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
out_dir="$repo_root/tmp/handoff-demo"

cd "$repo_root"
rm -rf "$out_dir"
mkdir -p "$out_dir"

npm run build

node dist/index.js record \
  --out "$out_dir/cassette.json" \
  --fixture fixtures/echo-input.txt \
  --stdin-file fixtures/echo-input.txt \
  --env NODE_ENV \
  --note "demo fixture handoff" \
  -- node fixtures/echoer.mjs --mode demo

node dist/index.js report "$out_dir/cassette.json" --out "$out_dir/report.md"

grep -q '"schemaVersion"' "$out_dir/cassette.json"
grep -q 'ArgVault run report' "$out_dir/report.md"

printf 'Demo cassette: %s\n' "$out_dir/cassette.json"
printf 'Demo report: %s\n' "$out_dir/report.md"
