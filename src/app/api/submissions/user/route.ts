import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const submissions = await db.submission.findMany({
      where: {
        userId: user.id,
      },
      include: {
        problem: {
          select: {
            id: true,
            title: true,
            slug: true,
            difficulty: true,
            topic: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    // Get unique solved problems
    const solvedProblems = await db.submission.findMany({
      where: {
        userId: user.id,
        status: 'ACCEPTED',
      },
      select: {
        problemId: true,
        problem: {
          select: {
            id: true,
            title: true,
            slug: true,
            difficulty: true,
            topic: true,
          },
        },
      },
      distinct: ['problemId'],
    });

    return NextResponse.json({
      submissions,
      solvedProblems,
      totalSubmissions: submissions.length,
      totalSolved: solvedProblems.length,
    });
  } catch (error) {
    console.error('Get user submissions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
