import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
for (const file of ['index.html', 'architecture.html', 'askcv.html', 'evidence.html']) {
  const html = readFileSync(file, 'utf8');
  for (const [, target] of html.matchAll(/href="(evidence\.html(?:#[^"]*)?)"/g)) {
    const [path, anchor] = target.split('#');
    assert.ok(existsSync(path), `${file}: missing ${path}`);
    if (anchor) assert.ok(readFileSync(path, 'utf8').includes(`id="${anchor}"`), `${file}: missing ${target}`);
  }
}
console.log('Evidence references pass');
