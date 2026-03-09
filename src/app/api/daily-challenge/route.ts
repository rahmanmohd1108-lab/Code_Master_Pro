import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if there's already a daily challenge for today
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
          },
        },
      },
    });

    // If no challenge for today, create one
    if (!dailyChallenge) {
      // Get a random problem
      const problemCount = await db.problem.count();
      const randomSkip = Math.floor(Math.random() * problemCount);

      const randomProblem = await db.problem.findFirst({
        skip: randomSkip,
        include: {
          companies: {
            include: {
              company: true,
            },
          },
        },
      });

      if (randomProblem) {
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
              },
            },
          },
        });
      }
    }

    if (!dailyChallenge) {
      return NextResponse.json({ error: 'No daily challenge available' }, { status: 404 });
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
        companies: dailyChallenge.problem.companies.map(c => ({
          name: c.company.name,
          slug: c.company.slug,
          frequency: c.frequency,
        })),
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
