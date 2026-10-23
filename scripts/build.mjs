import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { renderFiles } from './render.mjs';

const root = new URL('../', import.meta.url);
const context = vm.createContext({ window: {} });
vm.runInContext(readFileSync(new URL('content.js', root), 'utf8'), context, { timeout: 1000 });
const files = renderFiles(context.window.PROFILE);
const args = process.argv.slice(2);
if (args.some(arg => arg !== '--check')) throw new Error('Usage: node scripts/build.mjs [--check]');
const check = args.includes('--check');
let stale = false;
for (const [name, content] of Object.entries(files)) {
  const destination = new URL(name, root);
  if (check) {
    let existing;
    try { existing = readFileSync(destination, 'utf8'); } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    if (existing !== content) {
      console.error(`${name} is missing or stale. Run: node scripts/build.mjs`);
      stale = true;
    }
  } else {
    writeFileSync(destination, content);
    console.log(`Generated ${fileURLToPath(destination)}`);
  }
}
if (stale) process.exitCode = 1;
else if (check) console.log('Generated HTML, sitemap, and robots.txt are up to date.');
