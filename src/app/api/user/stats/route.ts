import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { SubmissionStatus } from '@prisma/client';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get user progress by topic
    const progress = await db.userProgress.findMany({
      where: { userId: user.id },
    });

    // Get submission stats
    const submissions = await db.submission.groupBy({
      by: ['status'],
      where: { userId: user.id },
      _count: true,
    });

    const acceptedCount = submissions.find((s) => s.status === SubmissionStatus.ACCEPTED)?._count || 0;
    const totalSubmissions = submissions.reduce((acc, s) => acc + s._count, 0);

    // Get recent submissions
    const recentSubmissions = await db.submission.findMany({
      where: { userId: user.id },
      include: {
        problem: {
          select: { title: true, slug: true, difficulty: true, topic: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Get difficulty breakdown
    const solvedProblems = await db.submission.findMany({
      where: {
        userId: user.id,
        status: SubmissionStatus.ACCEPTED,
      },
      select: { problemId: true },
      distinct: ['problemId'],
    });

    const solvedProblemIds = solvedProblems.map((s) => s.problemId);

    const difficultyBreakdown = await db.problem.groupBy({
      by: ['difficulty'],
      where: { id: { in: solvedProblemIds } },
      _count: true,
    });

    // Get total problems per difficulty
    const totalByDifficulty = await db.problem.groupBy({
      by: ['difficulty'],
      _count: true,
    });

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        streakCount: user.streakCount,
        totalSolved: user.totalSolved,
        lastActive: user.lastActive,
        createdAt: user.createdAt,
      },
      progress,
      submissions: {
        total: totalSubmissions,
        accepted: acceptedCount,
        acceptanceRate: totalSubmissions > 0 ? (acceptedCount / totalSubmissions) * 100 : 0,
      },
      recentSubmissions: recentSubmissions.map((s) => ({
        id: s.id,
        problem: s.problem,
        language: s.language,
        status: s.status,
        runtime: s.runtime,
        memory: s.memory,
        createdAt: s.createdAt,
      })),
      difficultyBreakdown: difficultyBreakdown.map((d) => ({
        difficulty: d.difficulty,
        solved: d._count,
        total: totalByDifficulty.find((t) => t.difficulty === d.difficulty)?._count || 0,
      })),
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
