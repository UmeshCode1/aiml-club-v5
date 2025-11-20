import fs from 'fs';

function extract(key: string): string {
  const envPath = '.env.local';
  if (!fs.existsSync(envPath)) throw new Error('.env.local not found');
  const content = fs.readFileSync(envPath, 'utf8');
  const match = content.match(new RegExp(`^${key}=(.*)$`, 'm'));
  if (!match) throw new Error(`${key} not found in .env.local`);
  return match[1].trim();
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function toISO(dateStr: string): string {
  return dateStr.replace(' ', 'T') + ':00Z';
}

function guessType(title: string, description: string): string {
  const t = title.toLowerCase();
  const d = description.toLowerCase();
  if (t.includes('workshop') || d.includes('workshop')) return 'workshop';
  if (t.includes('hackathon') || d.includes('hackathon')) return 'hackathon';
  if (t.includes('talk') && (t.includes('guest') || t.includes('expert'))) return 'guest_lecture';
  if (t.includes('talk') || d.includes('talk')) return 'talk';
  if (t.includes('session') || d.includes('session')) return 'session';
  if (t.includes('test') || d.includes('test')) return 'test';
  if (t.includes('orientation') || d.includes('orientation')) return 'orientation';
  return 'other';
}

async function main() {
  const endpoint = extract('NEXT_PUBLIC_APPWRITE_ENDPOINT');
  const project = extract('NEXT_PUBLIC_APPWRITE_PROJECT_ID');
  const database = extract('NEXT_PUBLIC_APPWRITE_DATABASE_ID');
  const apiKey = extract('APPWRITE_API_KEY');
  let eventsId = extract('NEXT_PUBLIC_COLLECTION_EVENTS');

  if (eventsId === 'TBD') {
    console.log('⚠️  Using fallback EVENTS collection ID');
    eventsId = 'auto_1763586568976_qt1sfp';
  }

  const events = [
    {
      title: 'Expert Talk by Coding Thinker',
      description: 'Talk (1.5 hours). Status: Scheduled.',
      startDate: '2025-08-26 10:00',
      endDate: '2025-08-26 11:30',
      location: 'College Campus',
      posterUrl: '',
    },
    {
      title: 'DSPL Session',
      description: 'Session (2 hours). Status: Scheduled.',
      startDate: '2025-09-10 10:00',
      endDate: '2025-09-10 12:00',
      location: 'College Campus',
      posterUrl: 'https://drive.google.com/file/d/1xv3a9iCzqhP2mRNXrXFPtc2MdO4triam/view?usp=sharing',
    },
    {
      title: 'DSPL Workshop',
      description: 'Workshop (2 days). Status: Scheduled.',
      startDate: '2025-09-11 10:00',
      endDate: '2025-09-12 17:00',
      location: 'College Campus',
      posterUrl: 'https://drive.google.com/file/d/1xv3a9iCzqhP2mRNXrXFPtc2MdO4triam/view?usp=sharing',
    },
    {
      title: 'Apfity Test',
      description: 'Test (1 hour). Status: Scheduled.',
      startDate: '2025-10-13 10:00',
      endDate: '2025-10-13 11:00',
      location: 'College Campus',
      posterUrl: 'https://drive.google.com/file/d/1yEwEA1owqbw1So4HH01FjJaeSejo5XMo/view?usp=drive_link',
    },
  ];

  console.log(`📝 Adding ${events.length} new events...`);

  for (const event of events) {
    const slug = slugify(event.title);
    const type = guessType(event.title, event.description);
    
    // Check if event already exists
    const checkUrl = `${endpoint}/databases/${database}/collections/${eventsId}/documents?queries[]=${encodeURIComponent(`equal("slug", "${slug}")`)}`;
    const checkRes = await fetch(checkUrl, {
      headers: {
        'X-Appwrite-Key': apiKey,
        'X-Appwrite-Project': project,
      },
    });
    const checkData = await checkRes.json();
    
    if (checkData.documents && checkData.documents.length > 0) {
      console.log(`⏭️  Event "${event.title}" already exists, skipping...`);
      continue;
    }

    const posterId = event.posterUrl && event.posterUrl.length > 50 ? '' : event.posterUrl;

    try {
      const res = await fetch(`${endpoint}/databases/${database}/collections/${eventsId}/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-Key': apiKey,
          'X-Appwrite-Project': project,
        },
        body: JSON.stringify({
          documentId: 'unique()',
          data: {
            title: event.title,
            description: event.description,
            slug,
            startDate: toISO(event.startDate),
            endDate: event.endDate ? toISO(event.endDate) : toISO(event.startDate),
            location: event.location,
            type,
            status: 'scheduled',
            posterId,
          },
          permissions: ['read("any")'],
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error(`❌ Failed to create event "${event.title}":`, err);
      } else {
        console.log(`✅ Created: ${event.title} (${type})`);
      }
    } catch (error) {
      console.error(`❌ Error creating event "${event.title}":`, error);
    }
  }

  console.log('✅ Events added successfully!');
}

main();
