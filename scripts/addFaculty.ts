/**
 * Add Faculty Leadership to Team collection
 */


const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '691e2b31003e6415bb4f';
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '691e2d6e00131d7cccf1';
const apiKey = process.env.APPWRITE_API_KEY || '';

const teamCollectionIdRaw = process.env.NEXT_PUBLIC_COLLECTION_TEAM;
const teamCollectionId = (!teamCollectionIdRaw || teamCollectionIdRaw === 'TBD') ? 'auto_1763586573960_ec75mk' : teamCollectionIdRaw;
if (!endpoint || !project || !databaseId || !teamCollectionId || !apiKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

// Only one api function
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
  if (!text) {
    return {};
  }
  return JSON.parse(text);
}

const facultyMembers = [
  {
    name: 'Dr. Rajesh Kumar Nigam',
    role: 'HOD, AIML Department',
    category: 'leadership',
    bio: 'Head of Department, AIML',
    photoId: '',
    email: '',
    instagram: '',
    linkedin: '',
    github: '',
    order: 0,
  },
  {
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
  },
];

async function addFacultyMembers() {
  console.log('🎓 Adding Faculty Leadership to Team collection...\n');

  for (const member of facultyMembers) {
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
  }

  console.log('\n🎉 Faculty Leadership added successfully!');
}

addFacultyMembers()
  .then(() => {
    console.log('✅ Complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
