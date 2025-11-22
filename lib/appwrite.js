import { Client, Account, Teams, Databases, Storage } from 'appwrite';

export const PROJECT_CONFIG = {
  ENDPOINT: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
  PROJECT_ID: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
  TEAM_ID: 'core-club-team',
  DATABASE_ID: '691e2d6e00131d7cccf1',
  COLLECTIONS: {
    EVENTS: 'auto_1763586568976_qt1sfp',
    TEAM: 'auto_1763586573960_ec75mk',
    GALLERY: 'auto_1763586583858_5bdqms',
    HIGHLIGHTS: 'auto_1763586571724_psmsmf',
    MEMBERS: 'auto_1763586576829_9d9mwm',
    SUGGESTIONS: 'auto_1763586579090_lvnnos',
    NOTIFICATIONS: 'auto_1763586581248_oi4e46',
    SUBSCRIBERS: 'auto_1763586582606_wjggpt',
    MESSAGES: process.env.NEXT_PUBLIC_COLLECTION_MESSAGES,
  },
  BUCKETS: {
    CLUB_DETAILS: '691f19dd000afea07882',
    TEAM_FILES: 'team',
    EVENTS_FILES: 'events',
    GALLERY_FILES: 'gallery',
  },
};

export const { DATABASE_ID, COLLECTIONS, BUCKETS } = PROJECT_CONFIG;

const client = new Client()
  .setEndpoint(PROJECT_CONFIG.ENDPOINT)
  .setProject(PROJECT_CONFIG.PROJECT_ID);

export const account = new Account(client);
export const teams = new Teams(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export function getFilePreview(bucketId, fileId) {
  return storage.getFilePreview(bucketId, fileId).href;
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(PROJECT_CONFIG.ENDPOINT)
    .setProject(PROJECT_CONFIG.PROJECT_ID);

  if (process.env.APPWRITE_API_KEY) {
    client.setKey(process.env.APPWRITE_API_KEY);
  }

  return {
    get account() {
      return new Account(client);
    },
  };
}
