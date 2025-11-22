const { Client, Databases, ID } = require('node-appwrite');
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

if (!CONFIG.API_KEY) {
    console.error('❌ Error: APPWRITE_API_KEY is missing in .env.local');
    process.exit(1);
}

const client = new Client()
    .setEndpoint(CONFIG.ENDPOINT)
    .setProject(CONFIG.PROJECT_ID)
    .setKey(CONFIG.API_KEY);

const databases = new Databases(client);

// Team member data to create
const teamData = [
    { name: "Dr. Rajesh Kumar Nigam", role: "HOD AIML Department", category: "faculty", bio: "Head of Department AIML", instagram: "", linkedin: "", github: "", email: "", imageUrl: "", order: 1 },
    { name: "Shamaila Khan", role: "Coordinating Faculty", category: "faculty", bio: "Faculty Coordinator", instagram: "", linkedin: "", github: "", email: "", imageUrl: "", order: 2 },
    { name: "Vishal Kumar", role: "President", category: "leadership", bio: "", instagram: "", linkedin: "", github: "", email: "", imageUrl: "", order: 3 },
    { name: "Umesh Patel", role: "Vice President", category: "leadership", bio: "", instagram: "", linkedin: "", github: "", email: "", imageUrl: "", order: 4 },
    { name: "Kinshuk Verma", role: "Tech Lead", category: "tech", bio: "", instagram: "", linkedin: "", github: "", email: "", imageUrl: "", order: 5 },
    { name: "Arnav Singh", role: "Developer", category: "tech", bio: "", instagram: "", linkedin: "", github: "", email: "arnavsingh67@gmail.com", imageUrl: "", order: 6 },
    { name: "Nimisha Kumari", role: "Developer", category: "tech", bio: "", instagram: "", linkedin: "", github: "", email: "nimishakum511@gmail.com", imageUrl: "", order: 7 },
    { name: "Jitesh Verma", role: "Developer", category: "tech", bio: "", instagram: "", linkedin: "", github: "", email: "jiteshverma139@gmail.com", imageUrl: "", order: 8 },
    { name: "Himanshu Singh", role: "Developer", category: "tech", bio: "", instagram: "", linkedin: "", github: "", email: "singhhimanshu9893@gmail.com", imageUrl: "", order: 9 },
    { name: "Aarchi Sharma", role: "Event Head", category: "event_heads", bio: "", instagram: "", linkedin: "", github: "", email: "", imageUrl: "", order: 10 },
    { name: "Parul Ajit", role: "Event Head", category: "event_heads", bio: "", instagram: "", linkedin: "", github: "", email: "", imageUrl: "", order: 11 },
    { name: "Gourav Jain", role: "Event Head", category: "event_heads", bio: "", instagram: "", linkedin: "", github: "", email: "", imageUrl: "", order: 12 },
    { name: "Tanu Jadon", role: "Event Coordinator", category: "event_heads", bio: "", instagram: "", linkedin: "", github: "", email: "tanu05624@gmail.com", imageUrl: "", order: 13 },
    { name: "Sarvesh Sejwar", role: "Event Coordinator", category: "event_heads", bio: "", instagram: "", linkedin: "", github: "", email: "aimlsarveshsejwar01@gmail.com", imageUrl: "", order: 14 },
    { name: "Nasir Khan", role: "Event Coordinator", category: "event_heads", bio: "", instagram: "", linkedin: "", github: "", email: "mdnasir078667@gmail.com", imageUrl: "", order: 15 },
    { name: "Anjali Sonare", role: "Event Coordinator", category: "event_heads", bio: "", instagram: "", linkedin: "", github: "", email: "anjalisonare780@gmail.com", imageUrl: "", order: 16 },
    { name: "Aanya Tomar", role: "Event Coordinator", category: "event_heads", bio: "", instagram: "", linkedin: "", github: "", email: "", imageUrl: "", order: 17 },
    { name: "Bhavesh Singh", role: "Event Coordinator", category: "event_heads", bio: "", instagram: "", linkedin: "", github: "", email: "", imageUrl: "", order: 18 },
    { name: "Prakhar Sahu", role: "Media Relations Head", category: "media", bio: "", instagram: "", linkedin: "", github: "", email: "prakharsahu150@gmail.com", imageUrl: "", order: 19 },
    { name: "Khushi Kumari", role: "Media Head", category: "media", bio: "", instagram: "", linkedin: "", github: "", email: "", imageUrl: "", order: 20 },
    { name: "Arpit Mistrel", role: "Media Team", category: "media", bio: "", instagram: "", linkedin: "", github: "", email: "", imageUrl: "", order: 21 },
    { name: "Aashu Kumar", role: "Media Associate", category: "media", bio: "", instagram: "", linkedin: "", github: "", email: "kaviraj07310731@gmail.com", imageUrl: "", order: 22 },
    { name: "Daksh Sahni", role: "Editor / Media", category: "editors", bio: "", instagram: "", linkedin: "", github: "", email: "dakshsahni2006@gmail.com", imageUrl: "", order: 23 },
    { name: "Hana Nafees Abbasi", role: "Editor / Media", category: "editors", bio: "", instagram: "", linkedin: "", github: "", email: "abbasihana16@gmail.com", imageUrl: "", order: 24 },
    { name: "Abhijeet Sarkar", role: "Editor Head", category: "editors", bio: "", instagram: "", linkedin: "", github: "", email: "", imageUrl: "", order: 25 },
    { name: "Pritish Mandal", role: "Editor", category: "editors", bio: "", instagram: "", linkedin: "", github: "", email: "", imageUrl: "", order: 26 },
    { name: "Prince Kumar", role: "Discipline Head", category: "discipline", bio: "", instagram: "", linkedin: "", github: "", email: "", imageUrl: "", order: 27 },
    { name: "Heer", role: "Stage Lead Head", category: "stage", bio: "", instagram: "", linkedin: "", github: "", email: "", imageUrl: "", order: 28 },
    { name: "Anshul Sharma", role: "Stage Lead Head", category: "stage", bio: "", instagram: "", linkedin: "", github: "", email: "", imageUrl: "", order: 29 },
    { name: "Avni Rawat", role: "Anchor/Host", category: "stage", bio: "", instagram: "", linkedin: "", github: "", email: "avnir361@gmail.com", imageUrl: "", order: 30 },
    { name: "Ankit Sharma", role: "Anchor/Host", category: "stage", bio: "", instagram: "", linkedin: "", github: "", email: "ankitsharma60784@gmail.com", imageUrl: "", order: 31 },
    { name: "Anushka Malviya", role: "Anchor/Host", category: "stage", bio: "", instagram: "", linkedin: "", github: "", email: "anushkamalviya93@gmail.com", imageUrl: "", order: 32 },
    { name: "Apurvi Agarwal", role: "Anchor/Host", category: "stage", bio: "", instagram: "", linkedin: "", github: "", email: "", imageUrl: "", order: 33 },
    { name: "Shambhavi", role: "Anchor/Host", category: "stage", bio: "", instagram: "", linkedin: "", github: "", email: "", imageUrl: "", order: 34 }
];

async function createTeamMembers() {
    console.log('🚀 Creating team members...\n');

    let created = 0;
    let errors = 0;

    for (const member of teamData) {
        try {
            // Prepare document data
            const docData = {
                name: member.name,
                role: member.role,
                category: member.category,
                order: member.order
            };

            // Only add optional fields if they have values
            if (member.bio) docData.bio = member.bio;
            if (member.instagram) docData.instagram = member.instagram;
            if (member.linkedin) docData.linkedin = member.linkedin;
            if (member.github) docData.github = member.github;
            if (member.email) docData.email = member.email;
            if (member.imageUrl) docData.imageUrl = member.imageUrl;

            // Create the member
            await databases.createDocument(
                CONFIG.DATABASE_ID,
                CONFIG.TEAM_COLLECTION_ID,
                ID.unique(),
                docData
            );

            console.log(`✅ Created: ${member.name} → ${member.role} (${member.category})`);
            created++;

            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 200));

        } catch (error) {
            console.log(`❌ Error creating ${member.name}: ${error.message}`);
            errors++;
        }
    }

    console.log('\n📊 Summary:');
    console.log(`✅ Created: ${created}`);
    console.log(`❌ Errors: ${errors}`);
    console.log(`📝 Total processed: ${teamData.length}`);
}

createTeamMembers();
