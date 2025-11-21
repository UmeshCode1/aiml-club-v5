const { Client, Storage, Databases, ID } = require('node-appwrite');
const { InputFile } = require('node-appwrite/file');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    ENDPOINT: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1',
    PROJECT_ID: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '691e2b31003e6415bb4f',
    API_KEY: process.env.APPWRITE_API_KEY,
    BUCKET_ID: '691f19dd000afea07882', // CLUB_DETAILS bucket
};

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(CONFIG.ENDPOINT)
    .setProject(CONFIG.PROJECT_ID)
    .setKey(CONFIG.API_KEY);

const storage = new Storage(client);

async function uploadLogos() {
    console.log('🚀 Starting logo upload to Appwrite...\n');

    const logos = [
        {
            name: 'college-logo',
            path: path.join(__dirname, '..', 'Images', 'oriental college image_edited.jpg'),
            fileId: 'college-logo',
            description: 'Oriental College of Technology Logo'
        },
        {
            name: 'aiml-logo',
            path: path.join(__dirname, '..', 'Images', 'logo aiml.png'),
            fileId: 'aiml-logo',
            description: 'AIML Club Logo'
        }
    ];

    for (const logo of logos) {
        try {
            console.log(`📤 Uploading ${logo.description}...`);
            console.log(`   Path: ${logo.path}`);

            // Check if file exists
            if (!fs.existsSync(logo.path)) {
                console.error(`   ❌ File not found: ${logo.path}`);
                continue;
            }

            // Delete existing file if it exists
            try {
                await storage.deleteFile(CONFIG.BUCKET_ID, logo.fileId);
                console.log(`   🗑️  Deleted existing file`);
            } catch (e) {
                // File doesn't exist, that's fine
            }

            // Upload new file
            const file = await storage.createFile(
                CONFIG.BUCKET_ID,
                logo.fileId,
                InputFile.fromPath(logo.path, logo.name)
            );

            console.log(`   ✅ Uploaded successfully!`);
            console.log(`   File ID: ${file.$id}`);
            console.log(`   View URL: ${CONFIG.ENDPOINT}/storage/buckets/${CONFIG.BUCKET_ID}/files/${file.$id}/view?project=${CONFIG.PROJECT_ID}`);
            console.log('');

        } catch (error) {
            console.error(`   ❌ Error uploading ${logo.description}:`, error.message);
            console.log('');
        }
    }

    console.log('✨ Logo upload complete!\n');
    console.log('📋 URLs to use in your app:');
    console.log(`College Logo: ${CONFIG.ENDPOINT}/storage/buckets/${CONFIG.BUCKET_ID}/files/college-logo/view?project=${CONFIG.PROJECT_ID}`);
    console.log(`AIML Logo: ${CONFIG.ENDPOINT}/storage/buckets/${CONFIG.BUCKET_ID}/files/aiml-logo/view?project=${CONFIG.PROJECT_ID}`);
}

uploadLogos().catch(console.error);
