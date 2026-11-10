import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';
const root = new URL('../dist/', import.meta.url).pathname;
const files = [];
async function walk(dir) {
  for (const entry of await readdir(dir)) {
    const file = join(dir, entry);
    if ((await stat(file)).isDirectory()) await walk(file);
    else if (file.endsWith('.html')) files.push(file);
  }
}
await walk(root);
const errors = [];
const schemaTypes = new Set();
for (const file of files) {
  const html = await readFile(file, 'utf8');
  const name = relative(root, file);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
  const duplicates = ids.filter((id,i)=>ids.indexOf(id)!==i);
  if (duplicates.length) errors.push(`${name}: duplicate IDs ${[...new Set(duplicates)].join(', ')}`);
  for (const match of html.matchAll(/<img\s([^>]+)>/g)) {
    if (!/\salt="[^"]+"/.test(match[1])) errors.push(`${name}: image missing alt`);
    if (!/\swidth="\d+"/.test(match[1]) || !/\sheight="\d+"/.test(match[1])) errors.push(`${name}: image missing dimensions`);
  }
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const parsed = JSON.parse(match[1]);
      const collect = item => {
        if (Array.isArray(item)) item.forEach(collect);
        else if (item && typeof item === 'object') {
          if (item['@type']) schemaTypes.add(item['@type']);
          Object.values(item).forEach(collect);
        }
      };
      collect(parsed);
    } catch (e) { errors.push(`${name}: invalid JSON-LD ${e.message}`); }
  }
  for (const match of html.matchAll(/href="(\/[^"]*)"/g)) {
    const href = match[1];
    if (href.startsWith('//')) continue;
    const clean = href.split('#')[0].split('?')[0];
    if (!clean) continue;
    const target = clean.endsWith('/') ? join(root,clean,'index.html') : join(root,clean);
    try { await stat(target); } catch { errors.push(`${name}: broken internal link ${href}`); }
  }
}
console.log(`Checked ${files.length} HTML files (including 404).`);
console.log(`Schema types found: ${[...schemaTypes].sort().join(', ')}`);
if (errors.length) {
  console.error(`\n${errors.length} issue(s):\n${[...new Set(errors)].join('\n')}`);
  process.exitCode = 1;
} else console.log('✓ Internal links, image alt/dimensions, unique IDs and JSON-LD syntax passed.');
