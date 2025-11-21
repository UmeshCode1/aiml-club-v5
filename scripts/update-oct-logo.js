const { Client, Storage, ID } = require('node-appwrite');
const { InputFile } = require('node-appwrite/file');
const path = require('path');

// Configuration
const CONFIG = {
    ENDPOINT: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1',
    PROJECT_ID: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '691e2b31003e6415bb4f',
    API_KEY: process.env.APPWRITE_API_KEY,
    BUCKET_ID: '691f19dd000afea07882', // CLUB_DETAILS bucket
};

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(CONFIG.ENDPOINT)
    .setProject(CONFIG.PROJECT_ID)
    .setKey(CONFIG.API_KEY);

const storage = new Storage(client);

async function updateOCTLogo() {
    console.log('🔄 Updating OCT College Logo...\n');

    const logoPath = path.join(__dirname, '..', 'Images', 'Copy of Picsart_25-06-29_21-49-30-637[1].png');
    const fileId = 'college-logo';

    try {
        // Delete existing logo if it exists
        try {
            await storage.deleteFile(CONFIG.BUCKET_ID, fileId);
            console.log('✅ Deleted old logo');
        } catch (error) {
            if (error.code !== 404) {
                console.log('⚠️  Old logo not found, proceeding with upload');
            }
        }

        // Upload new logo
        console.log('📤 Uploading new OCT logo...');
        const file = await storage.createFile(
            CONFIG.BUCKET_ID,
            fileId,
            InputFile.fromPath(logoPath, 'oct-logo.png')
        );

        console.log('✅ Logo uploaded successfully!');
        console.log(`   File ID: ${file.$id}`);
        console.log(`   File Size: ${(file.sizeOriginal / 1024).toFixed(2)} KB`);

        // Generate URL
        const logoUrl = `${CONFIG.ENDPOINT}/storage/buckets/${CONFIG.BUCKET_ID}/files/${fileId}/view?project=${CONFIG.PROJECT_ID}`;

        console.log('\n📋 Logo URL:');
        console.log(logoUrl);
        console.log('\n✨ OCT logo updated successfully!');

    } catch (error) {
        console.error('❌ Error updating logo:', error.message);
        throw error;
    }
}

updateOCTLogo().catch(console.error);
