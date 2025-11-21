const { Client, Databases, Storage, ID, Query } = require('node-appwrite');
const { InputFile } = require('node-appwrite/file');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    ENDPOINT: 'https://fra.cloud.appwrite.io/v1',
    PROJECT_ID: '691e2b31003e6415bb4f',
    DATABASE_ID: '691e2d6e00131d7cccf1',
    COLLECTION_ID: 'auto_1763586573960_ec75mk', // Team Collection
    BUCKET_ID: 'team', // Team Files Bucket
    IMAGES_DIR: path.join(__dirname, '..', 'Team members'),
};

// Initialize Appwrite
const client = new Client()
    .setEndpoint(CONFIG.ENDPOINT)
    .setProject(CONFIG.PROJECT_ID);

if (!process.env.APPWRITE_API_KEY) {
    console.error('Error: APPWRITE_API_KEY environment variable is required.');
    console.error('Usage: set APPWRITE_API_KEY=your_api_key && node scripts/upload-team-images.js');
    process.exit(1);
}

client.setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

async function uploadImages() {
    try {
        console.log('Fetching team members...');
        const response = await databases.listDocuments(
            CONFIG.DATABASE_ID,
            CONFIG.COLLECTION_ID,
            [Query.limit(100)]
        );

        const members = response.documents;
        console.log(`Found ${members.length} members.`);

        const files = fs.readdirSync(CONFIG.IMAGES_DIR);
        console.log(`Found ${files.length} files in ${CONFIG.IMAGES_DIR}`);

        for (const member of members) {
            const photoId = member.photoId;
            if (!photoId) {
                console.log(`Skipping ${member.name}: No photoId set.`);
                continue;
            }

            // Try to find matching file
            let matchedFile = files.find(f => f === photoId); // Exact match

            if (!matchedFile) {
                // Try case-insensitive match
                matchedFile = files.find(f => f.toLowerCase() === photoId.toLowerCase());
            }

            if (!matchedFile) {
                // Try adding extensions
                const extensions = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'];
                for (const ext of extensions) {
                    const filename = `${photoId}${ext}`;
                    matchedFile = files.find(f => f.toLowerCase() === filename.toLowerCase());
                    if (matchedFile) break;
                }
            }

            if (matchedFile) {
                console.log(`Found image for ${member.name} (${photoId}): ${matchedFile}`);

                const filePath = path.join(CONFIG.IMAGES_DIR, matchedFile);

                try {
                    // Upload file
                    console.log(`Uploading ${matchedFile}...`);

                    const file = await storage.createFile(
                        CONFIG.BUCKET_ID,
                        ID.unique(),
                        InputFile.fromPath(filePath, matchedFile)
                    );

                    console.log(`Uploaded. File ID: ${file.$id}`);

                    // Update member document
                    await databases.updateDocument(
                        CONFIG.DATABASE_ID,
                        CONFIG.COLLECTION_ID,
                        member.$id,
                        {
                            photoId: file.$id
                        }
                    );
                    console.log(`Updated member ${member.name} with new photo ID.`);

                } catch (err) {
                    console.error(`Failed to upload/update for ${member.name}:`, err.message);
                }

            } else {
                console.warn(`No matching file found for ${member.name} (photoId: ${photoId})`);
            }
        }

        console.log('Done!');

    } catch (error) {
        console.error('Script failed:', error);
    }
}

uploadImages();
