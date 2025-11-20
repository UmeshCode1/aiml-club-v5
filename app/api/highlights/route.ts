import { NextResponse } from 'next/server';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const highlightsCollectionId = process.env.NEXT_PUBLIC_COLLECTION_HIGHLIGHTS!;

export async function GET() {
  try {
    // Check if collection ID is configured
    if (!highlightsCollectionId || highlightsCollectionId === 'TBD') {
      console.log('Highlights collection not configured yet');
      return NextResponse.json({ 
        highlights: [],
        message: 'Collection not configured'
      });
    }

    const res = await fetch(
      `${endpoint}/databases/${databaseId}/collections/${highlightsCollectionId}/documents?queries[]=limit(100)&queries[]=orderDesc("createdAt")`,
      {
        headers: { 
          'X-Appwrite-Project': project,
          'Content-Type': 'application/json'
        },
        cache: 'no-store',
        next: { revalidate: 0 }
      }
    );
    
    if (!res.ok) {
      console.error('Appwrite API error:', res.status, res.statusText);
      return NextResponse.json({ 
        highlights: [],
        error: 'Failed to fetch'
      });
    }
    
    const json = await res.json();
    const highlights = json.documents || [];
    
    return NextResponse.json({ highlights });
  } catch (e: any) {
    console.error('Highlights API error:', e.message);
    return NextResponse.json({ 
      highlights: [],
      error: e.message
    });
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
