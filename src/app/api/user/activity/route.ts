import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get activity for the last 365 days
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const activities = await db.userActivity.findMany({
      where: {
        userId: user.id,
        date: { gte: oneYearAgo },
      },
      orderBy: { date: 'asc' },
    });

    // Format for heatmap
    const activityMap = activities.reduce((acc, activity) => {
      const dateStr = activity.date.toISOString().split('T')[0];
      acc[dateStr] = activity.count;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      activities: activityMap,
      streakCount: user.streakCount,
    });
  } catch (error) {
    console.error('Get user activity error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
