import { existsSync, statSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const publicDir = join(rootDir, 'public');

const required = [
  { path: 'soustack.schema.json', desc: 'Root schema' },
  { path: 'stacks/registry.json', desc: 'Stack registry' },
  { path: 'fixtures/valid', desc: 'Valid fixtures directory' },
  { path: 'fixtures/invalid', desc: 'Invalid fixtures directory' },
];

let failed = false;

for (const { path, desc } of required) {
  const fullPath = join(publicDir, path);
  if (!existsSync(fullPath)) {
    console.error(`❌ Missing: ${desc} (${path})`);
    failed = true;
  } else {
    const stat = statSync(fullPath);
    if (stat.isDirectory() && path.includes('fixtures')) {
      // Check directory is not empty
      try {
        const entries = readdirSync(fullPath);
        if (entries.length === 0) {
          console.warn(`⚠️  Warning: ${desc} directory is empty`);
        } else {
          console.log(`✓ Found: ${desc}`);
        }
      } catch (err) {
        console.error(`❌ Error reading ${desc}: ${err.message}`);
        failed = true;
      }
    } else {
      console.log(`✓ Found: ${desc}`);
    }
  }
}

if (failed) {
  console.error('\n❌ Artifact assertion failed. Run npm run sync:spec first.');
  process.exit(1);
}

console.log('\n✓ All required artifacts present.');

