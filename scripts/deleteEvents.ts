/**
 * Delete specific events by title.
 * Usage: npx ts-node scripts/deleteEvents.ts
 */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local', override: true });

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const eventsCollectionIdRaw = process.env.NEXT_PUBLIC_COLLECTION_EVENTS;
const eventsCollectionId = (!eventsCollectionIdRaw || eventsCollectionIdRaw === 'TBD') ? 'auto_1763586568976_qt1sfp' : eventsCollectionIdRaw;
const apiKey = process.env.APPWRITE_API_KEY!;

if (!endpoint || !project || !databaseId || !apiKey) {
  console.error('Missing env variables.');
  process.exit(1);
}

const TITLES_TO_DELETE = [
  'Intro to Machine Learning',
  'AI Innovation Hackathon',
  'Guest Lecture: Future of AI'
];

async function api(method: string, path: string, body?: any) {
  const res = await fetch(endpoint + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': project,
      'X-Appwrite-Key': apiKey
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) throw new Error(`${method} ${path} ${res.status}: ${text}`);
  return data;
}

async function findByTitle(title: string) {
  try {
    const q = encodeURIComponent(`search("title", "${title}")`);
    const r = await api('GET', `/databases/${databaseId}/collections/${eventsCollectionId}/documents?queries[]=${q}`);
    return (r.documents || []).filter((d: any) => d.title === title);
  } catch {
    // Fallback: get all and filter
    try {
      const r = await api('GET', `/databases/${databaseId}/collections/${eventsCollectionId}/documents`);
      return (r.documents || []).filter((d: any) => d.title === title);
    } catch {
      return [];
    }
  }
}

async function deleteDoc(docId: string) {
  await api('DELETE', `/databases/${databaseId}/collections/${eventsCollectionId}/documents/${docId}`);
}

(async () => {
  try {
    for (const title of TITLES_TO_DELETE) {
      const docs = await findByTitle(title);
      if (docs.length === 0) {
        console.log(`Not found: ${title}`);
        continue;
      }
      for (const doc of docs) {
        await deleteDoc(doc.$id);
        console.log(`Deleted: ${title} (${doc.$id})`);
      }
    }
    console.log('Deletion complete.');
  } catch (e: any) {
    console.error('Failed:', e.message || e);
    process.exit(1);
  }
})();
