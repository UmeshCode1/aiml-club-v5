const { Client, Databases } = require('node-appwrite');

const CONFIG = {
    ENDPOINT: 'https://fra.cloud.appwrite.io/v1',
    PROJECT_ID: '691e2b31003e6415bb4f',
    DATABASE_ID: '691e2d6e00131d7cccf1',
};

const client = new Client()
    .setEndpoint(CONFIG.ENDPOINT)
    .setProject(CONFIG.PROJECT_ID);

if (!process.env.APPWRITE_API_KEY) {
    console.error('Error: APPWRITE_API_KEY environment variable is required.');
    process.exit(1);
}

client.setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

async function listCollections() {
    try {
        console.log(`Listing collections for Database: ${CONFIG.DATABASE_ID}`);
        const response = await databases.listCollections(CONFIG.DATABASE_ID);

        console.log(`Found ${response.total} collections:`);
        response.collections.forEach(col => {
            console.log(`- Name: ${col.name}, ID: ${col.$id}`);
        });

    } catch (error) {
        console.error('Error listing collections:', error);
    }
}

listCollections();
