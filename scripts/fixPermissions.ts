import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const apiKey = process.env.APPWRITE_API_KEY!;

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

const collections = [
  'auto_1763586568976_qt1sfp', // Events
  'auto_1763586571724_psmsmf', // Highlights
  'auto_1763586573960_ec75mk', // Team
  'auto_1763586576829_9d9mwm', // Members
  'auto_1763586579090_lvnnos', // Suggestions
  'auto_1763586581248_oi4e46', // Notifications
  'auto_1763586582606_wjggpt', // Subscribers
  'auto_1763586583858_5bdqms', // Gallery
];

(async () => {
  console.log('Fixing collection permissions...');
  
  for (const collectionId of collections) {
    try {
      // First get the collection to retrieve its name
      const collection = await request('GET', `/databases/${databaseId}/collections/${collectionId}`);
      
      // Update collection permissions to allow public read
      await request('PUT', `/databases/${databaseId}/collections/${collectionId}`, {
        name: collection.name,
        permissions: [
          'read("any")',
          'create("users")',
          'update("users")',
          'delete("users")'
        ],
        documentSecurity: true,
        enabled: true
      });
      console.log(`✓ Fixed permissions for collection: ${collection.name} (${collectionId})`);
    } catch (e: any) {
      console.error(`✗ Failed to fix collection ${collectionId}:`, e.message);
    }
  }
  
  console.log('\nDone! Restart your dev server: npm run dev');
})();
