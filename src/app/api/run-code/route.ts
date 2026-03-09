import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Extract function name and parameters from code
function extractFunctionInfo(code: string, language: string): { functionName: string; params: string[] } | null {
  try {
    if (language === 'javascript') {
      // Match function name
      const funcMatch = code.match(/function\s+(\w+)\s*\(([^)]*)\)/);
      if (funcMatch) {
        return {
          functionName: funcMatch[1],
          params: funcMatch[2].split(',').map(p => p.trim().split(':')[0].trim()).filter(Boolean),
        };
      }
      // Match arrow function
      const arrowMatch = code.match(/(?:const|let|var)\s+(\w+)\s*=\s*(?:\([^)]*\)|[^=])*=>/);
      if (arrowMatch) {
        return { functionName: arrowMatch[1], params: [] };
      }
    } else if (language === 'python') {
      const funcMatch = code.match(/def\s+(\w+)\s*\(([^)]*)\)/);
      if (funcMatch) {
        return {
          functionName: funcMatch[1],
          params: funcMatch[2].split(',').map(p => p.trim().split(':')[0].trim()).filter(Boolean),
        };
      }
    } else if (language === 'java') {
      const funcMatch = code.match(/public\s+\w+\s+(\w+)\s*\(([^)]*)\)/);
      if (funcMatch) {
        return {
          functionName: funcMatch[1],
          params: funcMatch[2].split(',').map(p => p.trim().split(' ').pop()).filter(Boolean),
        };
      }
    }
  } catch (e) {
    console.error('Error extracting function info:', e);
  }
  return null;
}

// Simulate code execution with better logic
function simulateRun(code: string, language: string, testCases: any[]): {
  success: boolean;
  error?: string;
  results: any[];
  summary: { passed: number; total: number; allPassed: boolean };
} {
  // Check if code is actually written (not just starter code)
  const hasStarterComment = code.includes('Your code here') || code.includes('// Write your code');
  const codeLines = code.split('\n').filter(line => line.trim() && !line.trim().startsWith('//') && !line.trim().startsWith('*')).length;
  const hasActualCode = codeLines > 5 && !hasStarterComment;
  
  if (!hasActualCode) {
    return {
      success: false,
      error: 'Please implement the solution before running. Write your code logic.',
      results: [],
      summary: { passed: 0, total: 0, allPassed: false },
    };
  }

  // Check for basic syntax patterns
  const hasReturn = code.includes('return ') || code.includes('print(') || code.includes('System.out');
  const funcInfo = extractFunctionInfo(code, language);
  
  if (!hasReturn && language !== 'python') {
    return {
      success: false,
      error: 'Your function should return a value. Make sure to include a return statement.',
      results: [],
      summary: { passed: 0, total: 0, allPassed: false },
    };
  }

  // Simulate execution results based on code complexity
  const codeComplexity = code.length + (funcInfo ? 50 : 0);
  const passRate = Math.min(1, codeComplexity / 300);
  
  const results = testCases.slice(0, 3).map((tc, i) => {
    // More realistic simulation - longer code tends to pass more
    const passed = Math.random() < passRate;
    return {
      testCase: i + 1,
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      actualOutput: passed ? tc.expectedOutput : `different_output_${i + 1}`,
      passed,
      executionTime: Math.floor(Math.random() * 80) + 5,
    };
  });

  const allPassed = results.every(r => r.passed);
  const passedCount = results.filter(r => r.passed).length;

  return {
    success: true,
    results,
    summary: {
      passed: passedCount,
      total: results.length,
      allPassed,
    },
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { problemId, code, language } = body;

    if (!problemId || !code) {
      return NextResponse.json(
        { error: 'Problem ID and code are required' },
        { status: 400 }
      );
    }

    if (code.trim().length < 20) {
      return NextResponse.json(
        { error: 'Please write more code before running' },
        { status: 400 }
      );
    }

    // Get problem and visible test cases
    const problem = await db.problem.findUnique({
      where: { id: problemId },
      include: {
        testCases: {
          where: { isHidden: false },
          take: 5,
        },
      },
    });

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    const result = simulateRun(code, language, problem.testCases);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Run code error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
