const { Client, Databases, Query } = require('node-appwrite');
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

// Team member data to update
const teamData = [
    { name: "Dr. Rajesh Kumar Nigam", role: "HOD AIML Department", category: "faculty", bio: "Head of Department AIML", instagram: "", linkedin: "", github: "", email: "" },
    { name: "Shamaila Khan", role: "Coordinating Faculty", category: "faculty", bio: "Faculty Coordinator", instagram: "", linkedin: "", github: "", email: "" },
    { name: "Vishal Kumar", role: "President", category: "leadership", bio: "", instagram: "", linkedin: "", github: "", email: "" },
    { name: "Umesh Patel", role: "Vice President", category: "leadership", bio: "", instagram: "", linkedin: "", github: "", email: "" },
    { name: "Kinshuk Verma", role: "Tech Lead", category: "tech", bio: "", instagram: "", linkedin: "", github: "", email: "" },
    { name: "Arnav Singh", role: "Developer", category: "tech", bio: "", instagram: "", linkedin: "", github: "", email: "arnavsingh67@gmail.com" },
    { name: "Nimisha Kumari", role: "Developer", category: "tech", bio: "", instagram: "", linkedin: "", github: "", email: "nimishakum511@gmail.com" },
    { name: "Jitesh Verma", role: "Developer", category: "tech", bio: "", instagram: "", linkedin: "", github: "", email: "jiteshverma139@gmail.com" },
    { name: "Himanshu Singh", role: "Developer", category: "tech", bio: "", instagram: "", linkedin: "", github: "", email: "singhhimanshu9893@gmail.com" },
    { name: "Aarchi Sharma", role: "Event Head", category: "event_heads", bio: "", instagram: "", linkedin: "", github: "", email: "" },
    { name: "Parul Ajit", role: "Event Head", category: "event_heads", bio: "", instagram: "", linkedin: "", github: "", email: "" },
    { name: "Gourav Jain", role: "Event Head", category: "event_heads", bio: "", instagram: "", linkedin: "", github: "", email: "" },
    { name: "Tanu Jadon", role: "Event Coordinator", category: "event_heads", bio: "", instagram: "", linkedin: "", github: "", email: "tanu05624@gmail.com" },
    { name: "Sarvesh Sejwar", role: "Event Coordinator", category: "event_heads", bio: "", instagram: "", linkedin: "", github: "", email: "aimlsarveshsejwar01@gmail.com" },
    { name: "Nasir Khan", role: "Event Coordinator", category: "event_heads", bio: "", instagram: "", linkedin: "", github: "", email: "mdnasir078667@gmail.com" },
    { name: "Anjali Sonare", role: "Event Coordinator", category: "event_heads", bio: "", instagram: "", linkedin: "", github: "", email: "anjalisonare780@gmail.com" },
    { name: "Aanya Tomar", role: "Event Coordinator", category: "event_heads", bio: "", instagram: "", linkedin: "", github: "", email: "" },
    { name: "Bhavesh Singh", role: "Event Coordinator", category: "event_heads", bio: "", instagram: "", linkedin: "", github: "", email: "" },
    { name: "Prakhar Sahu", role: "Media Relations Head", category: "media", bio: "", instagram: "", linkedin: "", github: "", email: "prakharsahu150@gmail.com" },
    { name: "Khushi Kumari", role: "Media Head", category: "media", bio: "", instagram: "", linkedin: "", github: "", email: "" },
    { name: "Arpit Mistrel", role: "Media Team", category: "media", bio: "", instagram: "", linkedin: "", github: "", email: "" },
    { name: "Aashu Kumar", role: "Media Associate", category: "media", bio: "", instagram: "", linkedin: "", github: "", email: "kaviraj07310731@gmail.com" },
    { name: "Daksh Sahni", role: "Editor / Media", category: "editors", bio: "", instagram: "", linkedin: "", github: "", email: "dakshsahni2006@gmail.com" },
    { name: "Hana Nafees Abbasi", role: "Editor / Media", category: "editors", bio: "", instagram: "", linkedin: "", github: "", email: "abbasihana16@gmail.com" },
    { name: "Abhijeet Sarkar", role: "Editor Head", category: "editors", bio: "", instagram: "", linkedin: "", github: "", email: "" },
    { name: "Pritish Mandal", role: "Editor", category: "editors", bio: "", instagram: "", linkedin: "", github: "", email: "" },
    { name: "Prince Kumar", role: "Discipline Head", category: "discipline", bio: "", instagram: "", linkedin: "", github: "", email: "" },
    { name: "Heer", role: "Stage Lead Head", category: "stage", bio: "", instagram: "", linkedin: "", github: "", email: "" },
    { name: "Anshul Sharma", role: "Stage Lead Head", category: "stage", bio: "", instagram: "", linkedin: "", github: "", email: "" },
    { name: "Avni Rawat", role: "Anchor/Host", category: "stage", bio: "", instagram: "", linkedin: "", github: "", email: "avnir361@gmail.com" },
    { name: "Ankit Sharma", role: "Anchor/Host", category: "stage", bio: "", instagram: "", linkedin: "", github: "", email: "ankitsharma60784@gmail.com" },
    { name: "Anushka Malviya", role: "Anchor/Host", category: "stage", bio: "", instagram: "", linkedin: "", github: "", email: "anushkamalviya93@gmail.com" },
    { name: "Apurvi Agarwal", role: "Anchor/Host", category: "stage", bio: "", instagram: "", linkedin: "", github: "", email: "" },
    { name: "Shambhavi", role: "Anchor/Host", category: "stage", bio: "", instagram: "", linkedin: "", github: "", email: "" }
];

async function bulkUpdateTeamMembers() {
    console.log('🚀 Starting bulk update of team members...\n');

    let updated = 0;
    let notFound = 0;
    let errors = 0;

    for (const member of teamData) {
        try {
            // Search for member by name
            const response = await databases.listDocuments(
                CONFIG.DATABASE_ID,
                CONFIG.TEAM_COLLECTION_ID,
                [Query.equal('name', member.name)]
            );

            if (response.documents.length === 0) {
                console.log(`⚠️  Not found: ${member.name}`);
                notFound++;
                continue;
            }

            if (response.documents.length > 1) {
                console.log(`⚠️  Multiple matches for: ${member.name} (updating first match)`);
            }

            const existingMember = response.documents[0];

            // Prepare update data (only include non-empty fields)
            const updateData = {
                role: member.role,
                category: member.category
            };

            // Only add optional fields if they have values
            if (member.bio) updateData.bio = member.bio;
            if (member.instagram) updateData.instagram = member.instagram;
            if (member.linkedin) updateData.linkedin = member.linkedin;
            if (member.github) updateData.github = member.github;
            if (member.email) updateData.email = member.email;

            // Update the member
            await databases.updateDocument(
                CONFIG.DATABASE_ID,
                CONFIG.TEAM_COLLECTION_ID,
                existingMember.$id,
                updateData
            );

            console.log(`✅ Updated: ${member.name} → ${member.role} (${member.category})`);
            updated++;

            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 200));

        } catch (error) {
            console.log(`❌ Error updating ${member.name}: ${error.message}`);
            errors++;
        }
    }

    console.log('\n📊 Summary:');
    console.log(`✅ Updated: ${updated}`);
    console.log(`⚠️  Not found: ${notFound}`);
    console.log(`❌ Errors: ${errors}`);
    console.log(`📝 Total processed: ${teamData.length}`);
}

bulkUpdateTeamMembers();
