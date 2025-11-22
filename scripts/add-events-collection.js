const fs = require('fs');
const path = require('path');
const { Client, Databases, ID } = require('node-appwrite');

// Load env
try {
    const envPath = path.resolve(__dirname, '../.env.local');
    if (fs.existsSync(envPath)) {
        require('dotenv').config({ path: envPath, override: true });
    }
} catch (e) {
    console.error('Error reading .env.local:', e);
}

// Configuration
const CONFIG = {
    ENDPOINT: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1',
    PROJECT_ID: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '691e2b31003e6415bb4f',
    API_KEY: process.env.APPWRITE_API_KEY,
    DATABASE_ID: '691e2d6e00131d7cccf1',
    COLLECTION_ID: process.env.NEXT_PUBLIC_COLLECTION_EVENTS, // EVENTS collection
};

console.log('Config Check:');
console.log('- API Key:', CONFIG.API_KEY ? 'Present' : 'Missing');

// Events Data
const EVENTS = [
    {
        title: 'Expert Talk by Coding Thinker',
        description: 'Expert session on modern coding practices and software development by industry professionals.',
        startDate: '2024-08-26T10:00:00.000Z',
        endDate: '2024-08-26T12:00:00.000Z',
        location: 'Auditorium',
        type: 'talk',
        status: 'completed',
        slug: 'expert-talk-coding-thinker-2024'
    },
    {
        title: 'DSPL Session',
        description: 'Interactive session on Data Structures and Programming Languages fundamentals.',
        startDate: '2024-09-10T14:00:00.000Z',
        endDate: '2024-09-10T16:00:00.000Z',
        location: 'Lab 1',
        type: 'session',
        status: 'completed',
        slug: 'dspl-session-september-2024'
    },
    {
        title: 'DSPL Workshop',
        description: 'Two-day intensive workshop on Data Structures and Programming Languages with hands-on practice.',
        startDate: '2024-09-11T09:00:00.000Z',
        endDate: '2024-09-12T17:00:00.000Z',
        location: 'Seminar Hall',
        type: 'workshop',
        status: 'completed',
        slug: 'dspl-workshop-september-2024'
    },
    {
        title: 'Aptify Test',
        description: 'Aptitude and technical skills assessment test for club members.',
        startDate: '2024-10-13T11:00:00.000Z',
        endDate: '2024-10-13T13:00:00.000Z',
        location: 'Online',
        type: 'test',
        status: 'completed',
        slug: 'aptify-test-october-2024'
    },
    {
        title: 'AI Workshop Series',
        description: 'Comprehensive workshop series covering AI fundamentals, machine learning basics, and practical applications.',
        startDate: '2024-11-05T10:00:00.000Z',
        endDate: '2024-11-05T16:00:00.000Z',
        location: 'Lab 2',
        type: 'workshop',
        status: 'completed',
        slug: 'ai-workshop-series-november-2024'
    },
    {
        title: 'Hackathon 2024',
        description: '24-hour coding marathon where students build innovative AI/ML solutions to real-world problems.',
        startDate: '2024-11-20T09:00:00.000Z',
        endDate: '2024-11-21T09:00:00.000Z',
        location: 'Main Campus',
        type: 'hackathon',
        status: 'completed',
        slug: 'hackathon-2024'
    },
    {
        title: 'Guest Lecture on Deep Learning',
        description: 'Special lecture by industry expert on deep learning architectures and neural networks.',
        startDate: '2024-12-01T11:00:00.000Z',
        endDate: '2024-12-01T13:00:00.000Z',
        location: 'Auditorium',
        type: 'guest_lecture',
        status: 'scheduled',
        slug: 'deep-learning-guest-lecture-december-2024'
    },
    {
        title: 'Project Showcase 2024',
        description: 'Annual project exhibition where club members present their AI/ML projects and innovations.',
        startDate: '2024-12-15T10:00:00.000Z',
        endDate: '2024-12-15T17:00:00.000Z',
        location: 'Exhibition Hall',
        type: 'event',
        status: 'scheduled',
        slug: 'project-showcase-2024'
    }
];

async function main() {
    if (!CONFIG.API_KEY) {
        console.error('❌ Error: APPWRITE_API_KEY is missing.');
        process.exit(1);
    }

    const client = new Client()
        .setEndpoint(CONFIG.ENDPOINT)
        .setProject(CONFIG.PROJECT_ID)
        .setKey(CONFIG.API_KEY);

    const databases = new Databases(client);

    console.log('\n🚀 Adding Events...');
    const results = [];

    for (const event of EVENTS) {
        try {
            console.log(`📝 Adding: ${event.title}`);

            // Check for duplicates
            const existing = await databases.listDocuments(
                CONFIG.DATABASE_ID,
                CONFIG.COLLECTION_ID
            );

            const isDuplicate = existing.documents.some(d => d.title === event.title);
            if (isDuplicate) {
                console.log('   ⚠️ Already exists, skipping.');
                results.push({ event: event.title, success: true, status: 'skipped' });
                continue;
            }

            const document = await databases.createDocument(
                CONFIG.DATABASE_ID,
                CONFIG.COLLECTION_ID,
                ID.unique(),
                event
            );
            console.log(`   ✅ Created: ${document.$id}`);
            results.push({ event: event.title, success: true, id: document.$id });
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
            results.push({ event: event.title, success: false, error: error.message });
        }
    }

    console.log('\n✨ Done!');
}

main().catch(console.error);
