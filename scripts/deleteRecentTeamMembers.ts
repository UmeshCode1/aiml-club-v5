import { Client, Databases, Query } from 'appwrite';

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('691e2b31003e6415bb4f')
  .setKey('standard_576696f64f09ff6c69be7bfb35e6d161592f20115185eae1a65f0a67ba05bfa0db5d2218a460b54e5bb7be726a6528bf34ed5d6d81b3a45cd0faeb1d760e233637162913d980e9300f488b28644195a24f82d5c095a9f2712bedd112febfd7a01dfb9c0ea1ec78d47f0defaa7d8b98a4adb5f6465a464f23088b1f4764403810');

const databases = new Databases(client);
const DATABASE_ID = '691e2d6e00131d7cccf1';
const TEAM_COLLECTION_ID = 'auto_1763586573960_ec75mk';

async function deleteRecentTeamMembers() {
  // Get all team members added after a certain order (e.g., order >= 1)
  const { documents } = await databases.listDocuments(DATABASE_ID, TEAM_COLLECTION_ID, [Query.greaterEqual('order', 1)]);
  for (const doc of documents) {
    try {
      await databases.deleteDocument(DATABASE_ID, TEAM_COLLECTION_ID, doc.$id);
      console.log(`Deleted: ${doc.name} (${doc.role})`);
    } catch (err) {
      console.error(`Error deleting ${doc.name}:`, err.message);
    }
  }
}

deleteRecentTeamMembers();
