import { NextRequest, NextResponse } from 'next/server';
import { databases, DATABASE_ID } from '@/lib/database';

const COLLECTION_ID = 'gallery_albums';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        const document = await databases.getDocument(
            DATABASE_ID,
            COLLECTION_ID,
            id
        );

        return NextResponse.json({
            album: document
        });
    } catch (error: any) {
        console.error('Error fetching gallery album:', error);

        if (error.code === 404) {
            return NextResponse.json(
                { error: 'Album not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to fetch gallery album', details: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();

        const {
            name,
            description,
            date,
            category,
            photoIds,
            coverPhotoId,
            eventLink,
            photographerName,
            isPublished,
            order
        } = body;

        const updateData: any = {};

        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (date !== undefined) updateData.date = date;
        if (category !== undefined) updateData.category = category;
        if (photoIds !== undefined) updateData.photoIds = photoIds;
        if (coverPhotoId !== undefined) updateData.coverPhotoId = coverPhotoId;
        if (eventLink !== undefined) updateData.eventLink = eventLink;
        if (photographerName !== undefined) updateData.photographerName = photographerName;
        if (isPublished !== undefined) updateData.isPublished = isPublished;
        if (order !== undefined) updateData.order = order;

        const document = await databases.updateDocument(
            DATABASE_ID,
            COLLECTION_ID,
            id,
            updateData
        );

        return NextResponse.json({
            success: true,
            album: document
        });
    } catch (error: any) {
        console.error('Error updating gallery album:', error);

        if (error.code === 404) {
            return NextResponse.json(
                { error: 'Album not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to update gallery album', details: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        await databases.deleteDocument(
            DATABASE_ID,
            COLLECTION_ID,
            id
        );

        return NextResponse.json({
            success: true,
            message: 'Album deleted successfully'
        });
    } catch (error: any) {
        console.error('Error deleting gallery album:', error);

        if (error.code === 404) {
            return NextResponse.json(
                { error: 'Album not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to delete gallery album', details: error.message },
            { status: 500 }
        );
    }
}
