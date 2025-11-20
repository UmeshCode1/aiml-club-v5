// Open CORS ping endpoint so the Appwrite onboarding wizard (or any external origin)
// can call http://localhost:3000/api/appwrite-connect and receive 200.
export async function GET() {
  return new Response(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
