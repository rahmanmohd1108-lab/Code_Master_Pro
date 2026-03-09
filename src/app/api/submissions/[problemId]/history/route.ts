import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ problemId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { problemId } = await params;

    // Get all submissions for this problem by the user
    const submissions = await db.submission.findMany({
      where: {
        userId: user.id,
        problemId,
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        code: true,
        language: true,
        status: true,
        runtime: true,
        memory: true,
        createdAt: true,
      },
    });

    // Get the latest accepted submission for each language
    const latestByLanguage: Record<string, typeof submissions[0]> = {};
    for (const sub of submissions) {
      if (!latestByLanguage[sub.language] || sub.status === 'ACCEPTED') {
        latestByLanguage[sub.language] = sub;
      }
    }

    return NextResponse.json({
      submissions,
      latestByLanguage,
      hasAccepted: submissions.some(s => s.status === 'ACCEPTED'),
    });
  } catch (error) {
    console.error('Get submission history error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
