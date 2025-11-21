const { Client, Databases, ID } = require('node-appwrite');

// Configuration
const CONFIG = {
    ENDPOINT: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1',
    PROJECT_ID: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '691e2b31003e6415bb4f',
    API_KEY: process.env.APPWRITE_API_KEY,
    DATABASE_ID: '691e2d6e00131d7cccf1',
    COLLECTION_ID: 'auto_1763586571724_psmsmf', // HIGHLIGHTS collection
};

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(CONFIG.ENDPOINT)
    .setProject(CONFIG.PROJECT_ID)
    .setKey(CONFIG.API_KEY);

const databases = new Databases(client);

// Highlights to add (matching Highlight interface: title, slug, excerpt, content, author, date)
const HIGHLIGHTS = [
    {
        title: 'Expert Talk by Coding Thinker',
        slug: 'expert-talk-coding-thinker-2024',
        excerpt: 'Expert session on modern coding practices and software development by industry professionals.',
        content: 'Our club hosted an enlightening expert talk by Coding Thinker, focusing on modern coding practices, software development methodologies, and industry best practices. The session covered topics including clean code principles, design patterns, and career guidance for aspiring developers.',
        author: 'AIML Club',
        date: '2024-08-26'
    },
    {
        title: 'DSPL Session',
        slug: 'dspl-session-september-2024',
        excerpt: 'Interactive session on Data Structures and Programming Languages fundamentals.',
        content: 'An interactive session covering fundamental concepts of Data Structures and Programming Languages. Students learned about various data structures, their applications, and programming paradigms. The session included hands-on exercises and problem-solving activities.',
        author: 'AIML Club',
        date: '2024-09-10'
    },
    {
        title: 'DSPL Workshop',
        slug: 'dspl-workshop-september-2024',
        excerpt: 'Two-day intensive workshop on Data Structures and Programming Languages with hands-on practice.',
        content: 'A comprehensive two-day workshop diving deep into Data Structures and Programming Languages. Participants engaged in practical coding exercises, learned algorithm optimization techniques, and worked on real-world problem-solving scenarios. The workshop included group projects and peer learning sessions.',
        author: 'AIML Club',
        date: '2024-09-11'
    },
    {
        title: 'Aptify Test',
        slug: 'aptify-test-october-2024',
        excerpt: 'Aptitude and technical skills assessment test for club members.',
        content: 'The Aptify Test was conducted to assess the aptitude and technical skills of club members. The test covered logical reasoning, quantitative aptitude, programming fundamentals, and problem-solving abilities. Results helped in identifying areas for improvement and planning future learning sessions.',
        author: 'AIML Club',
        date: '2024-10-13'
    },
    {
        title: 'AI Workshop Series',
        slug: 'ai-workshop-series-november-2024',
        excerpt: 'Comprehensive workshop series covering AI fundamentals, machine learning basics, and practical applications.',
        content: 'Our AI Workshop Series provided students with a solid foundation in Artificial Intelligence and Machine Learning. The series covered topics including neural networks, supervised and unsupervised learning, model training, and real-world AI applications. Participants worked on hands-on projects using popular ML frameworks.',
        author: 'AIML Club',
        date: '2024-11-05'
    },
    {
        title: 'Hackathon 2024',
        slug: 'hackathon-2024',
        excerpt: '24-hour coding marathon where students build innovative AI/ML solutions to real-world problems.',
        content: 'Our annual Hackathon 2024 brought together talented students for an intense 24-hour coding marathon. Teams worked on innovative AI/ML solutions addressing real-world challenges in healthcare, education, and sustainability. The event featured mentorship sessions, tech talks, and exciting prizes for winning teams.',
        author: 'AIML Club',
        date: '2024-11-20'
    },
    {
        title: 'Guest Lecture on Deep Learning',
        slug: 'deep-learning-guest-lecture-december-2024',
        excerpt: 'Special lecture by industry expert on deep learning architectures and neural networks.',
        content: 'We hosted a distinguished industry expert for an in-depth lecture on Deep Learning. The session explored various neural network architectures, including CNNs, RNNs, and Transformers. Students learned about practical applications in computer vision, natural language processing, and gained insights into cutting-edge research.',
        author: 'AIML Club',
        date: '2024-12-01'
    },
    {
        title: 'Project Showcase 2024',
        slug: 'project-showcase-2024',
        excerpt: 'Annual project exhibition where club members present their AI/ML projects and innovations.',
        content: 'Our annual Project Showcase featured impressive AI/ML projects developed by club members throughout the year. Projects ranged from chatbots and recommendation systems to computer vision applications and predictive models. The event celebrated innovation, creativity, and technical excellence among our members.',
        author: 'AIML Club',
        date: '2024-12-15'
    }
];

async function addHighlights() {
    console.log('🚀 Adding Highlights to Collection...\n');
    console.log(`Database: ${CONFIG.DATABASE_ID}`);
    console.log(`Collection: ${CONFIG.COLLECTION_ID}\n`);

    const results = [];

    for (const highlight of HIGHLIGHTS) {
        try {
            console.log(`📝 Adding: ${highlight.title}`);

            const document = await databases.createDocument(
                CONFIG.DATABASE_ID,
                CONFIG.COLLECTION_ID,
                ID.unique(),
                highlight
            );

            console.log(`   ✅ Created with ID: ${document.$id}`);
            results.push({ highlight: highlight.title, success: true, id: document.$id });
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
            results.push({ highlight: highlight.title, success: false, error: error.message });
        }
    }

    console.log('\n✨ Highlight Addition Complete!\n');
    console.log('📊 Summary:');
    console.log('─'.repeat(60));

    results.forEach(result => {
        if (result.success) {
            console.log(`✅ ${result.highlight}`);
        } else {
            console.log(`❌ ${result.highlight}: ${result.error}`);
        }
    });

    console.log('─'.repeat(60));
    console.log(`\nTotal highlights added: ${results.filter(r => r.success).length}/${HIGHLIGHTS.length}`);
}

addHighlights().catch(console.error);
