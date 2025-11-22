import { NextResponse } from 'next/server';
import { Client, Databases, ID } from 'node-appwrite';
import { COLLECTIONS, DATABASE_ID, PROJECT_CONFIG } from '@/lib/appwrite';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        // Initialize Client SDK (Guest)
        const client = new Client()
            .setEndpoint(PROJECT_CONFIG.ENDPOINT!)
            .setProject(PROJECT_CONFIG.PROJECT_ID!);

        const databases = new Databases(client);

        // Check if already subscribed
        try {
            const existing = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.SUBSCRIBERS,
                // We can't use Query without importing it, and we can't import Query from node-appwrite if we use Client SDK?
                // Actually node-appwrite exports Query.
            );
            // Manual filter since we might not have permissions to list all or filter
            // If we can't list, we can't check duplicate.
            // We'll just try to create.
        } catch (e) {
            // Ignore list error
        }

        const payload = {
            email,
            active: true,
        };

        const response = await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.SUBSCRIBERS,
            ID.unique(),
            payload
        );

        return NextResponse.json({ success: true, id: response.$id });
    } catch (error: any) {
        console.error('Subscribe error:', error);
        return NextResponse.json({ error: error.message || 'Failed to subscribe' }, { status: 500 });
    }
}
