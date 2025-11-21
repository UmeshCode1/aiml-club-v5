const { Client, Databases, ID } = require('node-appwrite');

// Configuration
const CONFIG = {
    ENDPOINT: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1',
    PROJECT_ID: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '691e2b31003e6415bb4f',
    API_KEY: process.env.APPWRITE_API_KEY,
    DATABASE_ID: '691e2d6e00131d7cccf1',
};

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(CONFIG.ENDPOINT)
    .setProject(CONFIG.PROJECT_ID)
    .setKey(CONFIG.API_KEY);

const databases = new Databases(client);

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function createGalleryCollection() {
    console.log('🚀 Creating Gallery Albums Collection...\n');

    const collectionId = 'gallery_albums';

    try {
        // Create collection
        console.log('Creating collection...');
        const collection = await databases.createCollection(
            CONFIG.DATABASE_ID,
            collectionId,
            'Gallery Albums',
            [
                'read("any")',
                'create("users")',
                'update("users")',
                'delete("users")'
            ]
        );

        console.log('✅ Collection created:', collection.$id);
        console.log('\n📝 Creating attributes (this may take a while)...\n');

        // Name
        await databases.createStringAttribute(CONFIG.DATABASE_ID, collectionId, 'name', 255, true);
        console.log('✅ name');
        await wait(1500);

        // Description
        await databases.createStringAttribute(CONFIG.DATABASE_ID, collectionId, 'description', 5000, false);
        console.log('✅ description');
        await wait(1500);

        // Date
        await databases.createStringAttribute(CONFIG.DATABASE_ID, collectionId, 'date', 50, true);
        console.log('✅ date');
        await wait(1500);

        // Category
        await databases.createEnumAttribute(
            CONFIG.DATABASE_ID,
            collectionId,
            'category',
            ['workshop', 'hackathon', 'seminar', 'team', 'project', 'inauguration', 'test', 'other'],
            true
        );
        console.log('✅ category');
        await wait(1500);

        // Cover Photo ID
        await databases.createStringAttribute(CONFIG.DATABASE_ID, collectionId, 'coverPhotoId', 255, false);
        console.log('✅ coverPhotoId');
        await wait(1500);

        // Photo IDs (array)
        await databases.createStringAttribute(CONFIG.DATABASE_ID, collectionId, 'photoIds', 255, false, undefined, true);
        console.log('✅ photoIds (array)');
        await wait(1500);

        // Event Link
        await databases.createStringAttribute(CONFIG.DATABASE_ID, collectionId, 'eventLink', 1000, false);
        console.log('✅ eventLink');
        await wait(1500);

        // Photographer Name
        await databases.createStringAttribute(CONFIG.DATABASE_ID, collectionId, 'photographerName', 255, false);
        console.log('✅ photographerName');
        await wait(1500);

        // Is Published
        await databases.createBooleanAttribute(CONFIG.DATABASE_ID, collectionId, 'isPublished', true, true);
        console.log('✅ isPublished');
        await wait(1500);

        // Order
        await databases.createIntegerAttribute(CONFIG.DATABASE_ID, collectionId, 'order', false, 0, 9999, 0);
        console.log('✅ order');

        console.log('\n⏳ Waiting for all attributes to be ready...');
        await wait(5000);

        // Create indexes
        console.log('\n🔍 Creating indexes...\n');

        try {
            await databases.createIndex(CONFIG.DATABASE_ID, collectionId, 'category_index', 'key', ['category'], ['ASC']);
            console.log('✅ category_index');
            await wait(1000);
        } catch (e) {
            console.log('⚠️  category_index may already exist');
        }

        try {
            await databases.createIndex(CONFIG.DATABASE_ID, collectionId, 'date_index', 'key', ['date'], ['DESC']);
            console.log('✅ date_index');
            await wait(1000);
        } catch (e) {
            console.log('⚠️  date_index may already exist');
        }

        try {
            await databases.createIndex(CONFIG.DATABASE_ID, collectionId, 'published_index', 'key', ['isPublished'], ['ASC']);
            console.log('✅ published_index');
        } catch (e) {
            console.log('⚠️  published_index may already exist');
        }

        console.log('\n✨ Gallery Albums collection created successfully!');
        console.log(`\nCollection ID: ${collectionId}`);
        console.log(`Database ID: ${CONFIG.DATABASE_ID}`);

    } catch (error) {
        if (error.code === 409) {
            console.log('\n⚠️  Collection already exists!');
            console.log('If you need to recreate it, delete it from Appwrite console first.');
        } else {
            console.error('\n❌ Error:', error.message);
            if (error.response) {
                console.error('Response:', error.response);
            }
        }
    }
}

createGalleryCollection().catch(console.error);
