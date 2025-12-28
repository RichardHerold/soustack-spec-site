import { existsSync, statSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const publicDir = join(rootDir, 'public');

/**
 * Recursively find at least one .json file in a directory
 * @param {string} dirPath - Directory path to search
 * @returns {boolean} - True if at least one .json file found
 */
function hasJsonFile(dirPath) {
  try {
    const entries = readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name);
      if (entry.isDirectory()) {
        if (hasJsonFile(fullPath)) {
          return true;
        }
      } else if (entry.isFile() && entry.name.endsWith('.json')) {
        return true;
      }
    }
    return false;
  } catch (err) {
    return false;
  }
}

let failed = false;

// Required files (must be files, not directories)
const requiredFiles = [
  { path: 'soustack.schema.json', desc: 'Root schema' },
  { path: 'stacks/registry.json', desc: 'Stack registry' },
  { path: 'URL-CONTRACT.md', desc: 'URL contract' },
  { path: 'spec-sync.json', desc: 'Spec sync metadata' },
];

// Required directories (must be directories, not files)
const requiredDirs = [
  { path: 'fixtures/valid', desc: 'Valid fixtures directory' },
  { path: 'fixtures/invalid', desc: 'Invalid fixtures directory' },
];

// Check required files
for (const { path, desc } of requiredFiles) {
  const fullPath = join(publicDir, path);
  if (!existsSync(fullPath)) {
    console.error(`❌ Missing: ${desc} (${path})`);
    failed = true;
  } else {
    const stat = statSync(fullPath);
    if (!stat.isFile()) {
      console.error(`❌ Not a file: ${desc} (${path})`);
      failed = true;
    }
  }
}

// Check required directories
for (const { path, desc } of requiredDirs) {
  const fullPath = join(publicDir, path);
  if (!existsSync(fullPath)) {
    console.error(`❌ Missing: ${desc} (${path})`);
    failed = true;
  } else {
    const stat = statSync(fullPath);
    if (!stat.isDirectory()) {
      console.error(`❌ Not a directory: ${desc} (${path})`);
      failed = true;
    } else {
      // Check that directory contains at least one .json file (recursively)
      if (!hasJsonFile(fullPath)) {
        console.error(`❌ Empty or no JSON files: ${desc} (${path})`);
        failed = true;
      }
    }
  }
}

if (failed) {
  console.error('\n❌ Artifact assertion failed. Run npm run sync:spec first.');
  process.exit(1);
}

console.log('✓ All required artifacts present.');

