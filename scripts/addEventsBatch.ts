/**
 * Batch add events from inline CSV (provided by user).
 * Usage: npx ts-node scripts/addEventsBatch.ts
 */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local', override: true });

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const eventsCollectionIdRaw = process.env.NEXT_PUBLIC_COLLECTION_EVENTS;
const eventsCollectionId = (!eventsCollectionIdRaw || eventsCollectionIdRaw === 'TBD') ? 'auto_1763586568976_qt1sfp' : eventsCollectionIdRaw;
const apiKey = process.env.APPWRITE_API_KEY!;

if (!endpoint || !project || !databaseId || !apiKey) {
  console.error('Missing env variables.');
  process.exit(1);
}

const RAW = `Title,Description,Start Date,End Date,Location,Poster URL
Intro to Machine Learning,A beginner-friendly workshop covering Python basics and ML concepts.,2025-11-25 10:00,2025-11-25 14:00,Computer Lab 1,
AI Innovation Hackathon,24-hour coding battle to build GenAI solutions. Prizes worth 10k.,2025-12-10 09:00,2025-12-11 09:00,Main Auditorium,
Guest Lecture: Future of AI,An interactive session with industry experts on the ethics of AI.,2025-12-20 11:00,2025-12-20 13:00,Seminar Hall B,
Club Orientation,Welcome session for new members. Introduction to Core Council.,2025-11-22 15:00,2025-11-22 17:00,OCT Campus Lawns,
Expert Talk by Coding Thinker,Talk (1.5 hours). Status: Scheduled.,2025-08-26 10:00,2025-08-26 11:30,College Campus,
DSPL Session,Session (2 hours). Status: Scheduled.,2025-09-10 10:00,2025-09-10 12:00,College Campus,https://drive.google.com/file/d/1xv3a9iCzqhP2mRNXrXFPtc2MdO4triam/view?usp=sharing
DSPL Workshop,Workshop (2 days). Status: Scheduled.,2025-09-11 10:00,2025-09-12 17:00,College Campus,https://drive.google.com/file/d/1xv3a9iCzqhP2mRNXrXFPtc2MdO4triam/view?usp=sharing
Apfity Test,Test (1 hour). Status: Scheduled.,2025-10-13 10:00,2025-10-13 11:00,College Campus,https://drive.google.com/file/d/1yEwEA1owqbw1So4HH01FjJaeSejo5XMo/view?usp=drive_link`;

interface Event { title:string; description:string; start:string; end?:string; location:string; poster?:string; }

function parse(): Event[] {
  const [header, ...rows] = RAW.split(/\r?\n/).filter(l => l.trim().length);
  return rows.map(r => {
    const [title, description, start, end, location, poster] = r.split(',');
    return { title: title?.trim(), description: description?.trim(), start: start?.trim(), end: end?.trim(), location: location?.trim(), poster: poster?.trim() };
  }).filter(e => e.title && e.start && e.location);
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}

function guessType(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('workshop')) return 'workshop';
  if (t.includes('hackathon')) return 'hackathon';
  if (t.includes('lecture') || t.includes('guest')) return 'guest_lecture';
  if (t.includes('orientation')) return 'orientation';
  if (t.includes('session')) return 'session';
  if (t.includes('test')) return 'test';
  if (t.includes('talk')) return 'talk';
  return 'other';
}

function toISO(local: string): string {
  return local.replace(' ', 'T') + ':00Z';
}

async function api(method: string, path: string, body?: any) {
  const res = await fetch(endpoint + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': project,
      'X-Appwrite-Key': apiKey
    },
    body: body? JSON.stringify(body): undefined
  });
  const text = await res.text();
  let data: any = null; try { data = text? JSON.parse(text): null; } catch { data = text; }
  if (!res.ok) throw new Error(`${method} ${path} ${res.status}: ${text}`);
  return data;
}

async function exists(slug: string) {
  try {
    const q = encodeURIComponent(`equal("slug","${slug}")`);
    const r = await api('GET', `/databases/${databaseId}/collections/${eventsCollectionId}/documents?queries[]=${q}`);
    return (r.total || 0) > 0;
  } catch { return false; }
}

async function add(event: Event) {
  const slug = slugify(event.title);
  if (await exists(slug)) {
    console.log(`Skip (exists): ${event.title}`);
    return;
  }
  const poster = event.poster && event.poster.length <= 50 ? event.poster : '';
  const body = {
    documentId: 'unique()',
    data: {
      title: event.title,
      slug,
      description: event.description,
      startDate: toISO(event.start),
      endDate: event.end ? toISO(event.end) : undefined,
      location: event.location,
      type: guessType(event.title),
      status: 'scheduled',
      posterId: poster || null
    },
    permissions: ['read("any")']
  };
  await api('POST', `/databases/${databaseId}/collections/${eventsCollectionId}/documents`, body);
  console.log(`Added: ${event.title}`);
}

(async () => {
  try {
    const events = parse();
    console.log('Parsed events:', events.length);
    for (const e of events) {
      await add(e);
    }
    console.log('Batch completed.');
  } catch (e:any) {
    console.error('Failed:', e.message || e);
    process.exit(1);
  }
})();
