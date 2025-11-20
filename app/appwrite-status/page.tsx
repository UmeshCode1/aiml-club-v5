import React from 'react';

// Server component: shows live Appwrite connectivity (health + collections)
export default async function AppwriteStatusPage() {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  const apiKey = process.env.APPWRITE_API_KEY; // only available server-side

  let health: any = null;
  let collections: Array<{ name: string; id: string }> = [];
  let error: string | null = null;

  if (!endpoint || !project) {
    error = 'Missing endpoint or project env vars.';
  } else {
    try {
      const hRes = await fetch(`${endpoint}/health/version`, { cache: 'no-store' });
      health = hRes.ok ? await hRes.json() : { error: `Health HTTP ${hRes.status}` };
    } catch (e: any) {
      health = { error: e.message };
    }

    if (apiKey && databaseId) {
      try {
        const cRes = await fetch(`${endpoint}/databases/${databaseId}/collections`, {
          headers: {
            'x-appwrite-project': project,
            'x-appwrite-key': apiKey,
          },
          cache: 'no-store',
        });
        if (cRes.ok) {
          const json = await cRes.json();
          collections = json.collections.map((c: any) => ({ name: c.name, id: c.$id }));
        } else {
          error = `Collections HTTP ${cRes.status}`;
        }
      } catch (e: any) {
        error = e.message;
      }
    }
  }

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-2xl font-bold">Appwrite Connection Status</h1>
      <div className="rounded border p-4 bg-gray-50 dark:bg-gray-900">
        <p><strong>Endpoint:</strong> {endpoint || 'N/A'}</p>
        <p><strong>Project:</strong> {project || 'N/A'}</p>
        <p><strong>Database:</strong> {databaseId || 'N/A'}</p>
        <p><strong>Health:</strong> {health ? (health.version ? `version ${health.version}` : JSON.stringify(health)) : 'N/A'}</p>
        {error && <p className="text-red-600"><strong>Error:</strong> {error}</p>}
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Collections ({collections.length})</h2>
        {collections.length === 0 && <p className="text-sm text-gray-500">No collections listed (missing API key or database ID).</p>}
        {collections.length > 0 && (
          <ul className="list-disc pl-5 text-sm">
            {collections.map(c => (
              <li key={c.id}><code>{c.name}</code> – <span className="text-gray-500">{c.id}</span></li>
            ))}
          </ul>
        )}
      </div>
      <div className="text-xs text-gray-500 space-y-1">
        <p>Use this page to prove the Next.js app can reach Appwrite (health + list collections).</p>
        <p>If the Appwrite wizard still shows "Waiting for connection", you can safely dismiss it.</p>
        <p>External ping endpoint: <code>/api/appwrite-connect</code> (returns 200 with CORS headers).</p>
      </div>
    </div>
  );
}
