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
    PROJECT_ID: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
    API_KEY: process.env.APPWRITE_API_KEY,
    DATABASE_ID: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
    COLLECTION_ID: '6921533d001a20677a26', // The one created
};

const client = new Client()
    .setEndpoint(CONFIG.ENDPOINT)
    .setProject(CONFIG.PROJECT_ID)
    .setKey(CONFIG.API_KEY);

const databases = new Databases(client);

async function fixAttributes() {
    console.log('🔧 Fixing Album attributes...');

    const attributes = [
        { key: 'title', type: 'string', size: 255, required: true },
        { key: 'date', type: 'datetime', required: true },
        { key: 'cover_image_url', type: 'url', required: true },
        { key: 'photo_count', type: 'integer', required: false, default: 0 },
        { key: 'link', type: 'url', required: false },
    ];

    for (const attr of attributes) {
        try {
            if (attr.type === 'string') {
                await databases.createStringAttribute(CONFIG.DATABASE_ID, CONFIG.COLLECTION_ID, attr.key, attr.size, attr.required);
            } else if (attr.type === 'datetime') {
                await databases.createDatetimeAttribute(CONFIG.DATABASE_ID, CONFIG.COLLECTION_ID, attr.key, attr.required);
            } else if (attr.type === 'url') {
                await databases.createUrlAttribute(CONFIG.DATABASE_ID, CONFIG.COLLECTION_ID, attr.key, attr.required);
            } else if (attr.type === 'integer') {
                await databases.createIntegerAttribute(CONFIG.DATABASE_ID, CONFIG.COLLECTION_ID, attr.key, attr.required, 0, 1000000, attr.default);
            }
            console.log(`   ✅ Created attribute: ${attr.key}`);
            // Wait a bit to avoid rate limits
            await new Promise(r => setTimeout(r, 500));
        } catch (error) {
            if (error.code === 409) {
                console.log(`   ⚠️ Attribute ${attr.key} already exists.`);
            } else {
                console.error(`   ❌ Error creating ${attr.key}:`, error.message);
            }
        }
    }
    console.log('Done.');
}

fixAttributes();
