// Node script to verify Appwrite connectivity without relying on the UI wizard.
// It parses .env.local to inject environment variables (Next.js does this automatically, Node does not).

const fs = require('fs');
const path = require('path');
const { Client, Databases } = require('appwrite');

function loadEnvLocal() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('Missing .env.local file at project root.');
    process.exit(1);
  }
  const content = fs.readFileSync(envPath, 'utf8');
  content.split(/\r?\n/).forEach(line => {
    if (!line || line.startsWith('#') || !line.includes('=')) return;
    const [key, ...rest] = line.split('=');
    const value = rest.join('=').trim();
    if (!process.env[key]) process.env[key] = value;
  });
}

async function main() {
  loadEnvLocal();
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  const apiKey = process.env.APPWRITE_API_KEY;

  if (!endpoint || !project) {
    console.error('Critical env vars missing (endpoint/project).');
    process.exit(1);
  }
  if (!apiKey) {
    console.error('APPWRITE_API_KEY missing. Add it to .env.local.');
    process.exit(1);
  }

  console.log('> Endpoint:', endpoint);
  console.log('> Project :', project);
  console.log('> Database:', databaseId || '(not set)');

  // Raw health check
  try {
    const healthRes = await fetch(endpoint + '/health/version');
    const healthJson = await healthRes.json();
    console.log('> Health  :', healthJson);
  } catch (e) {
    console.log('> Health  : ERROR', e.message);
  }

  // SDK test
  // Appwrite JS SDK (v14) does not expose setKey in the browser client chain when used in Node without enabling the specific method.
  // We will perform the collections listing via REST fetch with headers instead of SDK for API key auth.
  const client = new Client().setEndpoint(endpoint).setProject(project);
  const databases = new Databases(client); // kept for potential future unauthenticated operations

  if (databaseId) {
    try {
      const url = `${endpoint}/databases/${databaseId}/collections`; 
      const res = await fetch(url, {
        headers: {
          'x-appwrite-project': project,
          'x-appwrite-key': apiKey,
        }
      });
      if (!res.ok) {
        console.log('> Collections list failed: HTTP', res.status);
      } else {
        const json = await res.json();
        console.log(`> Collections (${json.total}):`);
        json.collections.forEach(c => console.log('   -', c.name, c.$id));
      }
    } catch (e) {
      console.log('> Collections list failed:', e.message);
    }
  } else {
    console.log('> Skipped collections listing (database ID missing).');
  }

  console.log('\nVerification complete. If health and collections are shown, Appwrite is connected.');
}

main();
