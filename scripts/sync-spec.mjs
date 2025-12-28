import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import { existsSync, mkdirSync, cpSync, writeFileSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const cacheDir = join(rootDir, '.cache', 'soustack-spec');
const publicDir = join(rootDir, 'public');
const contentDir = join(rootDir, 'src', 'content', 'spec');

// Read package.json config
const packageJson = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf-8'));
const { repo, ref } = packageJson.soustackSpec || {};

if (!repo || !ref) {
  throw new Error('package.json must contain soustackSpec.repo and soustackSpec.ref');
}

console.log(`Syncing spec from ${repo}@${ref}...`);

// Ensure cache directory exists
mkdirSync(join(rootDir, '.cache'), { recursive: true });

// Clone or update repo
if (existsSync(cacheDir)) {
  console.log('Cache exists, fetching latest...');
  try {
    execSync('git fetch origin', { cwd: cacheDir, stdio: 'inherit' });
    execSync(`git reset --hard ${ref}`, { cwd: cacheDir, stdio: 'inherit' });
  } catch (err) {
    console.error('Failed to update cache, removing and re-cloning...');
    execSync(`rm -rf "${cacheDir}"`, { cwd: rootDir });
    execSync(`git clone --depth 1 --branch ${ref} ${repo} "${cacheDir}"`, { cwd: rootDir, stdio: 'inherit' });
  }
} else {
  console.log('Cloning repo...');
  execSync(`git clone --depth 1 --branch ${ref} ${repo} "${cacheDir}"`, { cwd: rootDir, stdio: 'inherit' });
}

// Get commit SHA
const commitSha = execSync('git rev-parse HEAD', { cwd: cacheDir, encoding: 'utf-8' }).trim();

// Ensure public directory exists
mkdirSync(publicDir, { recursive: true });

// Copy artifacts
const artifacts = [
  { src: 'soustack.schema.json', dest: 'soustack.schema.json' },
  { src: 'defs', dest: 'defs' },
  { src: 'stacks', dest: 'stacks' },
  { src: 'fixtures', dest: 'fixtures' },
];

for (const { src, dest } of artifacts) {
  const srcPath = join(cacheDir, src);
  const destPath = join(publicDir, dest);
  
  if (!existsSync(srcPath)) {
    throw new Error(`Required artifact not found in source repo: ${src}`);
  }
  
  console.log(`Copying ${src} -> ${dest}...`);
  cpSync(srcPath, destPath, { recursive: true, force: true });
}

// Copy SPEC.md to content
const specMdPath = join(cacheDir, 'SPEC.md');
if (!existsSync(specMdPath)) {
  throw new Error('Required file not found in source repo: SPEC.md');
}

mkdirSync(contentDir, { recursive: true });
console.log('Copying SPEC.md to content...');
cpSync(specMdPath, join(contentDir, 'SPEC.md'), { force: true });

// Copy URL-CONTRACT.md to public
const contractPath = join(rootDir, 'URL-CONTRACT.md');
if (existsSync(contractPath)) {
  console.log('Copying URL-CONTRACT.md to public...');
  cpSync(contractPath, join(publicDir, 'URL-CONTRACT.md'), { force: true });
}

// Write metadata
const metadata = {
  repo,
  ref,
  commitSha,
  syncedAt: new Date().toISOString(),
};

writeFileSync(
  join(publicDir, 'spec-sync.json'),
  JSON.stringify(metadata, null, 2) + '\n'
);

console.log('Sync complete!');
console.log(`Commit: ${commitSha.substring(0, 7)}`);

