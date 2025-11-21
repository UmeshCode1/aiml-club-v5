const { Client, Storage, Databases, ID } = require('node-appwrite');
const { InputFile } = require('node-appwrite/file');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    ENDPOINT: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1',
    PROJECT_ID: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '691e2b31003e6415bb4f',
    API_KEY: process.env.APPWRITE_API_KEY,
    DATABASE_ID: '691e2d6e00131d7cccf1',
    COLLECTION_ID: 'gallery_albums',
    BUCKET_ID: 'gallery', // Gallery bucket
};

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(CONFIG.ENDPOINT)
    .setProject(CONFIG.PROJECT_ID)
    .setKey(CONFIG.API_KEY);

const storage = new Storage(client);
const databases = new Databases(client);

// Album definitions
const ALBUMS = [
    {
        name: 'Club Inauguration',
        description: 'Official inauguration ceremony of the AI & Machine Learning Club',
        date: '2024-08-15',
        category: 'inauguration',
        folder: path.join(__dirname, '..', 'Images', 'inauguration'),
        eventLink: '',
        photographerName: 'AIML Club Team'
    },
    {
        name: 'Expert Talk by Coding Thinker',
        description: 'Expert session on modern coding practices and software development',
        date: '2024-08-26',
        category: 'seminar',
        folder: path.join(__dirname, '..', 'Images', 'Expert Talk by Coding Thinker'),
        eventLink: 'ORIENTAL COLLEGE OF TECHNOLOGY (1).pdf',
        photographerName: 'AIML Club Team'
    },
    {
        name: 'DSPL Session',
        description: 'Data Structures and Programming Languages interactive session',
        date: '2024-09-10',
        category: 'seminar',
        folder: path.join(__dirname, '..', 'Images', 'DSPL Session'),
        eventLink: 'https://drive.google.com/file/d/1xv3a9iCzqhP2mRNXrXFPtc2MdO4triam/view?usp=sharing',
        photographerName: 'AIML Club Team'
    },
    {
        name: 'Aptify Test',
        description: 'Aptitude and technical skills assessment test for club members',
        date: '2024-10-13',
        category: 'test',
        folder: path.join(__dirname, '..', 'Images', 'Apfity Test'),
        eventLink: 'https://drive.google.com/file/d/1yEwEA1owqbw1So4HH01FjJaeSejo5XMo/view?usp=drive_link',
        photographerName: 'AIML Club Team'
    }
];

async function uploadImage(filePath, albumName, index) {
    try {
        const fileName = path.basename(filePath);
        const fileId = `${albumName.toLowerCase().replace(/\s+/g, '-')}-${index}`;

        const file = await storage.createFile(
            CONFIG.BUCKET_ID,
            fileId,
            InputFile.fromPath(filePath, fileName)
        );

        return file.$id;
    } catch (error) {
        if (error.code === 409) {
            // File already exists, return the ID
            return `${albumName.toLowerCase().replace(/\s+/g, '-')}-${index}`;
        }
        throw error;
    }
}

async function uploadAlbumImages(album) {
    console.log(`\n📸 Processing: ${album.name}`);
    console.log(`   Folder: ${album.folder}`);

    if (!fs.existsSync(album.folder)) {
        console.log(`   ⚠️  Folder not found, skipping...`);
        return { photoIds: [], coverPhotoId: null };
    }

    const files = fs.readdirSync(album.folder)
        .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
        .sort();

    if (files.length === 0) {
        console.log(`   ⚠️  No images found in folder`);
        return { photoIds: [], coverPhotoId: null };
    }

    console.log(`   Found ${files.length} images`);

    const photoIds = [];

    for (let i = 0; i < files.length; i++) {
        const filePath = path.join(album.folder, files[i]);
        try {
            const fileId = await uploadImage(filePath, album.name, i);
            photoIds.push(fileId);
            console.log(`   ✅ ${i + 1}/${files.length}: ${files[i]}`);
        } catch (error) {
            console.log(`   ❌ ${i + 1}/${files.length}: ${files[i]} - ${error.message}`);
        }
    }

    const coverPhotoId = photoIds.length > 0 ? photoIds[0] : null;

    return { photoIds, coverPhotoId };
}

async function createAlbumDocument(album, photoIds, coverPhotoId) {
    try {
        const document = await databases.createDocument(
            CONFIG.DATABASE_ID,
            CONFIG.COLLECTION_ID,
            ID.unique(),
            {
                name: album.name,
                description: album.description,
                date: album.date,
                category: album.category,
                photoIds: photoIds,
                coverPhotoId: coverPhotoId,
                eventLink: album.eventLink,
                photographerName: album.photographerName,
                isPublished: true,
                order: 0
            }
        );

        console.log(`   ✅ Album document created: ${document.$id}`);
        return document;
    } catch (error) {
        console.log(`   ❌ Error creating document: ${error.message}`);
        throw error;
    }
}

async function uploadAllAlbums() {
    console.log('🚀 Starting Gallery Upload Process...\n');
    console.log(`Database: ${CONFIG.DATABASE_ID}`);
    console.log(`Collection: ${CONFIG.COLLECTION_ID}`);
    console.log(`Bucket: ${CONFIG.BUCKET_ID}`);

    const results = [];

    for (const album of ALBUMS) {
        try {
            const { photoIds, coverPhotoId } = await uploadAlbumImages(album);

            if (photoIds.length > 0) {
                const document = await createAlbumDocument(album, photoIds, coverPhotoId);
                results.push({
                    album: album.name,
                    photos: photoIds.length,
                    success: true,
                    documentId: document.$id
                });
            } else {
                console.log(`   ⚠️  Skipping album creation (no photos)`);
                results.push({
                    album: album.name,
                    photos: 0,
                    success: false,
                    reason: 'No photos found'
                });
            }
        } catch (error) {
            console.log(`   ❌ Error processing album: ${error.message}`);
            results.push({
                album: album.name,
                success: false,
                error: error.message
            });
        }
    }

    console.log('\n\n✨ Upload Complete!\n');
    console.log('📊 Summary:');
    console.log('─'.repeat(60));

    results.forEach(result => {
        if (result.success) {
            console.log(`✅ ${result.album}: ${result.photos} photos uploaded`);
        } else {
            console.log(`❌ ${result.album}: ${result.reason || result.error}`);
        }
    });

    console.log('─'.repeat(60));
    console.log(`\nTotal albums created: ${results.filter(r => r.success).length}/${ALBUMS.length}`);
}

uploadAllAlbums().catch(console.error);
