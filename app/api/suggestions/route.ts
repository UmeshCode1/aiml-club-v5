import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { content, anonymous = true, name, email } = await req.json();

    if (!content || typeof content !== 'string' || !content.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT?.replace(/\/$/, '');
    const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
    const collectionId = process.env.NEXT_PUBLIC_COLLECTION_SUGGESTIONS;
    const apiKey = process.env.APPWRITE_API_KEY;

    if (!endpoint || !project || !databaseId || !collectionId || !apiKey) {
      return NextResponse.json({ error: 'Server misconfigured: missing Appwrite env vars' }, { status: 500 });
    }

    const payload: any = {
      documentId: 'unique()',
      data: {
        content: content.trim(),
        anonymous: !!anonymous,
        name: anonymous ? undefined : name,
        email: anonymous ? undefined : email,
        status: 'Pending',
      },
    };

    const res = await fetch(`${endpoint}/databases/${databaseId}/collections/${collectionId}/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': project,
        'X-Appwrite-Key': apiKey,
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    if (!res.ok) {
      const txt = await res.text();
      return NextResponse.json({ error: 'Failed to create suggestion', details: txt }, { status: 502 });
    }

    const json = await res.json();
    return NextResponse.json({ ok: true, id: json.$id }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
