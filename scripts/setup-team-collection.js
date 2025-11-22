const { Client, Databases, ID } = require('node-appwrite');

// Config
const CONFIG = {
    ENDPOINT: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1',
    PROJECT_ID: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
    API_KEY: process.env.APPWRITE_API_KEY,
    DATABASE_ID: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
    COLLECTION_ID: process.env.NEXT_PUBLIC_COLLECTION_TEAM,
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

async function setupTeam() {
    try {
        console.log('📋 Setting up Team collection...');

        let collectionId = CONFIG.COLLECTION_ID;

        if (!collectionId) {
            console.log('   ⚠️ NEXT_PUBLIC_COLLECTION_TEAM not found in env. Creating new collection...');
            const col = await databases.createCollection(CONFIG.DATABASE_ID, ID.unique(), 'Team');
            collectionId = col.$id;
            console.log(`   ✅ Created Team collection: ${collectionId}`);
            console.log(`   ⚠️ PLEASE ADD THIS TO .env.local: NEXT_PUBLIC_COLLECTION_TEAM=${collectionId}`);
        } else {
            console.log(`   Using existing collection: ${collectionId}`);
        }

        const attributes = [
            { key: 'name', type: 'string', size: 255, required: true },
            { key: 'role', type: 'string', size: 255, required: true },
            { key: 'category', type: 'string', size: 50, required: true }, // faculty, leadership, etc.
            { key: 'photoId', type: 'string', size: 255, required: false },
            { key: 'email', type: 'email', required: false },
            { key: 'phone', type: 'string', size: 20, required: false },
            { key: 'instagram', type: 'url', required: false },
            { key: 'linkedin', type: 'url', required: false },
            { key: 'github', type: 'url', required: false },
            { key: 'bio', type: 'string', size: 1000, required: false },
            { key: 'order', type: 'integer', required: false, default: 99 },
        ];

        for (const attr of attributes) {
            try {
                if (attr.type === 'string') {
                    await databases.createStringAttribute(CONFIG.DATABASE_ID, collectionId, attr.key, attr.size, attr.required);
                } else if (attr.type === 'email') {
                    await databases.createEmailAttribute(CONFIG.DATABASE_ID, collectionId, attr.key, attr.required);
                } else if (attr.type === 'url') {
                    await databases.createUrlAttribute(CONFIG.DATABASE_ID, collectionId, attr.key, attr.required);
                } else if (attr.type === 'integer') {
                    await databases.createIntegerAttribute(CONFIG.DATABASE_ID, collectionId, attr.key, attr.required, 0, 10000, attr.default);
                }
                console.log(`   ✅ Created attribute: ${attr.key}`);
                await new Promise(r => setTimeout(r, 500));
            } catch (error) {
                if (error.code === 409) {
                    console.log(`   ⚠️ Attribute ${attr.key} already exists.`);
                } else {
                    console.error(`   ❌ Error creating ${attr.key}:`, error.message);
                }
            }
        }

        console.log('✅ Team setup complete!');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

setupTeam();
