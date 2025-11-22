const { Client, Databases, Storage, ID, Permission, Role } = require('node-appwrite');
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
    PROJECT_ID: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
    API_KEY: process.env.APPWRITE_API_KEY,
    DATABASE_ID: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
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
const storage = new Storage(client);

async function setupGalleryAlbums() {
    console.log('🚀 Setting up Gallery Albums feature...\n');

    try {
        // 1. Create Albums Collection
        console.log('📋 Creating Albums collection...');
        const albums = await databases.createCollection(
            CONFIG.DATABASE_ID,
            ID.unique(),
            'Albums',
            [
                Permission.read(Role.any()),
                Permission.create(Role.users()),
                Permission.update(Role.users()),
                Permission.delete(Role.users()),
            ]
        );
        console.log(`✅ Albums collection created: ${albums.$id}`);

        // Albums Attributes
        console.log('   Creating Albums attributes...');
        await databases.createStringAttribute(CONFIG.DATABASE_ID, albums.$id, 'title', 255, true);
        await databases.createDatetimeAttribute(CONFIG.DATABASE_ID, albums.$id, 'date', true);
        await databases.createUrlAttribute(CONFIG.DATABASE_ID, albums.$id, 'cover_image_url', true);
        await databases.createIntegerAttribute(CONFIG.DATABASE_ID, albums.$id, 'photo_count', false, 0);
        await databases.createUrlAttribute(CONFIG.DATABASE_ID, albums.$id, 'link', false); // Link to view full album (e.g. Drive)
        console.log('   ✅ Albums attributes created');

        // 2. Create Album Covers Bucket
        console.log('\n📦 Creating Album Covers bucket...');
        try {
            await storage.getBucket('album-covers');
            console.log('   ⚠️ Bucket "album-covers" already exists.');
        } catch (error) {
            await storage.createBucket(
                'album-covers',
                'Album Covers',
                [Permission.read(Role.any()), Permission.write(Role.users())],
                false,
                true,
                undefined,
                ['jpg', 'jpeg', 'png', 'webp']
            );
            console.log('   ✅ Bucket "album-covers" created.');
        }

        console.log('\n✅ Setup complete!');
        console.log('\n📝 Add this to your .env.local:');
        console.log(`NEXT_PUBLIC_COLLECTION_ALBUMS=${albums.$id}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

setupGalleryAlbums();
