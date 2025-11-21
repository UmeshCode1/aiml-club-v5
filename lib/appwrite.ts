
import { Client, Account, Teams, Databases, Storage } from 'appwrite';

export const PROJECT_CONFIG = {
  ENDPOINT: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || process.env.APPWRITE_ENDPOINT || '',
  PROJECT_ID: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || process.env.APPWRITE_PROJECT_ID || '',
  TEAM_ID: 'core-club-team',
  DATABASE_ID: '691e2d6e00131d7cccf1',
  COLLECTIONS: {
    EVENTS: 'auto_1763586568976_qt1sf',
    TEAM: 'auto_1763586573960_ec75m',
    GALLERY: 'auto_1763586583858_5bdqms',
    HIGHLIGHTS: 'auto_1763586571724_psmsm',
    MEMBERS: 'auto_1763586576829_9d9mw',
    SUGGESTIONS: 'auto_1763586579090_lvnno',
    NOTIFICATIONS: 'auto_1763586581248_oi4e4',
    SUBSCRIBERS: 'auto_1763586582606_wjggp',
  },
  BUCKETS: {
    CLUB_DETAILS: '691f19dd000afea07882',
    TEAM_FILES: 'team',
    EVENTS_FILES: 'events',
    GALLERY_FILES: 'gallery',
  },
};

export const DATABASE_ID = PROJECT_CONFIG.DATABASE_ID;
export const COLLECTIONS = PROJECT_CONFIG.COLLECTIONS;
export const BUCKETS = PROJECT_CONFIG.BUCKETS;

const client = new Client()
  .setEndpoint(PROJECT_CONFIG.ENDPOINT)
  .setProject(PROJECT_CONFIG.PROJECT_ID);

export const account = new Account(client);
export const teams = new Teams(client);
export const databases = new Databases(client);
export const storage = new Storage(client);


export function getFilePreview(bucketId: string, fileId: string): string {
  return `${PROJECT_CONFIG.ENDPOINT}/storage/buckets/${bucketId}/files/${fileId}/preview?project=${PROJECT_CONFIG.PROJECT_ID}`;
}

export function createAdminClient() {
  return { account };
}
