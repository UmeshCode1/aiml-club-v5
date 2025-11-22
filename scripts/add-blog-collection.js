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
    DATABASE_ID: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
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

async function createBlogCollection() {
    console.log('🚀 Creating Blog Collection...\n');

    try {
        // Create Blog Collection
        console.log('📋 Creating Blog collection...');
        const collection = await databases.createCollection(
            CONFIG.DATABASE_ID,
            ID.unique(),
            'Blog',
            [
                Permission.read(Role.any()),
                Permission.create(Role.users()),
                Permission.update(Role.users()),
                Permission.delete(Role.users()),
            ],
            true
        );

        const collectionId = collection.$id;
        console.log(`✅ Blog collection created: ${collectionId}\n`);

        // Create Attributes
        console.log('🔧 Creating attributes...');

        const attributes = [
            { key: 'title', type: 'string', size: 255, required: true },
            { key: 'slug', type: 'string', size: 255, required: true },
            { key: 'content', type: 'string', size: 50000, required: true },
            { key: 'excerpt', type: 'string', size: 500, required: false },
            { key: 'author', type: 'string', size: 255, required: true },
            { key: 'authorId', type: 'string', size: 255, required: false },
            { key: 'coverImageId', type: 'string', size: 255, required: false },
            { key: 'category', type: 'enum', elements: ['technical', 'event', 'tutorial', 'announcement', 'other'], required: true },
            { key: 'tags', type: 'string', size: 100, required: false, array: true },
            { key: 'publishedAt', type: 'datetime', required: true },
            { key: 'status', type: 'enum', elements: ['draft', 'published', 'archived'], required: true },
            { key: 'views', type: 'integer', required: false, default: 0 },
            { key: 'featured', type: 'boolean', required: false, default: false },
        ];

        for (const attr of attributes) {
            try {
                if (attr.type === 'string') {
                    await databases.createStringAttribute(
                        CONFIG.DATABASE_ID,
                        collectionId,
                        attr.key,
                        attr.size,
                        attr.required,
                        attr.default,
                        attr.array
                    );
                } else if (attr.type === 'integer') {
                    await databases.createIntegerAttribute(
                        CONFIG.DATABASE_ID,
                        collectionId,
                        attr.key,
                        attr.required,
                        0,
                        1000000,
                        attr.default
                    );
                } else if (attr.type === 'boolean') {
                    await databases.createBooleanAttribute(
                        CONFIG.DATABASE_ID,
                        collectionId,
                        attr.key,
                        attr.required,
                        attr.default
                    );
                } else if (attr.type === 'datetime') {
                    await databases.createDatetimeAttribute(
                        CONFIG.DATABASE_ID,
                        collectionId,
                        attr.key,
                        attr.required
                    );
                } else if (attr.type === 'enum') {
                    await databases.createEnumAttribute(
                        CONFIG.DATABASE_ID,
                        collectionId,
                        attr.key,
                        attr.elements,
                        attr.required
                    );
                }
                process.stdout.write('.');
                await sleep(1000);
            } catch (error) {
                console.log(`\n   ❌ Error creating ${attr.key}: ${error.message}`);
            }
        }

        console.log('\n\n🎉 Blog Collection Created Successfully!');
        console.log('\n👇 ADD THIS TO YOUR .env.local:\n');
        console.log('------------------------------------------------');
        console.log(`NEXT_PUBLIC_COLLECTION_BLOG=${collectionId}`);
        console.log('------------------------------------------------\n');

    } catch (error) {
        if (error.code === 409) {
            console.error('❌ Blog collection already exists!');
        } else {
            console.error('❌ Fatal Error:', error.message);
        }
    }
}

createBlogCollection();
