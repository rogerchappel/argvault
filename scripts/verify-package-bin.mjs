import { access } from 'node:fs/promises';
import { readFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const bins = Object.entries(pkg.bin ?? {});

if (bins.length === 0) {
  throw new Error('package.json does not declare any CLI bin entries');
}

const missing = [];
for (const [name, target] of bins) {
  try {
    const binUrl = new URL(`../${target}`, import.meta.url);
    await access(binUrl);
    const { stdout } = await execFileAsync('node', [fileURLToPath(binUrl), '--version']);
    if (stdout.trim() !== pkg.version) {
      throw new Error(`${name} --version returned ${JSON.stringify(stdout.trim())}, expected ${pkg.version}`);
    }
  } catch {
    missing.push(`${name} -> ${target}`);
  }
}

if (missing.length > 0) {
  throw new Error(`package bin target(s) missing after build: ${missing.join(', ')}`);
}

console.log(`Verified ${bins.length} package bin target(s) and version command(s).`);
