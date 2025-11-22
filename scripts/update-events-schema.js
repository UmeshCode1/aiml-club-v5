const { Client, Databases } = require('node-appwrite');

// Config
const CONFIG = {
    ENDPOINT: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1',
    PROJECT_ID: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
    API_KEY: process.env.APPWRITE_API_KEY, // Must be an API key with Database modify permissions
    DATABASE_ID: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
    COLLECTION_ID: process.env.NEXT_PUBLIC_COLLECTION_EVENTS,
};

if (!CONFIG.API_KEY) {
    console.error('❌ Error: APPWRITE_API_KEY environment variable is required.');
    process.exit(1);
}

const client = new Client()
    .setEndpoint(CONFIG.ENDPOINT)
    .setProject(CONFIG.PROJECT_ID)
    .setKey(CONFIG.API_KEY);

const databases = new Databases(client);

async function updateSchema() {
    try {
        console.log('📋 Updating Events collection schema...');

        // Create drive_link attribute
        try {
            await databases.createUrlAttribute(
                CONFIG.DATABASE_ID,
                CONFIG.COLLECTION_ID,
                'drive_link',
                false // not required
            );
            console.log('   ✅ Created attribute: drive_link');
        } catch (error) {
            if (error.code === 409) {
                console.log('   ⚠️ Attribute drive_link already exists.');
            } else {
                throw error;
            }
        }

        console.log('✅ Schema update complete!');
    } catch (error) {
        console.error('❌ Error updating schema:', error.message);
    }
}

updateSchema();
