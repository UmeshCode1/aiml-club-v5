import React from 'react';

export const dynamic = 'force-dynamic';

async function fetchHealth(): Promise<any> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/health`, {
      // Ensure this fetch always hits the server; avoid static cache
      cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch health');
    return res.json();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export default async function HealthPage() {
  const data = await fetchHealth();
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">System Status</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
        Live health diagnostics for Appwrite services and configuration. This page is dynamic and bypasses static caching.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        {Object.entries(data).map(([key, value]) => {
          const v = value as any;
          const healthy = v?.status === 'ok' || v === true || v?.ok === true;
          return (
            <div key={key} className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-dark-card shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h2>
                <span className={healthy ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                  {healthy ? 'OK' : 'Issue'}
                </span>
              </div>
              <pre className="text-xs whitespace-pre-wrap text-gray-600 dark:text-gray-400">{JSON.stringify(value, null, 2)}</pre>
            </div>
          );
        })}
      </div>
    </div>
  );
}
