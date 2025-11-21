import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/appwrite';
import { ID, InputFile } from 'node-appwrite';

const BUCKET_ID = 'gallery';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const albumName = formData.get('albumName') as string;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Convert File to Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate file ID
        const fileId = ID.unique();

        // Upload to Appwrite
        const uploadedFile = await storage.createFile(
            BUCKET_ID,
            fileId,
            InputFile.fromBuffer(buffer, file.name)
        );

        // Get file URL
        const fileUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${uploadedFile.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;

        return NextResponse.json({
            success: true,
            fileId: uploadedFile.$id,
            fileName: file.name,
            fileUrl
        });
    } catch (error: any) {
        console.error('Error uploading file:', error);
        return NextResponse.json(
            { error: 'Failed to upload file', details: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const fileId = searchParams.get('fileId');

        if (!fileId) {
            return NextResponse.json(
                { error: 'No file ID provided' },
                { status: 400 }
            );
        }

        await storage.deleteFile(BUCKET_ID, fileId);

        return NextResponse.json({
            success: true,
            message: 'File deleted successfully'
        });
    } catch (error: any) {
        console.error('Error deleting file:', error);
        return NextResponse.json(
            { error: 'Failed to delete file', details: error.message },
            { status: 500 }
        );
    }
}
