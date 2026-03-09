import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { SubmissionStatus } from '@prisma/client';

// Simulate code execution
function simulateExecution(code: string, language: string, testCases: any[]) {
  // This is a simulation - in real app, you'd use a sandboxed environment
  const hasSyntax = !code.includes('Your code here');
  const hasLogic = code.length > 100;

  if (!hasSyntax) {
    return {
      status: SubmissionStatus.COMPILATION_ERROR,
      message: 'Please implement the solution',
      results: [],
    };
  }

  // Simulate some test results
  const passedCount = hasLogic ? testCases.length : Math.floor(testCases.length / 2);
  
  if (passedCount === testCases.length) {
    return {
      status: SubmissionStatus.ACCEPTED,
      message: 'All test cases passed!',
      results: testCases.map((tc, i) => ({
        testCase: i + 1,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: tc.expectedOutput,
        passed: true,
        runtime: Math.floor(Math.random() * 100) + 1,
        memory: Math.floor(Math.random() * 10) + 5,
      })),
      runtime: Math.floor(Math.random() * 100) + 1,
      memory: Math.floor(Math.random() * 10) + 5,
    };
  } else {
    return {
      status: SubmissionStatus.WRONG_ANSWER,
      message: `${passedCount}/${testCases.length} test cases passed`,
      results: testCases.map((tc, i) => ({
        testCase: i + 1,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: i < passedCount ? tc.expectedOutput : 'wrong output',
        passed: i < passedCount,
      })),
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { problemId, code, language } = body;

    if (!problemId || !code || !language) {
      return NextResponse.json(
        { error: 'Problem ID, code, and language are required' },
        { status: 400 }
      );
    }

    // Get problem and test cases
    const problem = await db.problem.findUnique({
      where: { id: problemId },
      include: { testCases: true },
    });

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    // Simulate code execution
    const result = simulateExecution(code, language, problem.testCases);

    // Create submission
    const submission = await db.submission.create({
      data: {
        userId: user.id,
        problemId,
        code,
        language,
        status: result.status,
        runtime: result.runtime || null,
        memory: result.memory || null,
      },
    });

    // Update user stats if accepted
    if (result.status === SubmissionStatus.ACCEPTED) {
      // Check if this is the first accepted submission for this problem
      const existingAccepted = await db.submission.findFirst({
        where: {
          userId: user.id,
          problemId,
          status: SubmissionStatus.ACCEPTED,
          id: { not: submission.id },
        },
      });

      if (!existingAccepted) {
        // Update total solved
        await db.user.update({
          where: { id: user.id },
          data: { totalSolved: { increment: 1 } },
        });

        // Update topic progress
        const progress = await db.userProgress.findUnique({
          where: {
            userId_topic: {
              userId: user.id,
              topic: problem.topic,
            },
          },
        });

        if (progress) {
          await db.userProgress.update({
            where: { id: progress.id },
            data: { solved: { increment: 1 } },
          });
        } else {
          // Count total problems in this topic
          const totalInTopic = await db.problem.count({
            where: { topic: problem.topic },
          });
          await db.userProgress.create({
            data: {
              userId: user.id,
              topic: problem.topic,
              solved: 1,
              total: totalInTopic,
            },
          });
        }

        // Update streak
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const activity = await db.userActivity.findUnique({
          where: {
            userId_date: {
              userId: user.id,
              date: today,
            },
          },
        });

        if (activity) {
          await db.userActivity.update({
            where: { id: activity.id },
            data: { count: { increment: 1 } },
          });
        } else {
          await db.userActivity.create({
            data: {
              userId: user.id,
              date: today,
              count: 1,
            },
          });

          // Check streak
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          
          const yesterdayActivity = await db.userActivity.findUnique({
            where: {
              userId_date: {
                userId: user.id,
                date: yesterday,
              },
            },
          });

          if (yesterdayActivity) {
            await db.user.update({
              where: { id: user.id },
              data: { streakCount: { increment: 1 } },
            });
          }
        }
      }
    }

    return NextResponse.json({
      submissionId: submission.id,
      ...result,
    });
  } catch (error) {
    console.error('Submit code error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
