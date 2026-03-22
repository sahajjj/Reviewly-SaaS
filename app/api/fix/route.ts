import { NextRequest, NextResponse } from 'next/server';
import { fixCode } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const { code, language, review } = await req.json();

    if (!code || !language || !review) {
      return NextResponse.json({ success: false, error: 'Missing required parameters' }, { status: 400 });
    }

    const isDemoMode = process.env.AI_PROVIDER === 'demo' || (!process.env.OPENAI_API_KEY && !process.env.GEMINI_API_KEY && !process.env.HUGGINGFACE_API_KEY && process.env.AI_PROVIDER !== 'ollama');

    if (isDemoMode) {
      // Return a simulated fixed code for demo purposes
      let mockFixed = code;
      if (typeof code === 'string') {
          mockFixed = code.replace(/let\b/g, 'const').replace(/\/\/ Add a null check\n?/, '');
          if (!mockFixed.includes('if (')) {
            mockFixed = `// Added recommended fixes\n${mockFixed}`;
          }
      }
      return NextResponse.json({ success: true, fixedCode: mockFixed, isDemo: true });
    }

    const fixedCode = await fixCode(code, language, review);

    return NextResponse.json({
      success: true,
      fixedCode,
    });
  } catch (error: any) {
    console.error('Fix Code API Error:', error);
    const msg = error.message || '';
    let userMessage = 'Failed to generate fixed code. Please try again.';
    if (msg.includes('quota') || msg.includes('rate') || msg.includes('429')) {
      userMessage = 'Rate limit hit — please wait a few seconds and try again.';
    } else if (msg.includes('Ollama error')) {
      userMessage = 'Ollama is not running. Please start the Ollama desktop application.';
    }
    return NextResponse.json(
      { success: false, error: userMessage },
      { status: 500 }
    );
  }
}
