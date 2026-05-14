# Configuration

`argvault init` creates `.argvault.json`.

```json
{
  "envAllowlist": ["CI", "NODE_ENV"],
  "maxSampleBytes": 4096,
  "ignore": [".git", "node_modules", "dist", "build", ".cache", "coverage"]
}
```

## Fields

- `envAllowlist`: environment variable names captured on every record run, if present.
- `maxSampleBytes`: default byte cap for stdin, stdout, and stderr samples.
- `ignore`: documented default ignore list for fixture references. V1 ships fixed defaults; custom ignore enforcement is planned.

Per-run flags can add env names and override sample size:

```bash
argvault record --env GITHUB_ACTIONS --max-sample-bytes 8192 -- npm test
```
