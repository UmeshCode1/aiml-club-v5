const { Client, Databases, ID, Permission, Role, Storage } = require('node-appwrite');
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
    NEW_DATABASE_ID: '692136c3001bf41a6dfa', // The database we just created
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

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function setupCompleteDatabase() {
    console.log('🚀 Setting up complete database structure...\n');

    const collections = {};

    try {
        // Create all collections
        const collectionsToCreate = [
            { name: 'Events', key: 'EVENTS' },
            { name: 'Highlights', key: 'HIGHLIGHTS' },
            { name: 'Suggestions', key: 'SUGGESTIONS' },
            { name: 'Subscribers', key: 'SUBSCRIBERS' },
            { name: 'Notifications', key: 'NOTIFICATIONS' },
            { name: 'Messages', key: 'MESSAGES' },
        ];

        for (const coll of collectionsToCreate) {
            try {
                console.log(`📋 Creating ${coll.name} collection...`);
                const collection = await databases.createCollection(
                    CONFIG.NEW_DATABASE_ID,
                    ID.unique(),
                    coll.name,
                    [
                        Permission.read(Role.any()),
                        Permission.create(Role.users()),
                        Permission.update(Role.users()),
                        Permission.delete(Role.users()),
                    ],
                    true
                );
                collections[coll.key] = collection.$id;
                console.log(`✅ ${coll.name} created: ${collection.$id}\n`);
                await sleep(1000);
            } catch (error) {
                console.log(`⚠️  ${coll.name}: ${error.message}\n`);
            }
        }

        // Create Events attributes
        if (collections.EVENTS) {
            console.log('🔧 Creating Events attributes...');
            const eventsAttrs = [
                { key: 'title', type: 'string', size: 255, required: true },
                { key: 'description', type: 'string', size: 5000, required: true },
                { key: 'startDate', type: 'datetime', required: true },
                { key: 'endDate', type: 'datetime', required: false },
                { key: 'location', type: 'string', size: 500, required: true },
                { key: 'type', type: 'enum', elements: ['workshop', 'seminar', 'hackathon', 'talk', 'session'], required: true },
                { key: 'status', type: 'enum', elements: ['scheduled', 'ongoing', 'completed', 'cancelled'], required: true },
                { key: 'slug', type: 'string', size: 255, required: true },
                { key: 'posterUrl', type: 'url', required: false },
            ];

            for (const attr of eventsAttrs) {
                try {
                    if (attr.type === 'string') {
                        await databases.createStringAttribute(CONFIG.NEW_DATABASE_ID, collections.EVENTS, attr.key, attr.size, attr.required);
                    } else if (attr.type === 'datetime') {
                        await databases.createDatetimeAttribute(CONFIG.NEW_DATABASE_ID, collections.EVENTS, attr.key, attr.required);
                    } else if (attr.type === 'enum') {
                        await databases.createEnumAttribute(CONFIG.NEW_DATABASE_ID, collections.EVENTS, attr.key, attr.elements, attr.required);
                    } else if (attr.type === 'url') {
                        await databases.createUrlAttribute(CONFIG.NEW_DATABASE_ID, collections.EVENTS, attr.key, attr.required);
                    }
                    console.log(`   ✓ ${attr.key}`);
                    await sleep(1000);
                } catch (error) {
                    console.log(`   ⚠ ${attr.key}: ${error.message}`);
                }
            }
            console.log();
        }

        // Create Highlights attributes
        if (collections.HIGHLIGHTS) {
            console.log('🔧 Creating Highlights attributes...');
            const highlightsAttrs = [
                { key: 'title', type: 'string', size: 255, required: true },
                { key: 'content', type: 'string', size: 10000, required: true },
                { key: 'author', type: 'string', size: 255, required: true },
                { key: 'date', type: 'datetime', required: true },
                { key: 'imageUrl', type: 'url', required: false },
                { key: 'slug', type: 'string', size: 255, required: true },
            ];

            for (const attr of highlightsAttrs) {
                try {
                    if (attr.type === 'string') {
                        await databases.createStringAttribute(CONFIG.NEW_DATABASE_ID, collections.HIGHLIGHTS, attr.key, attr.size, attr.required);
                    } else if (attr.type === 'datetime') {
                        await databases.createDatetimeAttribute(CONFIG.NEW_DATABASE_ID, collections.HIGHLIGHTS, attr.key, attr.required);
                    } else if (attr.type === 'url') {
                        await databases.createUrlAttribute(CONFIG.NEW_DATABASE_ID, collections.HIGHLIGHTS, attr.key, attr.required);
                    }
                    console.log(`   ✓ ${attr.key}`);
                    await sleep(1000);
                } catch (error) {
                    console.log(`   ⚠ ${attr.key}: ${error.message}`);
                }
            }
            console.log();
        }

        // Create Suggestions attributes
        if (collections.SUGGESTIONS) {
            console.log('🔧 Creating Suggestions attributes...');
            const suggestionsAttrs = [
                { key: 'name', type: 'string', size: 255, required: true },
                { key: 'email', type: 'email', required: false },
                { key: 'suggestion', type: 'string', size: 5000, required: true },
                { key: 'status', type: 'enum', elements: ['pending', 'reviewed', 'implemented'], required: true },
            ];

            for (const attr of suggestionsAttrs) {
                try {
                    if (attr.type === 'string') {
                        await databases.createStringAttribute(CONFIG.NEW_DATABASE_ID, collections.SUGGESTIONS, attr.key, attr.size, attr.required);
                    } else if (attr.type === 'email') {
                        await databases.createEmailAttribute(CONFIG.NEW_DATABASE_ID, collections.SUGGESTIONS, attr.key, attr.required);
                    } else if (attr.type === 'enum') {
                        await databases.createEnumAttribute(CONFIG.NEW_DATABASE_ID, collections.SUGGESTIONS, attr.key, attr.elements, attr.required);
                    }
                    console.log(`   ✓ ${attr.key}`);
                    await sleep(1000);
                } catch (error) {
                    console.log(`   ⚠ ${attr.key}: ${error.message}`);
                }
            }
            console.log();
        }

        // Create Subscribers attributes
        if (collections.SUBSCRIBERS) {
            console.log('🔧 Creating Subscribers attributes...');
            const subscribersAttrs = [
                { key: 'email', type: 'email', required: true },
                { key: 'subscribedAt', type: 'datetime', required: true },
            ];

            for (const attr of subscribersAttrs) {
                try {
                    if (attr.type === 'email') {
                        await databases.createEmailAttribute(CONFIG.NEW_DATABASE_ID, collections.SUBSCRIBERS, attr.key, attr.required);
                    } else if (attr.type === 'datetime') {
                        await databases.createDatetimeAttribute(CONFIG.NEW_DATABASE_ID, collections.SUBSCRIBERS, attr.key, attr.required);
                    }
                    console.log(`   ✓ ${attr.key}`);
                    await sleep(1000);
                } catch (error) {
                    console.log(`   ⚠ ${attr.key}: ${error.message}`);
                }
            }
            console.log();
        }

        // Create Notifications attributes
        if (collections.NOTIFICATIONS) {
            console.log('🔧 Creating Notifications attributes...');
            const notificationsAttrs = [
                { key: 'title', type: 'string', size: 255, required: true },
                { key: 'message', type: 'string', size: 1000, required: true },
                { key: 'type', type: 'enum', elements: ['info', 'success', 'warning', 'error'], required: true },
                { key: 'read', type: 'boolean', required: true },
            ];

            for (const attr of notificationsAttrs) {
                try {
                    if (attr.type === 'string') {
                        await databases.createStringAttribute(CONFIG.NEW_DATABASE_ID, collections.NOTIFICATIONS, attr.key, attr.size, attr.required);
                    } else if (attr.type === 'enum') {
                        await databases.createEnumAttribute(CONFIG.NEW_DATABASE_ID, collections.NOTIFICATIONS, attr.key, attr.elements, attr.required);
                    } else if (attr.type === 'boolean') {
                        await databases.createBooleanAttribute(CONFIG.NEW_DATABASE_ID, collections.NOTIFICATIONS, attr.key, attr.required);
                    }
                    console.log(`   ✓ ${attr.key}`);
                    await sleep(1000);
                } catch (error) {
                    console.log(`   ⚠ ${attr.key}: ${error.message}`);
                }
            }
            console.log();
        }

        // Create Messages attributes
        if (collections.MESSAGES) {
            console.log('🔧 Creating Messages attributes...');
            const messagesAttrs = [
                { key: 'name', type: 'string', size: 255, required: true },
                { key: 'email', type: 'email', required: true },
                { key: 'subject', type: 'string', size: 500, required: true },
                { key: 'message', type: 'string', size: 5000, required: true },
                { key: 'status', type: 'enum', elements: ['unread', 'read', 'replied'], required: true },
            ];

            for (const attr of messagesAttrs) {
                try {
                    if (attr.type === 'string') {
                        await databases.createStringAttribute(CONFIG.NEW_DATABASE_ID, collections.MESSAGES, attr.key, attr.size, attr.required);
                    } else if (attr.type === 'email') {
                        await databases.createEmailAttribute(CONFIG.NEW_DATABASE_ID, collections.MESSAGES, attr.key, attr.required);
                    } else if (attr.type === 'enum') {
                        await databases.createEnumAttribute(CONFIG.NEW_DATABASE_ID, collections.MESSAGES, attr.key, attr.elements, attr.required);
                    }
                    console.log(`   ✓ ${attr.key}`);
                    await sleep(1000);
                } catch (error) {
                    console.log(`   ⚠ ${attr.key}: ${error.message}`);
                }
            }
            console.log();
        }

        console.log('\n✅ Database setup complete!\n');
        console.log('📝 Add these to your .env.local:\n');
        console.log(`NEXT_PUBLIC_APPWRITE_DATABASE_ID=692136c3001bf41a6dfa`);
        console.log(`NEXT_PUBLIC_COLLECTION_TEAM=692136c400350f96d61e`);
        if (collections.EVENTS) console.log(`NEXT_PUBLIC_COLLECTION_EVENTS=${collections.EVENTS}`);
        if (collections.HIGHLIGHTS) console.log(`NEXT_PUBLIC_COLLECTION_HIGHLIGHTS=${collections.HIGHLIGHTS}`);
        if (collections.SUGGESTIONS) console.log(`NEXT_PUBLIC_COLLECTION_SUGGESTIONS=${collections.SUGGESTIONS}`);
        if (collections.SUBSCRIBERS) console.log(`NEXT_PUBLIC_COLLECTION_SUBSCRIBERS=${collections.SUBSCRIBERS}`);
        if (collections.NOTIFICATIONS) console.log(`NEXT_PUBLIC_COLLECTION_NOTIFICATIONS=${collections.NOTIFICATIONS}`);
        if (collections.MESSAGES) console.log(`NEXT_PUBLIC_COLLECTION_MESSAGES=${collections.MESSAGES}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

setupCompleteDatabase();
