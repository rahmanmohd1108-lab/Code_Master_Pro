import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const problem = await db.problem.findUnique({
      where: { slug },
      include: {
        testCases: {
          where: { isHidden: false },
        },
        companies: {
          include: {
            company: true,
          },
        },
        _count: {
          select: { submissions: true },
        },
      },
    });

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    return NextResponse.json({
      problem: {
        ...problem,
        examples: JSON.parse(problem.examples),
        starterCode: JSON.parse(problem.starterCode),
        hints: problem.hints ? JSON.parse(problem.hints) : null,
        constraints: problem.constraints.split('\n'),
        companies: problem.companies.map((c) => ({
          name: c.company.name,
          slug: c.company.slug,
          frequency: c.frequency,
        })),
        submissionCount: problem._count.submissions,
      },
    });
  } catch (error) {
    console.error('Get problem error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
