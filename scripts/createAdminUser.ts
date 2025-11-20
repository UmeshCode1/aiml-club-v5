/**
 * Create or ensure an admin user and append its ID to .env.local (ADMIN_USER_IDS).
 * Usage:
 *   npx ts-node scripts/createAdminUser.ts --email user@example.com --password MySecret123! --name "Admin User" --id customId
 * If --password is omitted a random strong password will be generated and printed.
 * Requires APPWRITE_API_KEY with users.write scope.
 */
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local', override: true });

interface Args { [k: string]: string | undefined; }
function parseArgs(): Args {
  const out: Args = {};
  for (let i = 2; i < process.argv.length; i++) {
    const a = process.argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = process.argv[i+1];
      if (next && !next.startsWith('--')) { out[key] = next; i++; } else { out[key] = 'true'; }
    }
  }
  return out;
}
const args = parseArgs();

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
if (!endpoint || !project || !apiKey) {
  console.error('Missing endpoint/project/apiKey in .env.local');
  process.exit(1);
}

const email = args.email || process.env.ADMIN_EMAIL || '';
const name = args.name || 'Administrator';
let password = args.password || process.env.ADMIN_PASSWORD || '';
let userId = args.id || 'unique()';
if (!email) {
  console.error('Provide --email or set ADMIN_EMAIL in .env.local');
  process.exit(1);
}
if (!password) {
  password = 'Adm!' + crypto.randomBytes(10).toString('hex');
  console.log('Generated password:', password);
}

async function api(method: string, path: string, body?: any) {
  const res = await fetch(`${endpoint}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': project!,
      'X-Appwrite-Key': apiKey!
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) throw new Error(`${method} ${path} ${res.status}: ${text}`);
  return data;
}

async function ensureUser() {
  // Try find by email
  const list = await api('GET','/users');
  const existing = list.users.find((u: any) => u.email === email);
  if (existing) {
    console.log('User already exists:', existing.$id);
    userId = existing.$id; // use real id for env sync
    return existing;
  }
  console.log('Creating user...');
  const created = await api('POST','/users', {
    userId,
    email,
    password,
    name
  });
  console.log('Created user:', created.$id);
  userId = created.$id;
  return created;
}

function syncEnvAdminIds(id: string) {
  let envText = '';
  try { envText = fs.readFileSync('.env.local','utf8'); } catch { envText = ''; }
  const lines = envText.split(/\r?\n/);
  const key = 'ADMIN_USER_IDS=';
  const existingLineIndex = lines.findIndex(l => l.startsWith(key));
  if (existingLineIndex === -1) {
    lines.push(key + id);
  } else {
    const current = lines[existingLineIndex].slice(key.length).split(',').map(s => s.trim()).filter(Boolean);
    if (!current.includes(id)) current.push(id);
    lines[existingLineIndex] = key + current.join(',');
  }
  fs.writeFileSync('.env.local', lines.join('\n'));
  console.log('Updated .env.local ADMIN_USER_IDS with', id);
}

(async () => {
  try {
    const user = await ensureUser();
    syncEnvAdminIds(user.$id);
    console.log('Done. You can now treat this user as admin via ADMIN_USER_IDS.');
  } catch (e: any) {
    console.error('Failed:', e.message || e);
    process.exit(1);
  }
})();
