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
};

if (!CONFIG.API_KEY) {
    console.error('❌ Error: APPWRITE_API_KEY is missing in .env.local');
    console.error('Please add your API Key to .env.local and try again.');
    process.exit(1);
}

const client = new Client()
    .setEndpoint(CONFIG.ENDPOINT)
    .setProject(CONFIG.PROJECT_ID)
    .setKey(CONFIG.API_KEY);

const databases = new Databases(client);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function restoreDatabase() {
    console.log('🚀 Starting Database Restoration...\n');

    try {
        // 1. Create New Database
        console.log('📦 Creating new database...');
        const db = await databases.create(ID.unique(), 'AIML Club DB');
        const DATABASE_ID = db.$id;
        console.log(`✅ Database created: ${DATABASE_ID} ("${db.name}")\n`);

        const collections = {};

        // 2. Define Collections & Attributes
        const schema = [
            {
                name: 'Events',
                key: 'EVENTS',
                attributes: [
                    { key: 'title', type: 'string', size: 255, required: true },
                    { key: 'description', type: 'string', size: 5000, required: true },
                    { key: 'startDate', type: 'datetime', required: true },
                    { key: 'endDate', type: 'datetime', required: false },
                    { key: 'location', type: 'string', size: 500, required: true },
                    { key: 'type', type: 'enum', elements: ['workshop', 'seminar', 'hackathon', 'talk', 'session'], required: true },
                    { key: 'status', type: 'enum', elements: ['scheduled', 'ongoing', 'completed', 'cancelled'], required: true },
                    { key: 'slug', type: 'string', size: 255, required: true },
                    { key: 'posterUrl', type: 'url', required: false },
                ]
            },
            {
                name: 'Team',
                key: 'TEAM',
                attributes: [
                    { key: 'name', type: 'string', size: 255, required: true },
                    { key: 'role', type: 'string', size: 255, required: true },
                    { key: 'category', type: 'string', size: 50, required: true },
                    { key: 'photoId', type: 'string', size: 255, required: false },
                    { key: 'email', type: 'email', required: false },
                    { key: 'phone', type: 'string', size: 20, required: false },
                    { key: 'instagram', type: 'url', required: false },
                    { key: 'linkedin', type: 'url', required: false },
                    { key: 'github', type: 'url', required: false },
                    { key: 'bio', type: 'string', size: 1000, required: false },
                    { key: 'order', type: 'integer', required: false, default: 99 },
                ]
            },
            {
                name: 'Gallery Albums',
                key: 'GALLERY', // Mapping to GALLERY/ALBUMS
                attributes: [
                    { key: 'name', type: 'string', size: 255, required: true },
                    { key: 'description', type: 'string', size: 5000, required: false },
                    { key: 'date', type: 'string', size: 50, required: true },
                    { key: 'category', type: 'enum', elements: ['workshop', 'hackathon', 'seminar', 'team', 'project', 'inauguration', 'test', 'other'], required: true },
                    { key: 'coverPhotoId', type: 'string', size: 255, required: false },
                    { key: 'photoIds', type: 'string', size: 255, required: false, array: true },
                    { key: 'eventLink', type: 'string', size: 1000, required: false },
                    { key: 'photographerName', type: 'string', size: 255, required: false },
                    { key: 'isPublished', type: 'boolean', required: true, default: true },
                    { key: 'order', type: 'integer', required: false, default: 0 },
                ]
            },
            {
                name: 'Highlights',
                key: 'HIGHLIGHTS',
                attributes: [
                    { key: 'title', type: 'string', size: 255, required: true },
                    { key: 'content', type: 'string', size: 10000, required: true },
                    { key: 'author', type: 'string', size: 255, required: true },
                    { key: 'date', type: 'datetime', required: true },
                    { key: 'imageUrl', type: 'url', required: false },
                    { key: 'slug', type: 'string', size: 255, required: true },
                ]
            },
            {
                name: 'Suggestions',
                key: 'SUGGESTIONS',
                attributes: [
                    { key: 'name', type: 'string', size: 255, required: true },
                    { key: 'email', type: 'email', required: false },
                    { key: 'suggestion', type: 'string', size: 5000, required: true },
                    { key: 'status', type: 'enum', elements: ['pending', 'reviewed', 'implemented'], required: true },
                ]
            },
            {
                name: 'Subscribers',
                key: 'SUBSCRIBERS',
                attributes: [
                    { key: 'email', type: 'email', required: true },
                    { key: 'subscribedAt', type: 'datetime', required: true },
                ]
            },
            {
                name: 'Notifications',
                key: 'NOTIFICATIONS',
                attributes: [
                    { key: 'title', type: 'string', size: 255, required: true },
                    { key: 'message', type: 'string', size: 1000, required: true },
                    { key: 'type', type: 'enum', elements: ['info', 'success', 'warning', 'error'], required: true },
                    { key: 'read', type: 'boolean', required: true },
                ]
            },
            {
                name: 'Messages',
                key: 'MESSAGES',
                attributes: [
                    { key: 'name', type: 'string', size: 255, required: true },
                    { key: 'email', type: 'email', required: true },
                    { key: 'subject', type: 'string', size: 500, required: true },
                    { key: 'message', type: 'string', size: 5000, required: true },
                    { key: 'status', type: 'enum', elements: ['unread', 'read', 'replied'], required: true },
                ]
            }
        ];

        // 3. Create Collections and Attributes
        for (const item of schema) {
            console.log(`📋 Creating Collection: ${item.name}...`);
            const col = await databases.createCollection(
                DATABASE_ID,
                ID.unique(),
                item.name,
                [
                    Permission.read(Role.any()),
                    Permission.create(Role.users()),
                    Permission.update(Role.users()),
                    Permission.delete(Role.users()),
                ],
                true
            );
            collections[item.key] = col.$id;
            console.log(`   ✅ Created (${col.$id})`);

            // Create Attributes
            console.log(`   🔧 Creating attributes...`);
            for (const attr of item.attributes) {
                try {
                    if (attr.type === 'string') {
                        await databases.createStringAttribute(DATABASE_ID, col.$id, attr.key, attr.size, attr.required, attr.default, attr.array);
                    } else if (attr.type === 'integer') {
                        await databases.createIntegerAttribute(DATABASE_ID, col.$id, attr.key, attr.required, 0, 100000, attr.default);
                    } else if (attr.type === 'boolean') {
                        await databases.createBooleanAttribute(DATABASE_ID, col.$id, attr.key, attr.required, attr.default);
                    } else if (attr.type === 'email') {
                        await databases.createEmailAttribute(DATABASE_ID, col.$id, attr.key, attr.required);
                    } else if (attr.type === 'url') {
                        await databases.createUrlAttribute(DATABASE_ID, col.$id, attr.key, attr.required);
                    } else if (attr.type === 'datetime') {
                        await databases.createDatetimeAttribute(DATABASE_ID, col.$id, attr.key, attr.required);
                    } else if (attr.type === 'enum') {
                        await databases.createEnumAttribute(DATABASE_ID, col.$id, attr.key, attr.elements, attr.required);
                    }
                    process.stdout.write('.');
                    await sleep(200); // Small delay to prevent rate limits
                } catch (err) {
                    console.log(`\n   ⚠️ Error creating ${attr.key}: ${err.message}`);
                }
            }
            console.log('\n');
            await sleep(1000);
        }

        console.log('🎉 Database Restoration Complete!');
        console.log('\n👇 UPDATE YOUR .env.local WITH THESE VALUES:\n');
        console.log('------------------------------------------------');
        console.log(`NEXT_PUBLIC_APPWRITE_DATABASE_ID=${DATABASE_ID}`);
        Object.entries(collections).forEach(([key, value]) => {
            console.log(`NEXT_PUBLIC_COLLECTION_${key}=${value}`);
        });
        // Print aliases for Gallery/Albums as they might be used interchangeably
        if (collections.GALLERY) {
            console.log(`NEXT_PUBLIC_COLLECTION_ALBUMS=${collections.GALLERY}`);
        }
        if (collections.TEAM) {
            console.log(`NEXT_PUBLIC_COLLECTION_MEMBERS=${collections.TEAM}`);
        }
        console.log('------------------------------------------------');

    } catch (error) {
        console.error('❌ Fatal Error:', error);
    }
}

restoreDatabase();
