const { Client, Databases } = require('node-appwrite');
const fs = require('fs');
const path = require('path');

// Load env
try {
    const envPath = path.resolve(__dirname, '../.env.local');
    if (fs.existsSync(envPath)) {
        require('dotenv').config({ path: envPath, override: true });
    }
} catch (e) {
    console.error('Error reading .env.local:', e);
}

const CONFIG = {
    ENDPOINT: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1',
    PROJECT_ID: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '691e2b31003e6415bb4f',
    API_KEY: process.env.APPWRITE_API_KEY,
    DATABASE_ID: '692136c3001bf41a6dfa',
};

if (!CONFIG.API_KEY) {
    console.error('❌ Error: APPWRITE_API_KEY is missing.');
    process.exit(1);
}

const client = new Client()
    .setEndpoint(CONFIG.ENDPOINT)
    .setProject(CONFIG.PROJECT_ID)
    .setKey(CONFIG.API_KEY);

const databases = new Databases(client);

// Collections to delete (from the screenshot)
const collectionsToDelete = [
    { id: '6921371e0000b7536d2c', name: 'Events' },
    { id: '6921371f0023b91c62b3', name: 'Highlights' },
    { id: '692137210013d4ab661f', name: 'Suggestions' },
    { id: '692137220038245edd8', name: 'Subscribers' },
    { id: '692137240013d4a9661f', name: 'Notifications' },
    { id: '692137250030a04ab347', name: 'Messages' },
];

async function cleanupDatabase() {
    console.log('🧹 Cleaning up database - keeping only Team collection...\n');

    for (const collection of collectionsToDelete) {
        try {
            console.log(`🗑️  Deleting ${collection.name}...`);
            await databases.deleteCollection(CONFIG.DATABASE_ID, collection.id);
            console.log(`   ✅ Deleted ${collection.name}\n`);
        } catch (error) {
            console.log(`   ⚠️  ${collection.name}: ${error.message}\n`);
        }
    }

    console.log('✅ Cleanup complete!');
    console.log('📋 Your database now contains only the Team collection.');
}

cleanupDatabase();
