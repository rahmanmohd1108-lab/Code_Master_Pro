import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Difficulty, Topic } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get('topic') as Topic | null;
    const difficulty = searchParams.get('difficulty') as Difficulty | null;
    const company = searchParams.get('company');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = {};

    if (topic) {
      where.topic = topic;
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (company) {
      where.companies = {
        some: {
          company: {
            slug: company,
          },
        },
      };
    }

    const [problems, total] = await Promise.all([
      db.problem.findMany({
        where,
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
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.problem.count({ where }),
    ]);

    return NextResponse.json({
      problems: problems.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        difficulty: p.difficulty,
        topic: p.topic,
        acceptance: p.acceptance,
        frequency: p.frequency,
        companies: p.companies.map((c) => ({
          name: c.company.name,
          slug: c.company.slug,
          frequency: c.frequency,
        })),
        submissionCount: p._count.submissions,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get problems error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
