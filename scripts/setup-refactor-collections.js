const { Client, Databases, ID, Permission, Role } = require('node-appwrite');
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
    DATABASE_ID: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID, // Should be the new one: 692136c3001bf41a6dfa
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

async function setupCollections() {
    console.log('🚀 Setting up Events and Gallery collections...\n');

    try {
        // 1. Create Events Collection
        console.log('📋 Creating Events collection...');
        const events = await databases.createCollection(
            CONFIG.DATABASE_ID,
            ID.unique(),
            'Events',
            [
                Permission.read(Role.any()),
                Permission.create(Role.users()),
                Permission.update(Role.users()),
                Permission.delete(Role.users()),
            ]
        );
        console.log(`✅ Events collection created: ${events.$id}`);

        // Events Attributes
        console.log('   Creating Events attributes...');
        await databases.createStringAttribute(CONFIG.DATABASE_ID, events.$id, 'title', 255, true);
        await databases.createDatetimeAttribute(CONFIG.DATABASE_ID, events.$id, 'date', true);
        await databases.createStringAttribute(CONFIG.DATABASE_ID, events.$id, 'description', 1000, true);
        await databases.createUrlAttribute(CONFIG.DATABASE_ID, events.$id, 'image_url', true);
        await databases.createUrlAttribute(CONFIG.DATABASE_ID, events.$id, 'registration_link', false);
        await databases.createEnumAttribute(CONFIG.DATABASE_ID, events.$id, 'status', ['Open', 'Closed', 'Completed'], true);
        console.log('   ✅ Events attributes created');


        // 2. Create Gallery Collection
        console.log('\n📋 Creating Gallery collection...');
        const gallery = await databases.createCollection(
            CONFIG.DATABASE_ID,
            ID.unique(),
            'Gallery',
            [
                Permission.read(Role.any()),
                Permission.create(Role.users()),
                Permission.update(Role.users()),
                Permission.delete(Role.users()),
            ]
        );
        console.log(`✅ Gallery collection created: ${gallery.$id}`);

        // Gallery Attributes
        console.log('   Creating Gallery attributes...');
        await databases.createStringAttribute(CONFIG.DATABASE_ID, gallery.$id, 'caption', 255, true);
        await databases.createUrlAttribute(CONFIG.DATABASE_ID, gallery.$id, 'image_url', true);
        await databases.createStringAttribute(CONFIG.DATABASE_ID, gallery.$id, 'category', 100, true);
        console.log('   ✅ Gallery attributes created');

        console.log('\n✅ Setup complete!');
        console.log('\n📝 Add these to your .env.local:');
        console.log(`NEXT_PUBLIC_COLLECTION_EVENTS=${events.$id}`);
        console.log(`NEXT_PUBLIC_COLLECTION_GALLERY=${gallery.$id}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

setupCollections();
