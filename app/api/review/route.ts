import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCodeReview } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { code, language } = await req.json();

    if (!code || !language) {
      return NextResponse.json({ success: false, error: 'Missing code or language' }, { status: 400 });
    }

    const isDemoMode = !process.env.OPENAI_API_KEY && !process.env.GEMINI_API_KEY;

    // @ts-ignore
    const userId = session.user.id;

    if (isDemoMode) {
      const mockData = {
        bugs: [
          { title: 'Potential Null Pointer', explanation: 'Variable might be null before access.', severity: 'high', fix: '// Add a null check\nif (variable) { ... }' }
        ],
        improvements: [
          { title: 'Use Const', explanation: 'Use const instead of let for immutable variables.', severity: 'low', fix: 'const x = 1;' }
        ],
        security: [
          { title: 'Insecure Input', explanation: 'User input is used without sanitization.', severity: 'medium', fix: 'sanitize(input)' }
        ],
        complexity: [
          { title: 'High Cyclomatic Complexity', explanation: 'This function has too many nested loops.', severity: 'medium' }
        ]
      };
      let reviewId = null;
      try {
        await dbConnect();
        const review = await Review.create({
          code,
          language,
          response: {
            bugs: mockData.bugs || [],
            improvements: mockData.improvements || [],
            security: mockData.security || [],
            complexity: mockData.complexity || []
          },
          userId
        });
        reviewId = review._id;
      } catch (e) {
        console.error('Failed to save demo review to DB:', e);
      }
      return NextResponse.json({ success: true, data: mockData, isDemo: true, id: reviewId });
    }

    await dbConnect();
    const reviewData = await getCodeReview(code, language);

    let reviewId = null;
    try {
      const savedReview = await Review.create({
        code,
        language,
        response: {
          bugs: reviewData.bugs || [],
          improvements: reviewData.improvements || [],
          security: reviewData.security || [],
          complexity: reviewData.complexity || []
        },
        userId
      });
      reviewId = savedReview._id;
    } catch (dbError) {
      console.error('Failed to save review to DB:', dbError);
    }

    return NextResponse.json({
      success: true,
      data: reviewData,
      id: reviewId,
    });
  } catch (error: any) {
    console.error('Review API Error:', error);
    if (error.status) console.error('Status:', error.status);
    if (error.response) console.error('Response Data:', error.response.data || await error.response.text().catch(()=>null));
    const msg = error.message || error.toString() || '';
    let userMessage = 'Something went wrong. Please try again.';
    if (msg.includes('quota') || msg.includes('rate') || msg.includes('429') || msg.includes('Quota')) {
      userMessage = 'Rate limit hit — please wait a few seconds and try again.';
    } else if (msg.includes('API key') || msg.includes('401') || msg.includes('403')) {
      userMessage = 'Invalid API key. Check your .env configuration.';
    }
    return NextResponse.json(
      { success: false, error: userMessage, details: msg },
      { status: 500 }
    );
  }
}
