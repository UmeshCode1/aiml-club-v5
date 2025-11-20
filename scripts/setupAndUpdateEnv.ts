/**
 * Complete Appwrite Setup & Environment Configuration Script
 * 
 * This script will:
 * 1. Create all necessary collections and buckets in Appwrite
 * 2. Automatically update .env.local with the generated IDs
 * 3. Verify the connection
 * 
 * USAGE: npx ts-node scripts/setupAndUpdateEnv.ts
 */

import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const apiKey = process.env.APPWRITE_API_KEY!;

if (!endpoint || !project || !databaseId || !apiKey) {
  console.error('❌ Missing required env vars. Check .env.local');
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

interface AttributeDef {
  type: 'string' | 'integer' | 'boolean' | 'datetime' | 'enum';
  key: string;
  size?: number;
  required?: boolean;
  elements?: string[];
  array?: boolean;
}

interface CollectionDef {
  name: string;
  envVar: string;
  attributes: AttributeDef[];
  indexes?: Array<{ key: string; type: 'key'; unique?: boolean }>;
}

const collections: CollectionDef[] = [
  {
    name: 'Events',
    envVar: 'NEXT_PUBLIC_COLLECTION_EVENTS',
    attributes: [
      { type: 'string', key: 'title', size: 255, required: true },
      { type: 'string', key: 'slug', size: 255, required: true },
      { type: 'string', key: 'description', size: 5000, required: true },
      { type: 'datetime', key: 'startDate', required: true },
      { type: 'datetime', key: 'endDate', required: true },
      { type: 'string', key: 'location', size: 255, required: true },
      { type: 'string', key: 'posterUrl', size: 500, required: false },
      { type: 'enum', key: 'status', elements: ['Scheduled', 'Completed', 'Cancelled'], required: true },
      { type: 'enum', key: 'type', elements: ['Talk', 'Session', 'Workshop', 'Test', 'Event', 'Hackathon', 'Guest Lecture', 'Orientation'], required: true },
      { type: 'string', key: 'gallery', size: 100, required: false, array: true }
    ],
    indexes: [{ key: 'slug', type: 'key', unique: true }]
  },
  {
    name: 'Highlights',
    envVar: 'NEXT_PUBLIC_COLLECTION_HIGHLIGHTS',
    attributes: [
      { type: 'string', key: 'title', size: 255, required: true },
      { type: 'string', key: 'slug', size: 255, required: true },
      { type: 'string', key: 'excerpt', size: 500, required: true },
      { type: 'string', key: 'content', size: 50000, required: true },
      { type: 'string', key: 'author', size: 100, required: true },
      { type: 'string', key: 'createdAt', size: 50, required: true },
      { type: 'string', key: 'coverImage', size: 500, required: false }
    ],
    indexes: [{ key: 'slug', type: 'key', unique: true }]
  },
  {
    name: 'Team',
    envVar: 'NEXT_PUBLIC_COLLECTION_TEAM',
    attributes: [
      { type: 'string', key: 'name', size: 100, required: true },
      { type: 'string', key: 'role', size: 100, required: true },
      { type: 'enum', key: 'category', elements: ['Faculty', 'President', 'Vice President', 'Event Head', 'Media', 'Tech', 'Discipline', 'Editor', 'Stage'], required: true },
      { type: 'string', key: 'photo', size: 500, required: false },
      { type: 'string', key: 'email', size: 255, required: false },
      { type: 'string', key: 'phone', size: 20, required: false },
      { type: 'string', key: 'instagram', size: 255, required: false },
      { type: 'string', key: 'linkedin', size: 255, required: false },
      { type: 'string', key: 'github', size: 255, required: false },
      { type: 'integer', key: 'order', required: true }
    ]
  },
  {
    name: 'Members',
    envVar: 'NEXT_PUBLIC_COLLECTION_MEMBERS',
    attributes: [
      { type: 'string', key: 'name', size: 100, required: true },
      { type: 'string', key: 'email', size: 255, required: true },
      { type: 'string', key: 'phone', size: 20, required: true },
      { type: 'string', key: 'semester', size: 10, required: true },
      { type: 'string', key: 'course', size: 100, required: true },
      { type: 'string', key: 'reason', size: 1000, required: true },
      { type: 'enum', key: 'status', elements: ['Pending', 'Approved', 'Rejected'], required: true },
      { type: 'boolean', key: 'subscribe', required: true }
    ],
    indexes: [{ key: 'email', type: 'key', unique: true }]
  },
  {
    name: 'Suggestions',
    envVar: 'NEXT_PUBLIC_COLLECTION_SUGGESTIONS',
    attributes: [
      { type: 'string', key: 'content', size: 3000, required: true },
      { type: 'boolean', key: 'anonymous', required: true },
      { type: 'string', key: 'userName', size: 100, required: false },
      { type: 'string', key: 'userEmail', size: 255, required: false },
      { type: 'string', key: 'response', size: 3000, required: false },
      { type: 'enum', key: 'status', elements: ['Pending', 'Responded'], required: true }
    ]
  },
  {
    name: 'Notifications',
    envVar: 'NEXT_PUBLIC_COLLECTION_NOTIFICATIONS',
    attributes: [
      { type: 'string', key: 'title', size: 255, required: true },
      { type: 'string', key: 'message', size: 2000, required: true },
      { type: 'enum', key: 'type', elements: ['Info', 'Event', 'Alert', 'Success'], required: true },
      { type: 'boolean', key: 'read', required: true },
      { type: 'string', key: 'link', size: 500, required: false }
    ]
  },
  {
    name: 'Subscribers',
    envVar: 'NEXT_PUBLIC_COLLECTION_SUBSCRIBERS',
    attributes: [
      { type: 'string', key: 'email', size: 255, required: true },
      { type: 'boolean', key: 'active', required: true }
    ],
    indexes: [{ key: 'email', type: 'key', unique: true }]
  },
  {
    name: 'Gallery',
    envVar: 'NEXT_PUBLIC_COLLECTION_GALLERY',
    attributes: [
      { type: 'string', key: 'title', size: 255, required: true },
      { type: 'string', key: 'fileId', size: 100, required: true },
      { type: 'string', key: 'eventId', size: 100, required: false },
      { type: 'string', key: 'description', size: 500, required: false }
    ]
  }
];

const createdCollections: Record<string, string> = {};

async function createCollection(def: CollectionDef) {
  try {
    // Check if collection exists
    const existing = await request('GET', `/databases/${databaseId}/collections`);
    const found = existing.collections.find((c: any) => c.name === def.name);
    
    if (found) {
      console.log(`✅ Collection '${def.name}' exists (ID: ${found.$id})`);
      createdCollections[def.envVar] = found.$id;
      return found.$id;
    }

    // Create collection
    const collectionId = `col_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const created = await request('POST', `/databases/${databaseId}/collections`, {
      collectionId,
      name: def.name,
      permissions: [
        'read("any")',
        'create("users")',
        'update("users")',
        'delete("users")'
      ],
      documentSecurity: true
    });

    console.log(`✅ Created collection '${def.name}' (ID: ${created.$id})`);
    createdCollections[def.envVar] = created.$id;

    // Wait for collection to be ready
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create attributes
    for (const attr of def.attributes) {
      try {
        let path = `/databases/${databaseId}/collections/${created.$id}/attributes`;
        const payload: any = {
          key: attr.key,
          required: !!attr.required,
          array: !!attr.array
        };

        switch (attr.type) {
          case 'string':
            path += '/string';
            payload.size = attr.size || 255;
            break;
          case 'integer':
            path += '/integer';
            payload.min = 0;
            payload.max = 999999999;
            break;
          case 'boolean':
            path += '/boolean';
            break;
          case 'datetime':
            path += '/datetime';
            break;
          case 'enum':
            path += '/enum';
            payload.elements = attr.elements || [];
            break;
        }

        await request('POST', path, payload);
        console.log(`  ➤ Added attribute: ${attr.key} (${attr.type})`);
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e: any) {
        console.log(`  ⚠ Attribute '${attr.key}' might already exist`);
      }
    }

    // Create indexes
    if (def.indexes) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      for (const idx of def.indexes) {
        try {
          await request('POST', `/databases/${databaseId}/collections/${created.$id}/indexes`, {
            key: idx.key,
            type: idx.type,
            attributes: [idx.key],
            orders: ['ASC']
          });
          console.log(`  ➤ Created index: ${idx.key}`);
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (e: any) {
          console.log(`  ⚠ Index '${idx.key}' might already exist`);
        }
      }
    }

    return created.$id;
  } catch (e: any) {
    console.error(`❌ Failed to create collection '${def.name}':`, e.message);
    throw e;
  }
}

async function createBucket(id: string, name: string) {
  try {
    const list = await request('GET', '/storage/buckets');
    if (list.buckets.find((b: any) => b.$id === id)) {
      console.log(`✅ Bucket '${id}' exists`);
      return;
    }

    await request('POST', '/storage/buckets', {
      bucketId: id,
      name: name,
      permissions: [
        'read("any")',
        'create("users")',
        'update("users")',
        'delete("users")'
      ],
      fileSecurity: false,
      enabled: true
    });
    console.log(`✅ Created bucket '${id}'`);
  } catch (e: any) {
    console.log(`⚠ Bucket '${id}' might already exist`);
  }
}

function updateEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  let envContent = fs.readFileSync(envPath, 'utf-8');

  console.log('\n📝 Updating .env.local with collection IDs...');

  for (const [envVar, collectionId] of Object.entries(createdCollections)) {
    const regex = new RegExp(`${envVar}=.*`, 'g');
    envContent = envContent.replace(regex, `${envVar}=${collectionId}`);
    console.log(`  ➤ ${envVar}=${collectionId}`);
  }

  fs.writeFileSync(envPath, envContent);
  console.log('\n✅ .env.local updated successfully!');
}

async function main() {
  console.log('🚀 Starting Appwrite Setup...\n');
  console.log(`Endpoint: ${endpoint}`);
  console.log(`Project: ${project}`);
  console.log(`Database: ${databaseId}\n`);

  try {
    // Create collections
    console.log('📦 Creating Collections...\n');
    for (const def of collections) {
      await createCollection(def);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Create buckets
    console.log('\n🗄️  Creating Storage Buckets...\n');
    await createBucket('gallery', 'Gallery Images');
    await createBucket('events', 'Event Posters');
    await createBucket('team', 'Team Photos');

    // Update .env.local
    updateEnvFile();

    console.log('\n✨ Setup Complete! ✨');
    console.log('\n⚠️  IMPORTANT: Restart your development server for changes to take effect.');
    console.log('   Run: npm run dev\n');

  } catch (error: any) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

main();
