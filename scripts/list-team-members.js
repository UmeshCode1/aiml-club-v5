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
    TEAM_COLLECTION_ID: '6921f644000a5ca88bd6'
};

const client = new Client()
    .setEndpoint(CONFIG.ENDPOINT)
    .setProject(CONFIG.PROJECT_ID)
    .setKey(CONFIG.API_KEY);

const databases = new Databases(client);

async function listTeamMembers() {
    try {
        const response = await databases.listDocuments(
            CONFIG.DATABASE_ID,
            CONFIG.TEAM_COLLECTION_ID
        );

        console.log(`📋 Found ${response.documents.length} team members in database:\n`);

        if (response.documents.length === 0) {
            console.log('⚠️  Database is empty. You may need to create members first.');
        } else {
            response.documents.forEach((member, index) => {
                console.log(`${index + 1}. Name: "${member.name}"`);
                console.log(`   Role: ${member.role || 'N/A'}`);
                console.log(`   Category: ${member.category || 'N/A'}`);
                console.log(`   ID: ${member.$id}\n`);
            });
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

listTeamMembers();
