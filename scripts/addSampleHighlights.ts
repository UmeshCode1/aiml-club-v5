import fs from 'fs';

function extract(key: string): string {
  const envPath = '.env.local';
  if (!fs.existsSync(envPath)) throw new Error('.env.local not found');
  const content = fs.readFileSync(envPath, 'utf8');
  const match = content.match(new RegExp(`^${key}=(.*)$`, 'm'));
  if (!match) throw new Error(`${key} not found in .env.local`);
  return match[1].trim();
}

async function main() {
  const endpoint = extract('NEXT_PUBLIC_APPWRITE_ENDPOINT');
  const project = extract('NEXT_PUBLIC_APPWRITE_PROJECT_ID');
  const database = extract('NEXT_PUBLIC_APPWRITE_DATABASE_ID');
  const apiKey = extract('APPWRITE_API_KEY');
  let highlightsId = extract('NEXT_PUBLIC_COLLECTION_HIGHLIGHTS');

  if (highlightsId === 'TBD') {
    console.log('⚠️  Using fallback HIGHLIGHTS collection ID');
    highlightsId = 'auto_1763586571724_psmsmf';
  }

  const highlights = [
    {
      title: 'AI Workshop Series Launch',
      slug: 'ai-workshop-series-launch',
      excerpt: 'Successfully launched our first AI workshop series with over 100 participants.',
      content: 'Successfully launched our first AI workshop series with over 100 participants learning about machine learning fundamentals and practical applications. The workshops covered topics like neural networks, deep learning, computer vision, and natural language processing.',
      date: '2025-01-15',
      author: 'AIML Club Team',
    },
    {
      title: 'Hackathon Winners Announced',
      slug: 'hackathon-winners-announced',
      excerpt: 'Our annual AI Innovation Hackathon concluded with amazing projects.',
      content: 'Our annual AI Innovation Hackathon concluded with amazing projects. Team Alpha won first place with their healthcare AI solution that helps doctors diagnose diseases faster. Second place went to Team Beta for their AI-powered study assistant.',
      date: '2025-02-20',
      author: 'AIML Club Team',
    },
    {
      title: 'Industry Partnership with Tech Giants',
      slug: 'industry-partnership-tech-giants',
      excerpt: 'AIML Club partnered with leading tech companies to provide students opportunities.',
      content: 'AIML Club partnered with leading tech companies to provide students with internship opportunities and mentorship programs. Our partners include major AI companies who will offer workshops, career guidance, and real-world project experience.',
      date: '2025-03-10',
      author: 'AIML Club Team',
    },
    {
      title: 'Research Paper Published',
      slug: 'research-paper-published',
      excerpt: 'Club members published a research paper on neural networks in international conference.',
      content: 'Our club members published a research paper on neural networks in a prestigious international conference. The paper presents novel approaches to improving neural network efficiency and has been accepted for presentation at the AI Research Summit.',
      date: '2024-12-05',
      author: 'AIML Club Team',
    },
  ];

  console.log(`📝 Adding ${highlights.length} highlights...`);

  for (const highlight of highlights) {
    try {
      const res = await fetch(`${endpoint}/databases/${database}/collections/${highlightsId}/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-Key': apiKey,
          'X-Appwrite-Project': project,
        },
        body: JSON.stringify({
          documentId: 'unique()',
          data: highlight,
          permissions: [
            'read("any")',
          ],
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error(`❌ Failed to create highlight "${highlight.title}":`, err);
      } else {
        console.log(`✅ Created: ${highlight.title}`);
      }
    } catch (error) {
      console.error(`❌ Error creating highlight "${highlight.title}":`, error);
    }
  }

  console.log('✅ Highlights added successfully!');
}

main();
