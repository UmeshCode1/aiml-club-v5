/**
 * Add Shamaila Khan to Team collection
 */


const endpoint = 'https://fra.cloud.appwrite.io/v1';
const project = '691e2b31003e6415bb4f';
const databaseId = '691e2d6e00131d7cccf1';
const teamCollectionId = 'auto_1763586573960_ec75mk';
const apiKey = process.env.APPWRITE_API_KEY || '';

if (!apiKey) {
  console.error('Missing APPWRITE_API_KEY');
  process.exit(1);
}

async function api(method: string, path: string, body?: any) {
  const url = `${endpoint}${path}`;
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': project,
      'X-Appwrite-Key': apiKey,
    },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error: ${res.status} ${text}`);
  }
  const text = await res.text();
  if (!text) return {};
  return JSON.parse(text);
}

async function addShamilaKhan() {
  console.log('🎓 Adding Shamaila Khan...\n');

  const member = {
    name: 'Shamaila Khan',
    role: 'Coordinating Faculty',
    category: 'leadership',
    bio: 'Faculty Coordinator',
    photoId: '',
    email: '',
    instagram: '',
    linkedin: '',
    github: '',
    order: 1,
  };

  try {
    const body = {
      documentId: 'unique()',
      data: member,
    };

    await api('POST', `/databases/${databaseId}/collections/${teamCollectionId}/documents`, body);
    console.log(`✅ Added: ${member.name} - ${member.role}`);
  } catch (error) {
    console.error(`❌ Failed to add ${member.name}:`, error);
  }

  console.log('\n🎉 Complete!');
}

addShamilaKhan()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
