import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const company = await db.company.findUnique({
      where: { slug },
      include: {
        problems: {
          include: {
            problem: {
              include: {
                _count: {
                  select: { submissions: true },
                },
              },
            },
          },
          orderBy: { frequency: 'desc' },
        },
      },
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const problems = company.problems.map((p) => ({
      id: p.problem.id,
      title: p.problem.title,
      slug: p.problem.slug,
      difficulty: p.problem.difficulty,
      topic: p.problem.topic,
      acceptance: p.problem.acceptance,
      frequency: p.frequency,
      lastAsked: p.lastAsked,
      submissionCount: p.problem._count.submissions,
    }));

    return NextResponse.json({
      company: {
        id: company.id,
        name: company.name,
        slug: company.slug,
        logo: company.logo,
        problemCount: problems.length,
        problems: problems,
      },
    });
  } catch (error) {
    console.error('Get company problems error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
