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
    OLD_DATABASE_ID: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '691e2d6e00131d7cccf1',
    OLD_TEAM_COLLECTION_ID: process.env.NEXT_PUBLIC_COLLECTION_TEAM,
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

async function createNewDatabase() {
    console.log('🚀 Starting database migration...\n');

    try {
        // Step 1: Create new database
        console.log('📦 Creating new database...');
        const newDatabase = await databases.create(
            ID.unique(),
            'AIML Club Database',
            true // enabled
        );
        console.log(`✅ Database created: ${newDatabase.name}`);
        console.log(`   ID: ${newDatabase.$id}\n`);

        // Step 2: Create Team collection in new database
        console.log('📋 Creating Team collection...');
        const teamCollection = await databases.createCollection(
            newDatabase.$id,
            ID.unique(),
            'Team',
            [
                Permission.read(Role.any()),
                Permission.create(Role.users()),
                Permission.update(Role.users()),
                Permission.delete(Role.users()),
            ],
            true // enabled
        );
        console.log(`✅ Team collection created`);
        console.log(`   ID: ${teamCollection.$id}\n`);

        // Step 3: Create attributes for Team collection
        console.log('🔧 Creating attributes...');

        const attributes = [
            { key: 'name', type: 'string', size: 255, required: true },
            { key: 'role', type: 'string', size: 255, required: true },
            { key: 'category', type: 'string', size: 100, required: true },
            { key: 'bio', type: 'string', size: 1000, required: false },
            { key: 'photoId', type: 'string', size: 255, required: false },
            { key: 'email', type: 'email', required: false },
            { key: 'instagram', type: 'string', size: 255, required: false },
            { key: 'linkedin', type: 'url', required: false },
            { key: 'github', type: 'url', required: false },
            { key: 'order', type: 'integer', required: true, min: 0, max: 9999 },
        ];

        for (const attr of attributes) {
            try {
                if (attr.type === 'string') {
                    await databases.createStringAttribute(
                        newDatabase.$id,
                        teamCollection.$id,
                        attr.key,
                        attr.size,
                        attr.required
                    );
                } else if (attr.type === 'integer') {
                    await databases.createIntegerAttribute(
                        newDatabase.$id,
                        teamCollection.$id,
                        attr.key,
                        attr.required,
                        attr.min,
                        attr.max
                    );
                } else if (attr.type === 'email') {
                    await databases.createEmailAttribute(
                        newDatabase.$id,
                        teamCollection.$id,
                        attr.key,
                        attr.required
                    );
                } else if (attr.type === 'url') {
                    await databases.createUrlAttribute(
                        newDatabase.$id,
                        teamCollection.$id,
                        attr.key,
                        attr.required
                    );
                }
                console.log(`   ✓ ${attr.key} (${attr.type})`);
                // Wait a bit between attribute creation
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.log(`   ⚠ ${attr.key}: ${error.message}`);
            }
        }

        console.log('\n⏳ Waiting for attributes to be ready...');
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Step 4: Fetch all team members from old database
        console.log('\n📥 Fetching team members from old database...');
        let allMembers = [];
        let offset = 0;
        const limit = 100;

        while (true) {
            const response = await databases.listDocuments(
                CONFIG.OLD_DATABASE_ID,
                CONFIG.OLD_TEAM_COLLECTION_ID,
                [],
                limit,
                offset
            );

            allMembers = allMembers.concat(response.documents);

            if (response.documents.length < limit) {
                break;
            }
            offset += limit;
        }

        console.log(`✅ Found ${allMembers.length} team members\n`);

        // Step 5: Copy team members to new database
        console.log('📤 Copying team members to new database...');
        let successCount = 0;
        let errorCount = 0;

        for (const member of allMembers) {
            try {
                const newMember = {
                    name: member.name,
                    role: member.role,
                    category: member.category,
                    order: member.order || 0,
                };

                // Add optional fields if they exist
                if (member.bio) newMember.bio = member.bio;
                if (member.photoId) newMember.photoId = member.photoId;
                if (member.email) newMember.email = member.email;
                if (member.instagram) newMember.instagram = member.instagram;
                if (member.linkedin) newMember.linkedin = member.linkedin;
                if (member.github) newMember.github = member.github;

                await databases.createDocument(
                    newDatabase.$id,
                    teamCollection.$id,
                    ID.unique(),
                    newMember
                );

                successCount++;
                console.log(`   ✓ ${member.name} - ${member.role}`);
            } catch (error) {
                errorCount++;
                console.log(`   ✗ ${member.name}: ${error.message}`);
            }
        }

        console.log(`\n✅ Migration complete!`);
        console.log(`   Successfully copied: ${successCount} members`);
        console.log(`   Errors: ${errorCount} members`);

        // Step 6: Display new IDs for .env.local
        console.log('\n📝 Update your .env.local with these values:');
        console.log(`NEXT_PUBLIC_APPWRITE_DATABASE_ID=${newDatabase.$id}`);
        console.log(`NEXT_PUBLIC_COLLECTION_TEAM=${teamCollection.$id}`);

        console.log('\n⚠️  IMPORTANT: After updating .env.local, restart your dev server!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Response:', error.response);
        }
    }
}

createNewDatabase();
