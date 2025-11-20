import { NextResponse } from 'next/server';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const teamCollectionId = process.env.NEXT_PUBLIC_COLLECTION_TEAM!;

export async function GET() {
  try {
    const res = await fetch(
      `${endpoint}/databases/${databaseId}/collections/${teamCollectionId}/documents`,
      {
        headers: { 
          'X-Appwrite-Project': project,
          'Content-Type': 'application/json'
        },
        next: { revalidate: 600 }
      }
    );
    
    if (!res.ok) {
      console.error('Appwrite API error:', res.status, res.statusText);
      return NextResponse.json({ 
        members: [],
        error: 'Failed to fetch team'
      }, { status: 200 });
    }
    
    const json = await res.json();
    const members = (json.documents || []).sort((a: any, b: any) => a.order - b.order);
    
    return NextResponse.json({ members });
  } catch (e: any) {
    console.error('Team API error:', e.message);
    return NextResponse.json({ 
      members: [],
      error: e.message
    }, { status: 200 });
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
