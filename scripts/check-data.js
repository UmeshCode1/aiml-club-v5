const { Client, Databases } = require('node-appwrite');

const CONFIG = {
    ENDPOINT: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1',
    PROJECT_ID: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '691e2b31003e6415bb4f',
    DATABASE_ID: '691e2d6e00131d7cccf1',
    HIGHLIGHTS_ID: 'auto_1763586571724_psmsmf',
    EVENTS_ID: 'auto_1763586568976_qt1sfp',
};

const client = new Client()
    .setEndpoint(CONFIG.ENDPOINT)
    .setProject(CONFIG.PROJECT_ID);

const databases = new Databases(client);

async function checkData() {
    console.log('Checking Data Visibility (Guest Role)...');

    try {
        console.log('\n--- Highlights ---');
        const highlights = await databases.listDocuments(
            CONFIG.DATABASE_ID,
            CONFIG.HIGHLIGHTS_ID
        );
        console.log(`Total: ${highlights.total}`);
        highlights.documents.forEach(d => console.log(`- ${d.title} (${d.$id})`));
    } catch (e) {
        console.log('Error fetching highlights:', e.message);
    }

    try {
        console.log('\n--- Events ---');
        const events = await databases.listDocuments(
            CONFIG.DATABASE_ID,
            CONFIG.EVENTS_ID
        );
        console.log(`Total: ${events.total}`);
        events.documents.forEach(d => console.log(`- ${d.title} (${d.$id})`));
    } catch (e) {
        console.log('Error fetching events:', e.message);
    }
}

checkData();
