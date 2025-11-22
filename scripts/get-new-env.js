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
    DATABASE_ID: '6921f63d00163d9ef5da', // The new DB ID
};

const client = new Client()
    .setEndpoint(CONFIG.ENDPOINT)
    .setProject(CONFIG.PROJECT_ID)
    .setKey(CONFIG.API_KEY);

const databases = new Databases(client);

async function getEnv() {
    try {
        console.log('Fetching collections...');
        const collections = await databases.listCollections(CONFIG.DATABASE_ID);

        let output = '------------------------------------------------\n';
        output += `NEXT_PUBLIC_APPWRITE_DATABASE_ID=${CONFIG.DATABASE_ID}\n`;

        const map = {
            'Events': 'EVENTS',
            'Team': 'TEAM',
            'Gallery Albums': 'GALLERY',
            'Highlights': 'HIGHLIGHTS',
            'Suggestions': 'SUGGESTIONS',
            'Subscribers': 'SUBSCRIBERS',
            'Notifications': 'NOTIFICATIONS',
            'Messages': 'MESSAGES'
        };

        collections.collections.forEach(col => {
            const key = map[col.name];
            if (key) {
                output += `NEXT_PUBLIC_COLLECTION_${key}=${col.$id}\n`;
            }
        });

        // Aliases
        const galleryId = collections.collections.find(c => c.name === 'Gallery Albums')?.$id;
        if (galleryId) output += `NEXT_PUBLIC_COLLECTION_ALBUMS=${galleryId}\n`;

        const teamId = collections.collections.find(c => c.name === 'Team')?.$id;
        if (teamId) output += `NEXT_PUBLIC_COLLECTION_MEMBERS=${teamId}\n`;

        output += '------------------------------------------------\n';

        fs.writeFileSync(path.resolve(__dirname, '../new-env.txt'), output);
        console.log('✅ Environment variables written to new-env.txt');

    } catch (error) {
        console.error('Error:', error.message);
    }
}

getEnv();
