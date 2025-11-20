import { Client, Account, Databases, Storage, Functions, Teams } from 'appwrite';

// Helper: warn if required env vars are missing (improves initial setup experience)
const requiredCore = ['NEXT_PUBLIC_APPWRITE_ENDPOINT', 'NEXT_PUBLIC_APPWRITE_PROJECT_ID'];
const requiredIds = [
  'NEXT_PUBLIC_APPWRITE_DATABASE_ID',
  'NEXT_PUBLIC_COLLECTION_EVENTS',
  'NEXT_PUBLIC_COLLECTION_GALLERY',
  'NEXT_PUBLIC_COLLECTION_MEMBERS',
  'NEXT_PUBLIC_COLLECTION_SUGGESTIONS',
  'NEXT_PUBLIC_COLLECTION_NOTIFICATIONS',
  'NEXT_PUBLIC_COLLECTION_TEAM',
  'NEXT_PUBLIC_COLLECTION_SUBSCRIBERS',
  'NEXT_PUBLIC_COLLECTION_HIGHLIGHTS',
  'NEXT_PUBLIC_BUCKET_GALLERY',
  'NEXT_PUBLIC_BUCKET_EVENTS',
  'NEXT_PUBLIC_BUCKET_TEAM',
];

// Only validate on server-side (these checks fail in browser due to Next.js env var handling)
if (typeof window === 'undefined') {
  for (const v of requiredCore) {
    if (!process.env[v]) {
      throw new Error(`[Appwrite Config] Missing critical env var: ${v}. Add it to .env.local before running.`);
    }
  }

  for (const v of requiredIds) {
    if (!process.env[v]) {
      // Non-critical at bootstrap; log a clear warning so developer knows what to fill.
      // eslint-disable-next-line no-console
      console.warn(`[Appwrite Config] Warning: env var ${v} is not set. Features depending on this ID may fail until you set it.`);
    }
  }
}

// Initialize Appwrite Client
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

// Services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);
export const teams = new Teams(client);

// Database & Collection IDs
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

export const COLLECTIONS = {
  EVENTS: process.env.NEXT_PUBLIC_COLLECTION_EVENTS!,
  GALLERY: process.env.NEXT_PUBLIC_COLLECTION_GALLERY!,
  MEMBERS: process.env.NEXT_PUBLIC_COLLECTION_MEMBERS!,
  SUGGESTIONS: process.env.NEXT_PUBLIC_COLLECTION_SUGGESTIONS!,
  NOTIFICATIONS: process.env.NEXT_PUBLIC_COLLECTION_NOTIFICATIONS!,
  TEAM: process.env.NEXT_PUBLIC_COLLECTION_TEAM!,
  SUBSCRIBERS: process.env.NEXT_PUBLIC_COLLECTION_SUBSCRIBERS!,
  HIGHLIGHTS: process.env.NEXT_PUBLIC_COLLECTION_HIGHLIGHTS!,
};

// Storage Bucket IDs
export const BUCKETS = {
  GALLERY: process.env.NEXT_PUBLIC_BUCKET_GALLERY!,
  EVENTS: process.env.NEXT_PUBLIC_BUCKET_EVENTS!,
  TEAM: process.env.NEXT_PUBLIC_BUCKET_TEAM!,
};

// Server-side admin client (uses API key)
export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
  };
}

export default client;
