import { NextResponse } from 'next/server';
import { teamService, storageService, BUCKETS } from '@/lib/database';

export async function GET() {
  try {
    const response = await teamService.list();

    const members = response.documents.map((member: any) => {
      let imageUrl = null;
      if (member.photo) {
        try {
          // Get view URL for full quality, or preview for optimized
          imageUrl = storageService.getFileView(BUCKETS.TEAM_FILES, member.photo).href;
        } catch (e) {
          console.error(`Error generating image URL for member ${member.name}:`, e);
        }
      }
      return { ...member, imageUrl };
    });

    return NextResponse.json({ members });
  } catch (error: any) {
    console.error('Team API error:', error);
    return NextResponse.json({
      members: [],
      error: error.message || 'Failed to fetch team members'
    }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
