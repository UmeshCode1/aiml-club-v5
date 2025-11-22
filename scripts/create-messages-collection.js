const { Client, Databases, ID, Permission, Role } = require('node-appwrite');
const fs = require('fs');
const path = require('path');

// Load env
try {
    const envPath = path.resolve(__dirname, '../.env.local');
    if (fs.existsSync(envPath)) {
        require('dotenv').config({ path: envPath });
    }
} catch (e) {
    console.error('Error reading .env.local:', e);
}

const CONFIG = {
    ENDPOINT: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1',
    PROJECT_ID: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '691e2b31003e6415bb4f',
    API_KEY: process.env.APPWRITE_API_KEY,
    DATABASE_ID: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '691e2d6e00131d7cccf1',
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

async function createMessagesCollection() {
    console.log('🚀 Creating Messages Collection...');

    try {
        // 1. Create Collection
        const collection = await databases.createCollection(
            CONFIG.DATABASE_ID,
            ID.unique(),
            'Messages',
            [
                Permission.create(Role.any()),
                Permission.read(Role.any()),
                Permission.update(Role.any()),
                Permission.delete(Role.any()),
            ]
        );
        console.log(`✅ Collection Created: ${collection.$id}`);

        const colId = collection.$id;

        // 2. Create Attributes
        console.log('   Creating attributes...');
        await databases.createStringAttribute(CONFIG.DATABASE_ID, colId, 'name', 100, true);
        await databases.createStringAttribute(CONFIG.DATABASE_ID, colId, 'email', 100, true);
        await databases.createStringAttribute(CONFIG.DATABASE_ID, colId, 'subject', 200, true);
        await databases.createStringAttribute(CONFIG.DATABASE_ID, colId, 'message', 5000, true);
        // Fix: required=false because we have a default value
        await databases.createEnumAttribute(CONFIG.DATABASE_ID, colId, 'status', ['unread', 'read', 'replied'], false, 'unread');

        console.log('   Attributes created.');

        // 3. Update .env.local
        console.log('   Updating .env.local...');
        const envPath = path.resolve(__dirname, '../.env.local');
        let envContent = fs.readFileSync(envPath, 'utf8');

        // Remove existing TBD or old value if present
        const regex = /^NEXT_PUBLIC_COLLECTION_MESSAGES=.*$/m;
        if (regex.test(envContent)) {
            envContent = envContent.replace(regex, `NEXT_PUBLIC_COLLECTION_MESSAGES=${colId}`);
        } else {
            envContent += `\nNEXT_PUBLIC_COLLECTION_MESSAGES=${colId}`;
        }

        fs.writeFileSync(envPath, envContent);
        console.log('✅ .env.local updated with NEXT_PUBLIC_COLLECTION_MESSAGES');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

createMessagesCollection();
