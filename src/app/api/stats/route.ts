import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [total, easy, medium, hard] = await Promise.all([
      db.problem.count(),
      db.problem.count({ where: { difficulty: 'EASY' } }),
      db.problem.count({ where: { difficulty: 'MEDIUM' } }),
      db.problem.count({ where: { difficulty: 'HARD' } }),
    ]);

    // Get topic distribution
    const topicDistribution = await db.problem.groupBy({
      by: ['topic'],
      _count: {
        id: true,
      },
    });

    const topics = topicDistribution.reduce((acc, item) => {
      acc[item.topic] = item._count.id;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      total,
      easy,
      medium,
      hard,
      topics,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
