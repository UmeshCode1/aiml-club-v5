import { NextResponse } from 'next/server';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const notificationsCollectionId = process.env.NEXT_PUBLIC_COLLECTION_NOTIFICATIONS!;

export async function GET() {
  try {
    // Fetch unread notifications count
    const res = await fetch(
      `${endpoint}/databases/${databaseId}/collections/${notificationsCollectionId}/documents?queries[]=equal("read",false)&queries[]=limit(100)`,
      {
        headers: {
          'X-Appwrite-Project': project,
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ count: 0 }, { status: 200 });
    }

    const data = await res.json();
    return NextResponse.json({ count: data.total || 0 });
  } catch (error) {
    console.error('Error fetching unread notifications:', error);
    return NextResponse.json({ count: 0 }, { status: 200 });
  }
}
