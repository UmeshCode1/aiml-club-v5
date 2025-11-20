/**
 * Appwrite provisioning script.
 *
 * PURPOSE: One-time automation to create collections, attributes and buckets.
 * REQUIREMENTS:
 *  - Set APPWRITE_API_KEY in .env.local (Project Settings → API Keys → create a key with All scopes or at minimum databases.write, storage.write, users.read)
 *  - Ensure NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT_ID, NEXT_PUBLIC_APPWRITE_DATABASE_ID are set.
 *
 * USAGE:
 *  npx ts-node scripts/setupAppwrite.ts   (or npm run setup:appwrite)
 *
 * SAFE TO RE-RUN: It skips existing collections / buckets.
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
// Using direct REST calls because the browser SDK (appwrite) does not expose admin collection APIs.
// Node 18+ provides global fetch.

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const apiKey = process.env.APPWRITE_API_KEY!;

if (!endpoint || !project || !databaseId || !apiKey) {
  console.error('Missing required env vars. Ensure endpoint, project, databaseId, APPWRITE_API_KEY are set.');
  process.exit(1);
}

async function request(method: string, path: string, body?: any) {
  const res = await fetch(`${endpoint}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': project,
      'X-Appwrite-Key': apiKey
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${method} ${path} failed (${res.status}): ${text}`);
  }
  return res.json();
}

// Desired collections configuration
// Each collection entry defines name, id (use generated if blank), and attributes.
// For simplicity we let Appwrite auto-generate IDs by leaving collectionId undefined.
// After creation you must copy the real IDs into .env.local replacing TBD values.
interface AttributeDef {
  type: 'string' | 'integer' | 'boolean' | 'datetime' | 'enum';
  key: string;
  size?: number; // for strings
  required?: boolean;
  elements?: string[]; // enum values
}
interface CollectionDef {
  name: string;
  envVar: string; // env var to later populate manually
  attributes: AttributeDef[];
  indexes?: Array<{ key: string; type: 'key'; unique?: boolean }>;
}

const collections: CollectionDef[] = [
  {
    name: 'Events', envVar: 'NEXT_PUBLIC_COLLECTION_EVENTS', attributes: [
      { type: 'string', key: 'title', size: 150, required: true },
      { type: 'string', key: 'slug', size: 160, required: true },
      { type: 'string', key: 'description', size: 2000, required: true },
      { type: 'datetime', key: 'startDate', required: true },
      { type: 'datetime', key: 'endDate' },
      { type: 'string', key: 'location', size: 120, required: true },
      { type: 'enum', key: 'type', elements: ['workshop','talk','session','test','hackathon','guest_lecture','orientation','other'], required: true },
      { type: 'enum', key: 'status', elements: ['scheduled','ongoing','completed','canceled'], required: true },
      { type: 'string', key: 'posterId', size: 50 }
    ], indexes: [{ key: 'slug', type: 'key', unique: true }]
  },
  {
    name: 'Highlights', envVar: 'NEXT_PUBLIC_COLLECTION_HIGHLIGHTS', attributes: [
      { type: 'string', key: 'title', size: 150, required: true },
      { type: 'string', key: 'slug', size: 160, required: true },
      { type: 'string', key: 'excerpt', size: 500, required: true },
      { type: 'string', key: 'content', size: 5000, required: true },
      { type: 'string', key: 'author', size: 80, required: true },
      { type: 'datetime', key: 'date', required: true },
      { type: 'string', key: 'coverImageId', size: 50 }
    ], indexes: [{ key: 'slug', type: 'key', unique: true }]
  },
  {
    name: 'Team', envVar: 'NEXT_PUBLIC_COLLECTION_TEAM', attributes: [
      { type: 'string', key: 'name', size: 100, required: true },
      { type: 'string', key: 'role', size: 100, required: true },
      { type: 'enum', key: 'category', elements: ['faculty','leadership','event_heads','media','tech','discipline','editors','stage'], required: true },
      { type: 'string', key: 'bio', size: 2000 },
      { type: 'string', key: 'photoId', size: 50 },
      { type: 'string', key: 'instagram', size: 120 },
      { type: 'string', key: 'linkedin', size: 120 },
      { type: 'string', key: 'github', size: 120 },
      { type: 'string', key: 'email', size: 120 },
      { type: 'integer', key: 'order', required: true }
    ]
  },
  {
    name: 'Members', envVar: 'NEXT_PUBLIC_COLLECTION_MEMBERS', attributes: [
      { type: 'string', key: 'name', size: 100, required: true },
      { type: 'string', key: 'email', size: 120, required: true },
      { type: 'string', key: 'phone', size: 20, required: true },
      { type: 'integer', key: 'semester', required: true },
      { type: 'string', key: 'course', size: 100, required: true },
      { type: 'string', key: 'reason', size: 3000, required: true },
      { type: 'enum', key: 'status', elements: ['pending','approved','rejected'], required: true },
      { type: 'boolean', key: 'subscribed', required: true }
    ]
  },
  {
    name: 'Suggestions', envVar: 'NEXT_PUBLIC_COLLECTION_SUGGESTIONS', attributes: [
      { type: 'string', key: 'content', size: 3000, required: true },
      { type: 'boolean', key: 'anonymous', required: true },
      { type: 'string', key: 'name', size: 100 },
      { type: 'string', key: 'email', size: 120 },
      { type: 'enum', key: 'status', elements: ['pending','responded'], required: true },
      { type: 'string', key: 'response', size: 3000 }
    ]
  },
  {
    name: 'Notifications', envVar: 'NEXT_PUBLIC_COLLECTION_NOTIFICATIONS', attributes: [
      { type: 'string', key: 'title', size: 120, required: true },
      { type: 'string', key: 'message', size: 2000, required: true },
      { type: 'enum', key: 'type', elements: ['info','success','warning','error'], required: true },
      { type: 'string', key: 'link', size: 200 }
    ]
  },
  {
    name: 'Subscribers', envVar: 'NEXT_PUBLIC_COLLECTION_SUBSCRIBERS', attributes: [
      { type: 'string', key: 'email', size: 120, required: true },
      { type: 'boolean', key: 'active', required: true }
    ], indexes: [{ key: 'email', type: 'key', unique: true }]
  },
  {
    name: 'Gallery', envVar: 'NEXT_PUBLIC_COLLECTION_GALLERY', attributes: [
      { type: 'string', key: 'fileId', size: 50, required: true },
      { type: 'string', key: 'title', size: 120 }
    ]
  }
];

async function ensureCollection(def: CollectionDef) {
  try {
    const existing = await request('GET', `/databases/${databaseId}/collections`);
    const found = existing.collections.find((c: any) => c.name === def.name);
    if (found) {
      console.log(`✔ Collection '${def.name}' already exists (ID: ${found.$id}). Skipping.`);
      return;
    }
    const collectionId = `auto_${Date.now()}_${Math.random().toString(36).slice(2,8)}`; // temporary unique ID
    const created = await request('POST', `/databases/${databaseId}/collections`, {
      collectionId,
      name: def.name,
      permissions: ['read("any")','write("users")'],
      documentSecurity: true
    });
    console.log(`Created collection '${def.name}' → ID: ${created.$id}. Put this into ${def.envVar} in .env.local`);
    // Attributes
    for (const attr of def.attributes) {
      let path = `/databases/${databaseId}/collections/${created.$id}/attributes`;
      switch (attr.type) {
        case 'string':
          path += '/string';
          await request('POST', path, { key: attr.key, size: attr.size || 200, required: !!attr.required });
          break;
        case 'integer':
          path += '/integer';
          await request('POST', path, { key: attr.key, required: !!attr.required });
          break;
        case 'boolean':
          path += '/boolean';
          await request('POST', path, { key: attr.key, required: !!attr.required });
          break;
        case 'datetime':
          path += '/datetime';
          await request('POST', path, { key: attr.key, required: !!attr.required });
          break;
        case 'enum':
          path += '/enum';
          await request('POST', path, { key: attr.key, elements: attr.elements || [], required: !!attr.required });
          break;
      }
      console.log(`  • Attribute '${attr.key}' added.`);
    }
    if (def.indexes) {
      for (const idx of def.indexes) {
        await request('POST', `/databases/${databaseId}/collections/${created.$id}/indexes`, {
          key: idx.key,
          type: idx.type,
          attributes: [idx.key],
          orders: ['ASC'],
          unique: !!idx.unique
        });
        console.log(`  • Index on '${idx.key}' created.`);
      }
    }
  } catch (e: any) {
    console.error(`✖ Failed provisioning collection '${def.name}':`, e.message);
  }
}

async function ensureBucket(id: string) {
  try {
    const list = await request('GET', '/storage/buckets');
    if (list.buckets.find((b: any) => b.$id === id)) {
      console.log(`✔ Bucket '${id}' already exists.`);
      return;
    }
    const created = await request('POST', '/storage/buckets', {
      bucketId: id,
      name: id,
      permissions: ['read("any")','write("users")','update("users")','delete("users")'],
      fileSecurity: false
    });
    console.log(`Created bucket '${id}' (ID: ${created.$id}).`);
  } catch (e: any) {
    console.error(`Bucket '${id}' error:`, e.message);
  }
}

(async () => {
  console.log('Starting Appwrite provisioning...');
  console.log('Endpoint:', endpoint);
  console.log('Project:', project);
  console.log('Database:', databaseId);

  for (const c of collections) {
    await ensureCollection(c);
  }

  await ensureBucket('gallery');
  await ensureBucket('events');
  await ensureBucket('team');

  console.log('\nProvisioning complete. NEXT STEP: copy each created collection ID into .env.local replacing TBD values, then restart dev server.');
})();
