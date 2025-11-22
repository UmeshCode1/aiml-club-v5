import { Client, Account, Teams, Databases, Storage, RealtimeResponseEvent } from 'appwrite';

export const PROJECT_CONFIG = {
    ENDPOINT: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1',
    PROJECT_ID: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '',
    DATABASE_ID: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
    COLLECTIONS: {
        TEAM: process.env.NEXT_PUBLIC_COLLECTION_TEAM || '',
        EVENTS: process.env.NEXT_PUBLIC_COLLECTION_EVENTS || '',
        GALLERY: process.env.NEXT_PUBLIC_COLLECTION_GALLERY || '',
        ALBUMS: process.env.NEXT_PUBLIC_COLLECTION_ALBUMS || '',
        HIGHLIGHTS: process.env.NEXT_PUBLIC_COLLECTION_HIGHLIGHTS || '',
        MEMBERS: process.env.NEXT_PUBLIC_COLLECTION_MEMBERS || '',
        SUGGESTIONS: process.env.NEXT_PUBLIC_COLLECTION_SUGGESTIONS || '',
        NOTIFICATIONS: process.env.NEXT_PUBLIC_COLLECTION_NOTIFICATIONS || '',
        SUBSCRIBERS: process.env.NEXT_PUBLIC_COLLECTION_SUBSCRIBERS || '',
        MESSAGES: process.env.NEXT_PUBLIC_COLLECTION_MESSAGES || '',
    },
    BUCKETS: {
        IMAGES: 'images',
        ALBUM_COVERS: 'album-covers',
        TEAM: 'team',
    },
};

export const client = new Client()
    .setEndpoint(PROJECT_CONFIG.ENDPOINT)
    .setProject(PROJECT_CONFIG.PROJECT_ID);

export const account = new Account(client);
export const teams = new Teams(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

/**
 * Subscribe to real-time changes in a collection
 * @param collectionId The collection ID to subscribe to
 * @param callback Function to handle the real-time event
 * @returns Unsubscribe function
 */
export function subscribeToCollection(collectionId: string, callback: (response: RealtimeResponseEvent<any>) => void) {
    return client.subscribe(
        `databases.${PROJECT_CONFIG.DATABASE_ID}.collections.${collectionId}.documents`,
        callback
    );
}

/**
 * Get optimized image preview URL
 * @param fileId The file ID
 * @param width Optional width
 * @param height Optional height
 * @param bucketId Optional bucket ID (defaults to IMAGES)
 * @returns The image URL
 */
export function getPreviewUrl(fileId: string, width?: number, height?: number, bucketId?: string) {
    try {
        if (!fileId) return '';
        // If it's already a URL, return it
        if (fileId.startsWith('http')) return fileId;

        return storage.getFilePreview(
            bucketId || PROJECT_CONFIG.BUCKETS.IMAGES,
            fileId,
            width,
            height
        ).href;
    } catch (error) {
        console.error('Error getting preview URL:', error);
        return '';
    }
}

// Export config for convenience
export const { DATABASE_ID, COLLECTIONS, BUCKETS } = PROJECT_CONFIG;
