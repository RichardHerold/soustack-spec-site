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

// Validate registry structure
if (!registry.profiles || typeof registry.profiles !== 'object') {
  throw new Error(`Invalid registry format at ${registryPath}: missing or invalid 'profiles' field`);
}
if (!registry.stacks || typeof registry.stacks !== 'object') {
  throw new Error(`Invalid registry format at ${registryPath}: missing or invalid 'stacks' field`);
}

// Normalize profiles
const profiles = Object.entries(registry.profiles)
  .map(([id, p]) => {
    if (!p || typeof p !== 'object') {
      throw new Error(`Invalid profile format at ${registryPath}: profile '${id}' is not an object`);
    }
    if (typeof p.title !== 'string') {
      throw new Error(`Invalid profile format at ${registryPath}: profile '${id}' missing 'title' field`);
    }
    if (typeof p.description !== 'string') {
      throw new Error(`Invalid profile format at ${registryPath}: profile '${id}' missing 'description' field`);
    }
    
    const requiresProfiles = Array.isArray(p.requiresProfiles) 
      ? [...new Set(p.requiresProfiles)].sort() 
      : [];
    const requiresStacks = Array.isArray(p.requiresStacks) 
      ? [...new Set(p.requiresStacks)].sort() 
      : [];
    
    return {
      id,
      title: p.title,
      requiresProfiles,
      requiresStacks,
      description: p.description,
    };
  })
  .sort((a, b) => a.id.localeCompare(b.id));

// Normalize stacks
const stacks = Object.entries(registry.stacks)
  .map(([id, s]) => {
    if (!s || typeof s !== 'object') {
      throw new Error(`Invalid stack format at ${registryPath}: stack '${id}' is not an object`);
    }
    if (typeof s.latestMajor !== 'number') {
      throw new Error(`Invalid stack format at ${registryPath}: stack '${id}' missing 'latestMajor' field`);
    }
    if (!s.schema || !s.schema.major || typeof s.schema.major !== 'object') {
      throw new Error(`Invalid stack format at ${registryPath}: stack '${id}' missing 'schema.major' field`);
    }
    
    const major = s.latestMajor;
    const dependsOn = Array.isArray(s.requires) 
      ? [...new Set(s.requires)].sort() 
      : [];
    
    // Get schema path from schema.major["1"] or similar
    const schemaPathFromRegistry = s.schema.major[String(major)];
    if (typeof schemaPathFromRegistry !== 'string') {
      throw new Error(`Invalid stack format at ${registryPath}: stack '${id}' missing 'schema.major["${major}"]' field`);
    }
    // Ensure leading slash
    const schemaPath = schemaPathFromRegistry.startsWith('/') 
      ? schemaPathFromRegistry 
      : `/${schemaPathFromRegistry}`;
    
    const docPath = `/docs/stacks/${id}@${major}`;
    
    return {
      id,
      major,
      dependsOn,
      description: s.description || s.title || '',
      schemaPath,
      docPath,
    };
  })
  .sort((a, b) => {
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

