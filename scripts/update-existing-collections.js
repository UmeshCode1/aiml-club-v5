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
    DATABASE_ID: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
    COLLECTIONS: {
        EVENTS: process.env.NEXT_PUBLIC_COLLECTION_EVENTS,
        GALLERY: process.env.NEXT_PUBLIC_COLLECTION_GALLERY,
        HIGHLIGHTS: process.env.NEXT_PUBLIC_COLLECTION_HIGHLIGHTS,
        NOTIFICATIONS: process.env.NEXT_PUBLIC_COLLECTION_NOTIFICATIONS,
    }
};

if (!CONFIG.API_KEY) {
    console.error('❌ Error: APPWRITE_API_KEY is missing in .env.local');
    process.exit(1);
}

const client = new Client()
    .setEndpoint(CONFIG.ENDPOINT)
    .setProject(CONFIG.PROJECT_ID)
    .setKey(CONFIG.API_KEY);

const databases = new Databases(client);
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function updateCollections() {
    console.log('🚀 Updating Existing Collections with New Attributes...\n');

    try {
        // 1. Update Events Collection
        if (CONFIG.COLLECTIONS.EVENTS) {
            console.log('📋 Updating Events Collection...');
            const eventsAttrs = [
                { key: 'resourceLink', type: 'url', required: false },
                { key: 'driveMemoriesLink', type: 'url', required: false },
                { key: 'certificateDriveLink', type: 'url', required: false },
            ];

            for (const attr of eventsAttrs) {
                try {
                    await databases.createUrlAttribute(
                        CONFIG.DATABASE_ID,
                        CONFIG.COLLECTIONS.EVENTS,
                        attr.key,
                        attr.required
                    );
                    console.log(`   ✅ Added: ${attr.key}`);
                    await sleep(1000);
                } catch (error) {
                    if (error.code === 409) {
                        console.log(`   ⚠️  ${attr.key} already exists`);
                    } else {
                        console.log(`   ❌ Error adding ${attr.key}: ${error.message}`);
                    }
                }
            }
            console.log();
        }

        // 2. Update Gallery Collection
        if (CONFIG.COLLECTIONS.GALLERY) {
            console.log('📋 Updating Gallery Albums Collection...');
            try {
                await databases.createUrlAttribute(
                    CONFIG.DATABASE_ID,
                    CONFIG.COLLECTIONS.GALLERY,
                    'googleDriveLink',
                    false
                );
                console.log('   ✅ Added: googleDriveLink');
                await sleep(1000);
            } catch (error) {
                if (error.code === 409) {
                    console.log('   ⚠️  googleDriveLink already exists');
                } else {
                    console.log(`   ❌ Error: ${error.message}`);
                }
            }
            console.log();
        }

        // 3. Update Highlights Collection
        if (CONFIG.COLLECTIONS.HIGHLIGHTS) {
            console.log('📋 Updating Highlights Collection...');
            const highlightsAttrs = [
                { key: 'resourceLink', type: 'url', required: false },
                { key: 'pdfId', type: 'string', size: 255, required: false },
                { key: 'siteId', type: 'string', size: 255, required: false },
            ];

            for (const attr of highlightsAttrs) {
                try {
                    if (attr.type === 'url') {
                        await databases.createUrlAttribute(
                            CONFIG.DATABASE_ID,
                            CONFIG.COLLECTIONS.HIGHLIGHTS,
                            attr.key,
                            attr.required
                        );
                    } else if (attr.type === 'string') {
                        await databases.createStringAttribute(
                            CONFIG.DATABASE_ID,
                            CONFIG.COLLECTIONS.HIGHLIGHTS,
                            attr.key,
                            attr.size,
                            attr.required
                        );
                    }
                    console.log(`   ✅ Added: ${attr.key}`);
                    await sleep(1000);
                } catch (error) {
                    if (error.code === 409) {
                        console.log(`   ⚠️  ${attr.key} already exists`);
                    } else {
                        console.log(`   ❌ Error adding ${attr.key}: ${error.message}`);
                    }
                }
            }
            console.log();
        }

        // 4. Update Notifications Collection
        if (CONFIG.COLLECTIONS.NOTIFICATIONS) {
            console.log('📋 Updating Notifications Collection...');
            const notificationsAttrs = [
                { key: 'eventLink', type: 'url', required: false },
                { key: 'formLink', type: 'url', required: false },
                { key: 'blogLink', type: 'url', required: false },
            ];

            for (const attr of notificationsAttrs) {
                try {
                    await databases.createUrlAttribute(
                        CONFIG.DATABASE_ID,
                        CONFIG.COLLECTIONS.NOTIFICATIONS,
                        attr.key,
                        attr.required
                    );
                    console.log(`   ✅ Added: ${attr.key}`);
                    await sleep(1000);
                } catch (error) {
                    if (error.code === 409) {
                        console.log(`   ⚠️  ${attr.key} already exists`);
                    } else {
                        console.log(`   ❌ Error adding ${attr.key}: ${error.message}`);
                    }
                }
            }
            console.log();
        }

        console.log('🎉 All collections updated successfully!');

    } catch (error) {
        console.error('❌ Fatal Error:', error.message);
    }
}

updateCollections();
