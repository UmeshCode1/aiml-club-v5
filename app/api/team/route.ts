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
      const errorText = await res.text();
      console.error('Appwrite API error:', res.status, res.statusText, errorText);
      return NextResponse.json({ 
        members: [],
        error: `Failed to fetch team: ${res.status} ${res.statusText} ${errorText}`
      }, { status: 500 });
    }

    const json = await res.json();
    if (!json.documents) {
      console.error('Appwrite response missing documents:', JSON.stringify(json));
      return NextResponse.json({ 
        members: [],
        error: 'No documents found in response.'
      }, { status: 500 });
    }
    // Helper to strip file extension
    function stripExtension(photoId: string) {
      return photoId ? photoId.replace(/\.[^/.]+$/i, '') : '';
    }
    const bucketId = process.env.NEXT_PUBLIC_BUCKET_TEAM!;
    const members = (json.documents || []).map((member: any) => {
      const rawPhotoId = member.photoId || '';
      const fileId = stripExtension(rawPhotoId);
      const imageUrl = `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${project}`;
      return { ...member, imageUrl };
    }).sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));

    return NextResponse.json({ members });
  } catch (e: any) {
    console.error('Team API error:', e);
    return NextResponse.json({ 
      members: [],
      error: e?.message || 'Unknown error'
    }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
