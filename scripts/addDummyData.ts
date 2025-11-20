// Script to add dummy data to all collections
import 'dotenv/config';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '691e2b31003e6415bb4f';
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '691e2d6e00131d7cccf1';
const apiKey = process.env.APPWRITE_API_KEY || '';

const eventsCollectionId = 'auto_1763586568976_qt1sfp';
const highlightsCollectionId = 'auto_1763586571724_psmsmf';

async function api(method: string, path: string, body?: any) {
  const res = await fetch(`${endpoint}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': project,
      'X-Appwrite-Key': apiKey,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error: ${res.status} ${text}`);
  }
  
  return res.json();
}

// Dummy Events Data
const dummyEvents = [
  {
    title: "Introduction to Machine Learning Workshop",
    description: "Learn the fundamentals of Machine Learning with hands-on Python exercises. Topics include supervised learning, unsupervised learning, and neural networks basics.",
    startDate: new Date('2024-12-15T14:00:00').toISOString(),
    endDate: new Date('2024-12-15T17:00:00').toISOString(),
    location: "Computer Lab 3, OCT Campus",
    type: "workshop",
    status: "scheduled",
    slug: "intro-to-ml-workshop-dec-2024"
  },
  {
    title: "AI in Healthcare: Guest Lecture",
    description: "Join us for an insightful session with Dr. Amit Sharma on how AI is revolutionizing healthcare. Topics include medical imaging, diagnosis prediction, and drug discovery.",
    startDate: new Date('2024-12-20T15:00:00').toISOString(),
    endDate: new Date('2024-12-20T16:30:00').toISOString(),
    location: "Auditorium, Main Building",
    type: "guest_lecture",
    status: "scheduled",
    slug: "ai-healthcare-guest-lecture"
  },
  {
    title: "Deep Learning Hackathon 2024",
    description: "24-hour hackathon focused on computer vision and NLP projects. Build innovative solutions using TensorFlow, PyTorch, and pre-trained models. Prizes worth ₹50,000!",
    startDate: new Date('2025-01-10T09:00:00').toISOString(),
    endDate: new Date('2025-01-11T09:00:00').toISOString(),
    location: "Innovation Center, OCT",
    type: "hackathon",
    status: "scheduled",
    slug: "deep-learning-hackathon-2024"
  },
  {
    title: "Python for Data Science Bootcamp",
    description: "Intensive 3-day bootcamp covering NumPy, Pandas, Matplotlib, and Scikit-learn. Perfect for beginners looking to start their data science journey.",
    startDate: new Date('2025-01-15T10:00:00').toISOString(),
    endDate: new Date('2025-01-17T17:00:00').toISOString(),
    location: "Computer Lab 1 & 2",
    type: "workshop",
    status: "scheduled",
    slug: "python-data-science-bootcamp"
  },
  {
    title: "AI Club Orientation 2024",
    description: "Welcome session for new members! Learn about our club activities, ongoing projects, and how to get involved. Meet the team and fellow AI enthusiasts.",
    startDate: new Date('2024-08-15T14:00:00').toISOString(),
    endDate: new Date('2024-08-15T16:00:00').toISOString(),
    location: "Seminar Hall 1",
    type: "orientation",
    status: "completed",
    slug: "aiml-orientation-2024"
  },
  {
    title: "Neural Networks from Scratch",
    description: "Build your own neural network without using frameworks! Understand backpropagation, activation functions, and optimization algorithms at a fundamental level.",
    startDate: new Date('2024-09-20T14:00:00').toISOString(),
    endDate: new Date('2024-09-20T17:00:00').toISOString(),
    location: "Computer Lab 3",
    type: "workshop",
    status: "completed",
    slug: "neural-networks-from-scratch"
  },
  {
    title: "Industry Talk: Career in AI/ML",
    description: "Senior ML Engineers from top tech companies share their journey and insights into building a successful career in AI/ML. Q&A session included.",
    startDate: new Date('2024-10-05T15:00:00').toISOString(),
    endDate: new Date('2024-10-05T17:00:00').toISOString(),
    location: "Auditorium",
    type: "talk",
    status: "completed",
    slug: "career-in-aiml-industry-talk"
  },
  {
    title: "Computer Vision Workshop",
    description: "Hands-on workshop on image classification, object detection, and facial recognition using OpenCV and YOLO. Bring your laptops!",
    startDate: new Date('2024-10-25T14:00:00').toISOString(),
    endDate: new Date('2024-10-25T18:00:00').toISOString(),
    location: "Computer Lab 1 & 2",
    type: "workshop",
    status: "completed",
    slug: "computer-vision-workshop"
  }
];

// Dummy Highlights Data
const dummyHighlights = [
  {
    title: "AIML Club Wins National Hackathon",
    slug: "national-hackathon-win-2024",
    excerpt: "Our team secured first place at the National AI Hackathon 2024, competing against 150+ teams from across India. The winning project focused on predictive healthcare analytics.",
    content: `We are thrilled to announce that Team AIML OCT has won the prestigious National AI Hackathon 2024! 

Our project, "HealthPredict AI", uses machine learning to predict disease outbreaks based on environmental and demographic data. The solution achieved 94% accuracy and impressed judges with its real-world applicability.

Team Members:
- Rajesh Kumar (Team Lead)
- Priya Sharma
- Amit Verma
- Sneha Patel

The team will receive a cash prize of ₹1,00,000 and mentorship from industry experts. This win is a testament to the hard work and dedication of our members!`,
    author: "Dr. Rajesh Kumar Nigam",
    date: new Date('2024-11-01T10:00:00').toISOString()
  },
  {
    title: "New AI Lab Inaugurated",
    slug: "new-ai-lab-inauguration",
    excerpt: "OCT inaugurated a state-of-the-art AI & ML laboratory equipped with high-performance GPUs, latest software tools, and collaborative workspaces for our club members.",
    content: `The AI & Machine Learning Club at OCT is proud to announce the inauguration of our new dedicated AI Lab!

The lab features:
- 20 workstations with NVIDIA RTX 4090 GPUs
- High-speed internet and cloud computing access
- Collaborative project spaces
- Latest AI/ML software and frameworks
- 24/7 access for club members

This facility will enable us to work on more complex projects, conduct advanced research, and provide better hands-on learning experiences for our members.

Special thanks to the college administration and our faculty coordinators for making this possible!`,
    author: "Shamaila Khan",
    date: new Date('2024-10-15T09:00:00').toISOString()
  },
  {
    title: "Workshop Series on Deep Learning Concludes Successfully",
    slug: "deep-learning-workshop-series-success",
    excerpt: "Our 4-week intensive deep learning workshop series concluded with 80+ participants gaining hands-on experience in neural networks, CNNs, RNNs, and transformers.",
    content: `The AIML Club's Deep Learning Workshop Series has successfully concluded!

Over 4 weeks, participants learned:
- Week 1: Neural Network Fundamentals
- Week 2: Convolutional Neural Networks (CNNs)
- Week 3: Recurrent Neural Networks (RNNs) and LSTMs
- Week 4: Transformers and Attention Mechanisms

Key Highlights:
- 80+ active participants
- 15+ hands-on projects completed
- Guest lectures from industry experts
- Certificate of completion awarded

Participant feedback has been overwhelmingly positive, with many expressing interest in advanced topics. Stay tuned for our next series!`,
    author: "Aryan Raj",
    date: new Date('2024-09-30T14:00:00').toISOString()
  },
  {
    title: "Member Spotlight: Research Paper Publication",
    slug: "member-research-paper-publication",
    excerpt: "Club member Priya Sharma co-authored a research paper on 'Efficient NLP Models for Low-Resource Languages' published in an international conference.",
    content: `Congratulations to Priya Sharma, our club member and 3rd-year AI/ML student!

Priya's research paper titled "Efficient NLP Models for Low-Resource Languages" has been accepted at the International Conference on Computational Linguistics (ICCL) 2024.

The paper explores innovative techniques for building natural language processing models for languages with limited training data, with a focus on Indian regional languages.

This achievement demonstrates the caliber of research work happening within our club. Priya conducted this research under the guidance of Dr. Rajesh Kumar Nigam and in collaboration with researchers from IIT Delhi.

We're incredibly proud of this accomplishment and look forward to more such successes from our members!`,
    author: "Dr. Rajesh Kumar Nigam",
    date: new Date('2024-08-20T11:00:00').toISOString()
  },
  {
    title: "Industry Collaboration with Tech Giants Announced",
    slug: "industry-collaboration-announcement",
    excerpt: "AIML Club partners with leading tech companies to provide internship opportunities, mentorship programs, and access to cutting-edge AI tools for our members.",
    content: `We're excited to announce strategic partnerships with leading technology companies!

Partner Companies:
- Microsoft Azure AI
- Google Cloud AI Platform
- NVIDIA Deep Learning Institute
- Amazon Web Services (AWS)

Benefits for Club Members:
- Internship opportunities
- Access to premium AI/ML tools and platforms
- Mentorship from industry professionals
- Certification programs
- Early access to new technologies

These collaborations will significantly enhance learning opportunities and career prospects for our members. Application details for various programs will be shared soon.

This is a major milestone for AIML Club OCT, and we're grateful for the support from our industry partners!`,
    author: "Shamaila Khan",
    date: new Date('2024-11-10T10:00:00').toISOString()
  }
];

async function addEvents() {
  console.log('\n🎯 Adding Events...');
  
  for (const event of dummyEvents) {
    try {
      const result = await api(
        'POST',
        `/databases/${databaseId}/collections/${eventsCollectionId}/documents`,
        {
          documentId: 'unique()',
          data: event
        }
      );
      console.log(`✅ Added event: ${event.title}`);
    } catch (error: any) {
      console.error(`❌ Failed to add event "${event.title}":`, error.message);
    }
  }
}

async function addHighlights() {
  console.log('\n📰 Adding Highlights...');
  
  for (const highlight of dummyHighlights) {
    try {
      const result = await api(
        'POST',
        `/databases/${databaseId}/collections/${highlightsCollectionId}/documents`,
        {
          documentId: 'unique()',
          data: highlight
        }
      );
      console.log(`✅ Added highlight: ${highlight.title}`);
    } catch (error: any) {
      console.error(`❌ Failed to add highlight "${highlight.title}":`, error.message);
    }
  }
}

async function main() {
  console.log('🚀 Starting to add dummy data to Appwrite...\n');
  console.log(`Database ID: ${databaseId}`);
  console.log(`Events Collection: ${eventsCollectionId}`);
  console.log(`Highlights Collection: ${highlightsCollectionId}`);
  
  if (!apiKey) {
    console.error('❌ APPWRITE_API_KEY not found in environment variables!');
    process.exit(1);
  }
  
  await addEvents();
  await addHighlights();
  
  console.log('\n✨ All dummy data added successfully!');
  console.log('\n📊 Summary:');
  console.log(`- Events: ${dummyEvents.length} (${dummyEvents.filter(e => e.status === 'scheduled').length} upcoming, ${dummyEvents.filter(e => e.status === 'completed').length} past)`);
  console.log(`- Highlights: ${dummyHighlights.length}`);
}

main().catch(console.error);
