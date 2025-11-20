import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite';

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

  try {
    const { databases } = await createAdminClient();
    // Attempt a lightweight call: list first 1 collection (requires Database ID)
    if (process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID) {
      const collections = await databases.listCollections(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID, undefined, 1);
      result.database = { status: 'ok', collectionsDetected: collections.total };
    } else {
      result.database = { status: 'missing_database_id' };
    }
  } catch (e) {
    result.database = { status: 'error', message: (e as Error).message };
  }

  // Storage buckets check
  try {
    const { databases } = await createAdminClient();
    // Re-using databases client for a simple ping; real bucket listing would use Storage service
    result.servicePing = { status: 'ok' };
  } catch (e) {
    result.servicePing = { status: 'error', message: (e as Error).message };
  }

  return NextResponse.json(result, { status: 200 });
}
