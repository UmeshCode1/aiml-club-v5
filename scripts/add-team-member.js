const { Client, Databases, ID } = require('node-appwrite');
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
    COLLECTION_ID: process.env.NEXT_PUBLIC_COLLECTION_TEAM,
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

async function addTeamMember() {
    console.log('🚀 Adding Anshul Sharma to the team...');

    const member = {
        name: 'Anshul Sharma',
        role: 'Stage Lead Head',
        category: 'stage',
        github: 'https://github.com/anshul025',
        linkedin: 'https://www.linkedin.com/in/anshul-sharma00725',
        instagram: 'anshhul_sharm_a',
        order: 100,
    };

    try {
        const response = await databases.createDocument(
            CONFIG.DATABASE_ID,
            CONFIG.COLLECTION_ID,
            ID.unique(),
            member
        );

        console.log('✅ Team member added successfully!');
        console.log('   ID:', response.$id);
        console.log('   Name:', response.name);
        console.log('   Role:', response.role);
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

addTeamMember();
