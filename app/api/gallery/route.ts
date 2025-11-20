import { NextResponse } from 'next/server';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const galleryCollectionId = process.env.NEXT_PUBLIC_COLLECTION_GALLERY!;
const bucketId = process.env.NEXT_PUBLIC_BUCKET_GALLERY!;

export async function GET() {
  try {
    const res = await fetch(
      `${endpoint}/databases/${databaseId}/collections/${galleryCollectionId}/documents`,
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
        docs: [],
        error: 'Failed to fetch gallery'
      }, { status: 200 });
    }
    
    const json = await res.json();
    const docs = (json.documents || []).map((d: any) => ({
      id: d.$id,
      title: d.title || 'Untitled',
      fileId: d.fileId,
      imageUrl: d.fileId ? `${endpoint}/storage/buckets/${bucketId}/files/${d.fileId}/view?project=${project}` : null,
      createdAt: d.$createdAt
    }));
    
    return NextResponse.json({ docs });
  } catch (e: any) {
    console.error('Gallery API error:', e.message);
    return NextResponse.json({ 
      docs: [],
      error: e.message
    }, { status: 200 });
  }
}

export const revalidate = 600; // Cache for 10 minutes