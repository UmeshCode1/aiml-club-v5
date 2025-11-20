"use client";
import { useEffect, useState } from 'react';

// Lightweight component that triggers a browser-side request to Appwrite.
// Helps the Appwrite connection wizard detect network traffic.
export default function AppwritePing() {
  const [status, setStatus] = useState<string>("pinging...");

  useEffect(() => {
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
    if (!endpoint || !project) {
      setStatus("missing env vars");
      return;
    }

    // Hit our own Next.js API route first (server verified earlier)
    fetch("/api/appwrite-ping")
      .then(r => r.json())
      .then(data => {
        if (data?.health?.version) {
          setStatus(`ok v${data.health.version}`);
        } else if (data?.health?.error) {
          setStatus("partial: " + data.health.error);
        } else {
          setStatus("ok");
        }
      })
      .catch(e => setStatus("error: " + e.message));
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 4,
        right: 6,
        fontSize: '10px',
        padding: '2px 6px',
        background: '#111827',
        color: '#9CA3AF',
        borderRadius: 4,
        zIndex: 50,
        opacity: 0.6,
        pointerEvents: 'none'
      }}
      aria-hidden="true"
    >appwrite: {status}</div>
  );
}
