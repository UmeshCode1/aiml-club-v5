import { NextRequest, NextResponse } from 'next/server';
import { databases, DATABASE_ID } from '@/lib/database';
import { Query } from 'node-appwrite';

const COLLECTION_ID = 'gallery_albums';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const published = searchParams.get('published');

        const queries = [];

        // Filter by category if provided
        if (category && category !== 'all') {
            queries.push(Query.equal('category', category));
        }

        // Filter by published status (default to true for public)
        if (published !== 'false') {
            queries.push(Query.equal('isPublished', true));
        }

        // Order by date (newest first)
        queries.push(Query.orderDesc('date'));

        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            queries
        );

        return NextResponse.json({
            albums: response.documents,
            total: response.total
        });
    } catch (error: any) {
        console.error('Error fetching gallery albums:', error);
        return NextResponse.json(
            { error: 'Failed to fetch gallery albums', details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
            name,
            description,
            date,
            category,
            photoIds = [],
            coverPhotoId,
            eventLink,
            photographerName,
            isPublished = true,
            order = 0
        } = body;

        // Validation
        if (!name || !date || !category) {
            return NextResponse.json(
                { error: 'Missing required fields: name, date, category' },
                { status: 400 }
            );
        }

        const document = await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID,
            'unique()',
            {
                name,
                description: description || '',
                date,
                category,
                photoIds,
                coverPhotoId: coverPhotoId || (photoIds.length > 0 ? photoIds[0] : ''),
                eventLink: eventLink || '',
                photographerName: photographerName || '',
                isPublished,
                order
            }
        );

        return NextResponse.json({
            success: true,
            album: document
        }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating gallery album:', error);
        return NextResponse.json(
            { error: 'Failed to create gallery album', details: error.message },
            { status: 500 }
        );
    }
}
