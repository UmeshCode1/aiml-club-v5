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

  return NextResponse.json(result, { status: 200 });
}
