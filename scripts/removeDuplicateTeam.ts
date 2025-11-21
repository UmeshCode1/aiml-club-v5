/**
 * Remove duplicate team members from the Team collection
 * Keeps the first occurrence and deletes duplicates based on name + email
 */


let endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
let project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '691e2b31003e6415bb4f';
let databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '691e2d6e00131d7cccf1';
let apiKey = process.env.APPWRITE_API_KEY || '';

let teamCollectionIdRaw = process.env.NEXT_PUBLIC_COLLECTION_TEAM;
let teamCollectionId = (!teamCollectionIdRaw || teamCollectionIdRaw === 'TBD') ? 'auto_1763586573960_ec75mk' : teamCollectionIdRaw;

if (!endpoint || !project || !databaseId || !teamCollectionId || !apiKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

interface TeamMember {
  $id: string;
  name: string;
  email?: string;
  role: string;
  department: string;
  $createdAt: string;
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
  
  // Handle empty responses (like DELETE)
  const text = await res.text();
  if (!text) {
    return {};
  }
  return JSON.parse(text);
}

async function getAllTeamMembers(): Promise<TeamMember[]> {
  const members: TeamMember[] = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const response = await api(
      'GET',
      `/databases/${databaseId}/collections/${teamCollectionId}/documents?limit=${limit}&offset=${offset}`
    );

    if (response.documents && response.documents.length > 0) {
      members.push(...response.documents);
      offset += limit;

      if (response.documents.length < limit) {
        break;
      }
    } else {
      break;
    }
  }

  return members;
}

async function deleteDocument(documentId: string) {
  await api('DELETE', `/databases/${databaseId}/collections/${teamCollectionId}/documents/${documentId}`);
}

async function removeDuplicates() {
  console.log('🔍 Fetching all team members...');
  const allMembers = await getAllTeamMembers();
  console.log(`📊 Found ${allMembers.length} total team members`);

  // Track unique members by name + email (or just name if no email)
  const seen = new Map<string, TeamMember>();
  const duplicates: TeamMember[] = [];

  for (const member of allMembers) {
    // Create a unique key: name + email (lowercase, trimmed)
    const name = member.name?.toLowerCase().trim() || '';
    const email = member.email?.toLowerCase().trim() || '';
    const key = email ? `${name}::${email}` : name;

    if (seen.has(key)) {
      // This is a duplicate
      duplicates.push(member);
      console.log(`❌ Duplicate found: ${member.name} (${member.email || 'no email'}) - ID: ${member.$id}`);
    } else {
      // First occurrence - keep it
      seen.set(key, member);
      console.log(`✅ Keeping: ${member.name} (${member.email || 'no email'}) - ID: ${member.$id}`);
    }
  }

  console.log(`\n📋 Summary:`);
  console.log(`   Total members: ${allMembers.length}`);
  console.log(`   Unique members: ${seen.size}`);
  console.log(`   Duplicates to remove: ${duplicates.length}`);

  if (duplicates.length === 0) {
    console.log('\n✨ No duplicates found! Database is clean.');
    return;
  }

  console.log(`\n🗑️  Removing ${duplicates.length} duplicate team members...`);

  let deletedCount = 0;
  for (const duplicate of duplicates) {
    try {
      await deleteDocument(duplicate.$id);
      deletedCount++;
      console.log(`   ✓ Deleted: ${duplicate.name} (ID: ${duplicate.$id})`);
    } catch (error) {
      console.error(`   ✗ Failed to delete ${duplicate.name}:`, error);
    }
  }

  console.log(`\n✅ Complete! Removed ${deletedCount} duplicate team members.`);
  console.log(`📊 Remaining unique members: ${seen.size}`);
}

// Run the script
removeDuplicates()
  .then(() => {
    console.log('\n🎉 Duplicate removal complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
