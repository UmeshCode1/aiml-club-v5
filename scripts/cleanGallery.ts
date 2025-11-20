/**
 * Clean gallery and create proper album structure
 */

const endpoint = 'https://fra.cloud.appwrite.io/v1';
const project = '691e2b31003e6415bb4f';
const databaseId = '691e2d6e00131d7cccf1';
const galleryCollectionId = 'auto_1763586583858_5bdqms';
const apiKey = process.env.APPWRITE_API_KEY || '';

if (!apiKey) {
  console.error('Missing APPWRITE_API_KEY');
  process.exit(1);
}

async function api(method: string, path: string, body?: any) {
  const url = `${endpoint}${path}`;
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': project,
      'X-Appwrite-Key': apiKey,
    },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error: ${res.status} ${text}`);
  }
  
  const text = await res.text();
  if (!text) return {};
  return JSON.parse(text);
}

async function cleanGallery() {
  console.log('🧹 Cleaning gallery collection...\n');

  // Get all documents
  const response = await api('GET', `/databases/${databaseId}/collections/${galleryCollectionId}/documents?limit=100`);
  const docs = response.documents || [];

  console.log(`Found ${docs.length} documents`);

  // Delete all existing documents
  for (const doc of docs) {
    try {
      await api('DELETE', `/databases/${databaseId}/collections/${galleryCollectionId}/documents/${doc.$id}`);
      console.log(`✅ Deleted: ${doc.title || doc.$id}`);
    } catch (error) {
      console.error(`❌ Failed to delete ${doc.$id}:`, error);
    }
  }

  console.log('\n📸 Creating proper album structure...\n');

  // Create albums (as per the visible albums in the screenshot)
  const albums = [
    {
      eventName: 'ML Bootcamp 2024',
      title: 'ML Bootcamp 2024',
      description: 'Machine Learning Bootcamp held in November 2024',
      date: '2024-11-15',
      coverPhoto: '',
      photos: [],
    },
    {
      eventName: 'AI Hackathon',
      title: 'AI Hackathon',
      description: 'AI Hackathon competition in October 2024',
      date: '2024-10-20',
      coverPhoto: '',
      photos: [],
    },
    {
      eventName: 'Kaggle Workshop',
      title: 'Kaggle Workshop',
      description: 'Kaggle workshop for data science enthusiasts',
      date: '2024-10-15',
      coverPhoto: '',
      photos: [],
    },
  ];

  for (const album of albums) {
    try {
      const body = {
        documentId: 'unique()',
        data: album,
      };

      await api('POST', `/databases/${databaseId}/collections/${galleryCollectionId}/documents`, body);
      console.log(`✅ Created album: ${album.title}`);
    } catch (error) {
      console.error(`❌ Failed to create ${album.title}:`, error);
    }
  }

  console.log('\n🎉 Gallery cleaned and albums created!');
}

cleanGallery()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
