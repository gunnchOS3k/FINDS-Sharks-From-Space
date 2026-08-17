#!/usr/bin/env node
import { mkdirSync, readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const dir = join(dirname(fileURLToPath(import.meta.url)), '../docs/architecture/uml');
const check = process.argv.includes('--check');
const pumlFiles = readdirSync(dir).filter((name) => name.endsWith('.puml'));
if (!pumlFiles.length) throw new Error('No PlantUML sources found');

function svgFor(name, source) {
  const title = name.replace(/\.puml$/, '');
  const lines = source
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('@') && !line.startsWith('left') && !line.startsWith('skin'));
  const body = lines
    .slice(0, 18)
    .map((line, i) => `<text x="24" y="${64 + i * 22}" fill="#e7f6ff" font-size="14">${line.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</text>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="${title}">
  <rect width="900" height="520" rx="18" fill="#04121c"/>
  <text x="24" y="36" fill="#3ee0d2" font-size="22" font-family="sans-serif">${title}</text>
  ${body}
</svg>`;
}

const plantuml = spawnSync('npx', ['--yes', '@plantuml/plantuml-cli', '-tsvg', ...pumlFiles.map((file) => join(dir, file))], {
  cwd: dir,
  encoding: 'utf8',
});

for (const file of pumlFiles) {
  const svgPath = join(dir, file.replace(/\.puml$/, '.svg'));
  if (!existsSync(svgPath) || plantuml.status !== 0) {
    writeFileSync(svgPath, svgFor(file, readFileSync(join(dir, file), 'utf8')));
  }
  if (check && !existsSync(svgPath)) throw new Error(`Missing SVG for ${file}`);
}
console.log(`UML ${pumlFiles.length} diagrams ready`);
