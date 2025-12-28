import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const registryPath = join(rootDir, 'public', 'stacks', 'registry.json');
const outputPath = join(rootDir, 'src', 'data', 'registry.generated.json');

if (!existsSync(registryPath)) {
  throw new Error(`Registry not found at ${registryPath}. Run npm run sync:spec first.`);
}

console.log('Reading registry...');
const registry = JSON.parse(readFileSync(registryPath, 'utf-8'));

// Normalize profiles
let profiles = [];
if (Array.isArray(registry.profiles)) {
  profiles = registry.profiles.map(p => ({
    id: p.id || p.name || '',
    title: p.title || p.name || p.id || '',
    requires: Array.isArray(p.requires) ? [...new Set(p.requires)].sort() : [],
    description: p.description || '',
  })).filter(p => p.id);
} else if (registry.profiles && typeof registry.profiles === 'object') {
  // Handle object format
  profiles = Object.entries(registry.profiles).map(([id, p]) => ({
    id,
    title: p.title || p.name || id,
    requires: Array.isArray(p.requires) ? [...new Set(p.requires)].sort() : [],
    description: p.description || '',
  }));
}

if (profiles.length === 0 && (registry.profiles !== undefined && registry.profiles !== null)) {
  throw new Error('Could not extract profiles from registry');
}

profiles.sort((a, b) => a.id.localeCompare(b.id));

// Normalize stacks
let stacks = [];
if (Array.isArray(registry.stacks)) {
  stacks = registry.stacks.map(s => {
    const id = s.id || s.name || '';
    const major = typeof s.major === 'number' ? s.major : (s.version ? parseInt(s.version.split('.')[0]) : 1);
    return {
      id,
      major,
      dependsOn: Array.isArray(s.dependsOn) ? [...new Set(s.dependsOn)].sort() : [],
      description: s.description || '',
      schemaPath: `/stacks/${id}.schema.json`,
      docPath: `/docs/stacks/${id}@${major}`,
    };
  }).filter(s => s.id);
} else if (registry.stacks && typeof registry.stacks === 'object') {
  // Handle object format
  stacks = Object.entries(registry.stacks).map(([id, s]) => {
    const major = typeof s.major === 'number' ? s.major : (s.version ? parseInt(s.version.split('.')[0]) : 1);
    return {
      id,
      major,
      dependsOn: Array.isArray(s.dependsOn) ? [...new Set(s.dependsOn)].sort() : [],
      description: s.description || '',
      schemaPath: `/stacks/${id}.schema.json`,
      docPath: `/docs/stacks/${id}@${major}`,
    };
  });
}

if (stacks.length === 0 && (registry.stacks !== undefined && registry.stacks !== null)) {
  throw new Error('Could not extract stacks from registry');
}

stacks.sort((a, b) => {
  const idCompare = a.id.localeCompare(b.id);
  if (idCompare !== 0) return idCompare;
  return a.major - b.major;
});

const output = {
  profiles,
  stacks,
  generatedAt: new Date().toISOString(),
  source: {
    path: '/stacks/registry.json',
  },
};

// Ensure output directory exists
import { mkdirSync } from 'fs';
mkdirSync(join(rootDir, 'src', 'data'), { recursive: true });

writeFileSync(outputPath, JSON.stringify(output, null, 2) + '\n');
console.log(`Generated ${outputPath}`);
console.log(`  Profiles: ${profiles.length}`);
console.log(`  Stacks: ${stacks.length}`);

