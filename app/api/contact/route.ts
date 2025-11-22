import { NextResponse } from 'next/server';
import { Client, Databases, ID } from 'node-appwrite';
import { PROJECT_CONFIG } from '@/lib/appwrite';

export async function POST(request: Request) {
    try {
        const { name, email, subject, message } = await request.json();

        // Basic validation
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Initialize Admin Client (Guest/Client SDK might not have permissions if we locked it down, 
        // but we set Role.any() for create, so Client SDK would work too. 
        // However, for API routes, using Node SDK with API Key is safer/more robust.)

        // Actually, let's use the API Key for backend operations to ensure reliability
        const client = new Client()
            .setEndpoint(PROJECT_CONFIG.ENDPOINT!)
            .setProject(PROJECT_CONFIG.PROJECT_ID!)
            .setKey(process.env.APPWRITE_API_KEY!);

        const databases = new Databases(client);

        const response = await databases.createDocument(
            PROJECT_CONFIG.DATABASE_ID!,
            PROJECT_CONFIG.COLLECTIONS.MESSAGES!,
            ID.unique(),
            {
                name,
                email,
                subject,
                message,
                status: 'unread',
                createdAt: new Date().toISOString(),
            }
        );

        return NextResponse.json({ success: true, id: response.$id });
    } catch (error: any) {
        console.error('Contact API Error:', error);
        return NextResponse.json(
            { error: 'Failed to send message' },
            { status: 500 }
        );
    }
}
