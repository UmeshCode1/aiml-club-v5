import { Client, Databases } from 'appwrite';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Test Appwrite connection
async function testConnection() {
  console.log('🔍 Testing Appwrite Connection...\n');

  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

  console.log('Configuration:');
  console.log('Endpoint:', endpoint);
  console.log('Project ID:', projectId);
  console.log('Database ID:', databaseId);
  console.log('');

  if (!endpoint || !projectId || !databaseId) {
    console.error('❌ Missing environment variables!');
    return;
  }

  try {
    const client = new Client()
      .setEndpoint(endpoint)
      .setProject(projectId);

    const databases = new Databases(client);

    // Test database connection
    console.log('Testing database connection...');
    const collections = [
      { name: 'Events', id: process.env.NEXT_PUBLIC_COLLECTION_EVENTS },
      { name: 'Highlights', id: process.env.NEXT_PUBLIC_COLLECTION_HIGHLIGHTS },
      { name: 'Team', id: process.env.NEXT_PUBLIC_COLLECTION_TEAM },
      { name: 'Members', id: process.env.NEXT_PUBLIC_COLLECTION_MEMBERS },
      { name: 'Gallery', id: process.env.NEXT_PUBLIC_COLLECTION_GALLERY },
    ];

    for (const collection of collections) {
      try {
        const result = await databases.listDocuments(databaseId, collection.id!);
        console.log(`✅ ${collection.name}: ${result.documents.length} documents`);
      } catch (error: any) {
        console.log(`❌ ${collection.name}: ${error.message}`);
      }
    }

    console.log('\n✅ Connection test complete!');
  } catch (error: any) {
    console.error('\n❌ Connection failed:', error.message);
  }
}

testConnection();
