import { Storage, Databases, Client, ID } from 'appwrite';
import fs from 'fs';
import path from 'path';

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('691e2b31003e6415bb4f')
  .setKey('standard_576696f64f09ff6c69be7bfb35e6d161592f20115185eae1a65f0a67ba05bfa0db5d2218a460b54e5bb7be726a6528bf34ed5d6d81b3a45cd0faeb1d760e233637162913d980e9300f488b28644195a24f82d5c095a9f2712bedd112febfd7a01dfb9c0ea1ec78d47f0defaa7d8b98a4adb5f6465a464f23088b1f4764403810');

const storage = new Storage(client);
const databases = new Databases(client);
const DATABASE_ID = '691e2d6e00131d7cccf1';
const TEAM_COLLECTION_ID = 'auto_1763586573960_ec75mk';
const BUCKET_ID = 'team-images'; // Make sure this bucket exists in Appwrite
const IMAGE_DIR = 'D:/AIML CLUB V5/Team members';

async function uploadImagesAndUpdateDB() {
  const files = fs.readdirSync(IMAGE_DIR);
  for (const file of files) {
    const filePath = path.join(IMAGE_DIR, file);
    const name = path.parse(file).name;
    try {
      // Upload image
      const result = await storage.createFile(
        BUCKET_ID,
        ID.unique(),
        fs.createReadStream(filePath)
      );
      const fileId = result.$id;
      console.log(`Uploaded: ${file} as ${fileId}`);
      // Find team member by name and update photoId
      const docs = await databases.listDocuments(DATABASE_ID, TEAM_COLLECTION_ID, [
        // Appwrite search is limited, so we use filter
      ]);
      const member = docs.documents.find((d: any) => d.name.toLowerCase().includes(name.toLowerCase()));
      if (member) {
        await databases.updateDocument(DATABASE_ID, TEAM_COLLECTION_ID, member.$id, { photoId: fileId });
        console.log(`Updated member: ${member.name} with photoId: ${fileId}`);
      } else {
        console.log(`No member found for image: ${file}`);
      }
    } catch (err: any) {
      console.error(`Error for ${file}:`, err.message);
    }
  }
}

uploadImagesAndUpdateDB();
