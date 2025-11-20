import { NextRequest } from 'next/server';
import { Client, Databases } from 'appwrite';

// More detailed Appwrite connectivity/status endpoint.
// Uses API key server-side ONLY (never expose to client) to list collections.
export async function GET(_req: NextRequest) {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  const apiKey = process.env.APPWRITE_API_KEY; // server-side only

  const result: any = {
    endpoint,
    project,
    databaseId,
    timestamp: new Date().toISOString(),
  };

  // Basic health
  if (endpoint) {
    try {
      const healthRes = await fetch(`${endpoint}/health/version`, { cache: 'no-store' });
      result.health = healthRes.ok ? await healthRes.json() : { error: `HTTP ${healthRes.status}` };
    } catch (e: any) {
      result.health = { error: e?.message || 'health request failed' };
    }
  } else {
    result.health = { error: 'No endpoint configured' };
  }

  // Deeper check: list collections via REST API
  if (endpoint && project && apiKey && databaseId) {
    try {
      const collectionsRes = await fetch(
        `${endpoint}/databases/${databaseId}/collections`,
        {
          headers: {
            'X-Appwrite-Project': project,
            'X-Appwrite-Key': apiKey,
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        }
      );

      if (collectionsRes.ok) {
        const collectionsData = await collectionsRes.json();
        result.collections = {
          total: collectionsData.total,
          ids: collectionsData.collections?.map((c: any) => c.$id) || [],
        };
        result.serverAuth = 'ok';
      } else {
        result.serverAuth = 'error';
        result.collections = { error: `HTTP ${collectionsRes.status}` };
      }
    } catch (e: any) {
      result.serverAuth = 'error';
      result.collections = { error: e?.message || 'Failed to list collections' };
    }
  } else {
    result.serverAuth = 'skipped';
  }

  return new Response(JSON.stringify(result), { headers: { 'Content-Type': 'application/json' } });
}
