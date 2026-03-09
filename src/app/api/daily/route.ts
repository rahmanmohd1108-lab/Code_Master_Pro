import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let dailyChallenge = await db.dailyChallenge.findFirst({
      where: {
        date: today,
      },
      include: {
        problem: {
          include: {
            companies: {
              include: {
                company: true,
              },
            },
            _count: {
              select: { submissions: true },
            },
          },
        },
      },
    });

    // If no challenge for today, create one
    if (!dailyChallenge) {
      const problems = await db.problem.findMany();
      const randomProblem = problems[Math.floor(Math.random() * problems.length)];

      dailyChallenge = await db.dailyChallenge.create({
        data: {
          problemId: randomProblem.id,
          date: today,
        },
        include: {
          problem: {
            include: {
              companies: {
                include: {
                  company: true,
                },
              },
              _count: {
                select: { submissions: true },
              },
            },
          },
        },
      });
    }

    return NextResponse.json({
      date: dailyChallenge.date,
      problem: {
        id: dailyChallenge.problem.id,
        title: dailyChallenge.problem.title,
        slug: dailyChallenge.problem.slug,
        difficulty: dailyChallenge.problem.difficulty,
        topic: dailyChallenge.problem.topic,
        acceptance: dailyChallenge.problem.acceptance,
        description: dailyChallenge.problem.description,
        examples: JSON.parse(dailyChallenge.problem.examples),
        companies: dailyChallenge.problem.companies.map((c) => ({
          name: c.company.name,
          slug: c.company.slug,
        })),
        submissionCount: dailyChallenge.problem._count.submissions,
      },
    });
  } catch (error) {
    console.error('Get daily challenge error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
