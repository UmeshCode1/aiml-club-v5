import { NextResponse } from 'next/server';
import { COLLECTIONS } from '@/lib/appwrite';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const eventsCollectionId = COLLECTIONS.EVENTS;

export async function GET() {
  try {
    // Check if collection ID is configured
    if (!eventsCollectionId || eventsCollectionId === 'TBD') {
      console.log('Events collection not configured yet');
      return NextResponse.json({
        upcoming: [],
        past: [],
        all: [],
        message: 'Collection not configured. Run setup script.'
      });
    }

    const res = await fetch(
      `${endpoint}/databases/${databaseId}/collections/${eventsCollectionId}/documents?queries[]=limit(100)`,
      {
        headers: {
          'X-Appwrite-Project': project,
          'Content-Type': 'application/json'
        },
        next: { revalidate: 300 } // Cache for 5 minutes
      }
    );

    if (!res.ok) {
      console.error('Appwrite API error:', res.status, res.statusText);
      return NextResponse.json({
        error: 'Failed to fetch events',
        status: res.status,
        upcoming: [],
        past: [],
        all: []
      }, { status: 200 }); // Return 200 with empty arrays
    }

    const json = await res.json();
    const now = new Date();
    const events = json.documents || [];

    // Sort by date
    const sortedEvents = events.sort((a: any, b: any) =>
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );

    const upcoming = sortedEvents.filter((e: any) =>
      e.status === 'Scheduled' && new Date(e.startDate) >= now
    );
    const past = sortedEvents.filter((e: any) =>
      e.status === 'Completed' || new Date(e.startDate) < now
    );

    return NextResponse.json({ upcoming, past, all: sortedEvents });
  } catch (e: any) {
    console.error('Events API error:', e.message);
    return NextResponse.json({
      error: e.message,
      upcoming: [],
      past: [],
      all: []
    }, { status: 200 });
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
