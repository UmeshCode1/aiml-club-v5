import { NextRequest } from 'next/server';

// Simple Appwrite connectivity check endpoint.
// Returns the configured endpoint, project ID, and (if reachable) the Appwrite version.
export async function GET(_req: NextRequest) {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

  let health: any = null;
  if (endpoint) {
    try {
      const res = await fetch(`${endpoint}/health/version`, { cache: 'no-store' });
      if (res.ok) {
        health = await res.json();
      } else {
        health = { error: `Health check failed: HTTP ${res.status}` };
      }
    } catch (e: any) {
      health = { error: e?.message || 'Health request error' };
    }
  }

  return new Response(
    JSON.stringify({
      status: 'ok',
      endpoint,
      project,
      health,
      timestamp: new Date().toISOString(),
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
