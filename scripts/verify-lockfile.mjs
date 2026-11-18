import { readFile } from 'node:fs/promises';

const manifest = JSON.parse(await readFile('package.json', 'utf8'));
const lock = JSON.parse(await readFile('package-lock.json', 'utf8'));
const lockedManifest = lock.packages?.[''];

if (!lockedManifest) {
  throw new Error('package-lock.json is missing its root package entry.');
}

for (const field of [
  'name',
  'version',
  'license',
  'engines',
  'dependencies',
  'devDependencies',
  'optionalDependencies',
]) {
  const current = JSON.stringify(manifest[field] ?? null);
  const locked = JSON.stringify(lockedManifest[field] ?? null);
  if (current !== locked) {
    throw new Error(`package.json and package-lock.json differ in "${field}".`);
  }
}

console.info('package.json and package-lock.json root metadata match.');
