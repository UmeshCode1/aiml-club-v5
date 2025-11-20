import { NextResponse } from 'next/server';
import { Client } from 'appwrite';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const result: Record<string, any> = {};

  // Basic configuration exposure (non-sensitive IDs only)
  result.config = {
    endpointSet: !!process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
    projectSet: !!process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
    databaseSet: !!process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
  };

  // Lightweight Database existence check via REST (avoids SDK typings mismatch)
  if (process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT && process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID && process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID && process.env.APPWRITE_API_KEY) {
    try {
      const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT.replace(/\/$/, '');
      const url = `${endpoint}/databases/${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}`;
      const res = await fetch(url, {
        headers: {
          'X-Appwrite-Project': process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
          'X-Appwrite-Key': process.env.APPWRITE_API_KEY,
        },
        cache: 'no-store'
      });
      if (res.ok) {
        const json = await res.json();
        result.database = { status: 'ok', name: json.name, collectionsCount: json.collections }; // collections property may differ; best-effort
      } else {
        result.database = { status: 'error', httpStatus: res.status };
      }
    } catch (e) {
      result.database = { status: 'error', message: (e as Error).message };
    }
  } else {
    result.database = { status: 'incomplete_config' };
  }

  // Simple client initialization test
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);
    // If no exception thrown, mark OK
    result.sdkInit = { status: 'ok' };
  } catch (e) {
    result.sdkInit = { status: 'error', message: (e as Error).message };
  }

  // Validate each collection ID via REST
  const collectionEnvMap: Record<string,string|undefined> = {
    events: process.env.NEXT_PUBLIC_COLLECTION_EVENTS,
    highlights: process.env.NEXT_PUBLIC_COLLECTION_HIGHLIGHTS,
    team: process.env.NEXT_PUBLIC_COLLECTION_TEAM,
    members: process.env.NEXT_PUBLIC_COLLECTION_MEMBERS,
    suggestions: process.env.NEXT_PUBLIC_COLLECTION_SUGGESTIONS,
    notifications: process.env.NEXT_PUBLIC_COLLECTION_NOTIFICATIONS,
    subscribers: process.env.NEXT_PUBLIC_COLLECTION_SUBSCRIBERS,
    gallery: process.env.NEXT_PUBLIC_COLLECTION_GALLERY,
  };

  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT?.replace(/\/$/, '');
  const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  const key = process.env.APPWRITE_API_KEY;

  if (endpoint && project && dbId && key) {
    result.collections = {};
    for (const [label, id] of Object.entries(collectionEnvMap)) {
      if (!id) {
        result.collections[label] = { status: 'missing_env' }; continue;
      }
      try {
        const res = await fetch(`${endpoint}/databases/${dbId}/collections/${id}`, {
          headers: {
            'X-Appwrite-Project': project,
            'X-Appwrite-Key': key,
          },
          cache: 'no-store'
        });
        if (res.ok) {
          const json = await res.json();
            result.collections[label] = { status: 'ok', name: json.name };
        } else {
          result.collections[label] = { status: 'error', httpStatus: res.status };
        }
      } catch (e) {
        result.collections[label] = { status: 'error', message: (e as Error).message };
      }
    }
  } else {
    result.collections = { status: 'incomplete_config' };
  }

  // Validate buckets
  const bucketEnvMap: Record<string,string|undefined> = {
    gallery: process.env.NEXT_PUBLIC_BUCKET_GALLERY,
    events: process.env.NEXT_PUBLIC_BUCKET_EVENTS,
    team: process.env.NEXT_PUBLIC_BUCKET_TEAM,
  };

  if (endpoint && project && key) {
    result.buckets = {};
    for (const [label, id] of Object.entries(bucketEnvMap)) {
      if (!id) { result.buckets[label] = { status: 'missing_env' }; continue; }
      try {
        const res = await fetch(`${endpoint}/storage/buckets/${id}`, {
          headers: {
            'X-Appwrite-Project': project,
            'X-Appwrite-Key': key,
          },
          cache: 'no-store'
        });
        if (res.ok) {
          const json = await res.json();
          result.buckets[label] = { status: 'ok', name: json.name };
        } else {
          result.buckets[label] = { status: 'error', httpStatus: res.status };
        }
      } catch (e) {
        result.buckets[label] = { status: 'error', message: (e as Error).message };
      }
    }
  } else {
    result.buckets = { status: 'incomplete_config' };
  }

  return NextResponse.json(result, { status: 200 });
}
