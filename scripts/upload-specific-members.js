const { Client, Storage, Databases, ID, Query } = require('node-appwrite');
const { InputFile } = require('node-appwrite/file');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    ENDPOINT: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1',
    PROJECT_ID: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '691e2b31003e6415bb4f',
    API_KEY: process.env.APPWRITE_API_KEY,
    DATABASE_ID: '691e2d6e00131d7cccf1',
    COLLECTION_ID: 'auto_1763586573960_ec75mk', // Team collection
    BUCKET_ID: '691f19dd000afea07882', // CLUB_DETAILS bucket
};

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(CONFIG.ENDPOINT)
    .setProject(CONFIG.PROJECT_ID)
    .setKey(CONFIG.API_KEY);

const storage = new Storage(client);
const databases = new Databases(client);

// Team members to upload
const teamMembers = [
    {
        name: 'Kinshuk Verma',
        imagePath: path.join(__dirname, '..', 'Team members', 'kinshuk.JPG'),
        fileId: 'kinshuk-verma-photo'
    },
    {
        name: 'Arnav',
        imagePath: path.join(__dirname, '..', 'Team members', 'arnav.jpg'),
        fileId: 'arnav-photo'
    },
    {
        name: 'Sarvesh',
        imagePath: path.join(__dirname, '..', 'Team members', 'sarvesh.jpeg'),
        fileId: 'sarvesh-photo'
    },
    {
        name: 'Avni',
        imagePath: path.join(__dirname, '..', 'Team members', 'avni.jpg'),
        fileId: 'avni-photo'
    },
    {
        name: 'Daksh',
        imagePath: path.join(__dirname, '..', 'Team members', 'Dkhash.jpg'),
        fileId: 'daksh-photo'
    }
];

async function findTeamMember(name) {
    try {
        const response = await databases.listDocuments(
            CONFIG.DATABASE_ID,
            CONFIG.COLLECTION_ID,
            [Query.limit(100)]
        );

        // Find member by partial name match
        const member = response.documents.find(doc =>
            doc.name.toLowerCase().includes(name.toLowerCase()) ||
            name.toLowerCase().includes(doc.name.toLowerCase())
        );

        return member;
    } catch (error) {
        console.error(`Error finding member ${name}:`, error.message);
        return null;
    }
}

async function uploadAndUpdateMember(memberInfo) {
    console.log(`\n📸 Processing ${memberInfo.name}...`);
    console.log(`   Image path: ${memberInfo.imagePath}`);

    // Check if file exists
    if (!fs.existsSync(memberInfo.imagePath)) {
        console.error(`   ❌ Image file not found: ${memberInfo.imagePath}`);
        return;
    }

    try {
        // Find the team member in database
        const dbMember = await findTeamMember(memberInfo.name);

        if (!dbMember) {
            console.error(`   ❌ Team member not found in database: ${memberInfo.name}`);
            return;
        }

        console.log(`   ✅ Found in database: ${dbMember.name} (ID: ${dbMember.$id})`);

        // Delete existing photo if it exists
        if (dbMember.photoId) {
            try {
                await storage.deleteFile(CONFIG.BUCKET_ID, dbMember.photoId);
                console.log(`   🗑️  Deleted old photo: ${dbMember.photoId}`);
            } catch (e) {
                // File might not exist, continue
            }
        }

        // Upload new photo - use actual filename to preserve extension
        const fileName = path.basename(memberInfo.imagePath);
        const file = await storage.createFile(
            CONFIG.BUCKET_ID,
            memberInfo.fileId,
            InputFile.fromPath(memberInfo.imagePath, fileName)
        );

        console.log(`   ✅ Photo uploaded: ${file.$id}`);

        // Update database record
        await databases.updateDocument(
            CONFIG.DATABASE_ID,
            CONFIG.COLLECTION_ID,
            dbMember.$id,
            {
                photoId: file.$id
            }
        );

        console.log(`   ✅ Database updated with photoId: ${file.$id}`);
        console.log(`   🔗 View URL: ${CONFIG.ENDPOINT}/storage/buckets/${CONFIG.BUCKET_ID}/files/${file.$id}/view?project=${CONFIG.PROJECT_ID}`);

    } catch (error) {
        console.error(`   ❌ Error processing ${memberInfo.name}:`, error.message);
    }
}

async function uploadAllMembers() {
    console.log('🚀 Starting team member photo upload...\n');
    console.log(`Database: ${CONFIG.DATABASE_ID}`);
    console.log(`Collection: ${CONFIG.COLLECTION_ID}`);
    console.log(`Bucket: ${CONFIG.BUCKET_ID}\n`);

    for (const member of teamMembers) {
        await uploadAndUpdateMember(member);
    }

    console.log('\n✨ Upload process complete!\n');
}

uploadAllMembers().catch(console.error);
