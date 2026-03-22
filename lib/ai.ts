import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { HfInference } from '@huggingface/inference';

export type ReviewResponse = {
  bugs: Array<{ title: string; explanation: string; severity: 'low' | 'medium' | 'high'; fix: string }>;
  improvements: Array<{ title: string; explanation: string; severity: 'low' | 'medium' | 'high'; fix: string }>;
  security: Array<{ title: string; explanation: string; severity: 'low' | 'medium' | 'high'; fix: string }>;
  complexity: Array<{ title: string; explanation: string; severity: 'low' | 'medium' | 'high' }>;
};

// Retry helper with exponential backoff for rate-limited API calls
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3, baseDelay = 2000): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      const msg = (error.message || error.toString()).toLowerCase();
      const isRateLimit = msg.includes('429') || msg.includes('rate') || msg.includes('quota') || msg.includes('resource has been exhausted');
      
      if (isRateLimit && attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt); // 2s, 4s, 8s
        console.warn(`Rate limited (attempt ${attempt + 1}/${maxRetries + 1}). Retrying in ${delay / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
}

const SYSTEM_PROMPT = `
You are a senior software engineer performing a strict professional code review.

Return ONLY valid JSON in this exact structure:
{
  "bugs": [],
  "improvements": [],
  "security": [],
  "complexity": []
}

Each item in bugs, improvements, and security must include:
- title
- explanation
- severity (low | medium | high)
- fix (code snippet if applicable)

Each item in complexity must include:
- title
- explanation
- severity (low | medium | high)

Be precise, avoid fluff, and do not include any text outside JSON.
`;

export async function getCodeReview(code: string, language: string): Promise<ReviewResponse> {
  const provider = process.env.AI_PROVIDER || 'huggingface';

  if (provider === 'openai') {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Language: ${language}\n\nCode:\n${code}` },
      ],
      response_format: { type: 'json_object' },
    });
    return JSON.parse(response.choices[0].message.content || '{}');

  } else if (provider === 'gemini') {
    return withRetry(async () => {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
      const model = genAI.getGenerativeModel({
        model: process.env.GEMINI_MODEL || 'gemini-2.0-flash-lite',
        generationConfig: { responseMimeType: 'application/json' }
      });
      const prompt = `${SYSTEM_PROMPT}\n\nLanguage: ${language}\n\nCode:\n${code}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return JSON.parse(response.text());
    });
    
  } else if (provider === 'huggingface') {
    return withRetry(async () => {
      const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
      const res = await hf.chatCompletion({
        model: process.env.HUGGINGFACE_MODEL || 'Qwen/Qwen2.5-Coder-32B-Instruct',
        messages: [
           { role: 'system', content: SYSTEM_PROMPT + '\nYou must respond ONLY with the raw JSON object, starting with { and ending with }.' },
           { role: 'user', content: `Language: ${language}\n\nCode:\n${code}` }
        ],
        max_tokens: 2000,
      });
      
      let text = res.choices[0].message.content || '{}';
      // Clean up potential markdown formatting from open source models
      text = text.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '').trim();
      const firstBrace = text.indexOf('{');
      const lastBrace = text.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
         text = text.substring(firstBrace, lastBrace + 1);
      }
      return JSON.parse(text);
    });

  } else if (provider === 'ollama') {
    const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
    const ollamaModel = process.env.OLLAMA_MODEL || 'llama3.2:3b';

    const response = await fetch(`${ollamaUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: ollamaModel,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Language: ${language}\n\nCode:\n${code}` },
        ],
        format: 'json',
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status} — is Ollama running?`);
    }

    const data = await response.json();
    return JSON.parse(data.message.content);
  }

  throw new Error(`Unsupported AI provider: ${provider}`);
}

const FIX_SYSTEM_PROMPT = `
You are an elite senior software engineer. Your task is to completely rewrite the original code by cleanly applying absolutely ALL of the provided code review bugs, security issues, and improvements.

CRITICAL INSTRUCTIONS:
1. You MUST fix every single issue listed. Do not leave any bugs behind.
2. Return the ENTIRE modified file. Do not truncate it or use comments like "// rest of code".
3. Return ONLY the raw complete code. Do NOT wrap it in markdown block quotes (\`\`\`). Do NOT include any conversational text or explanations. Your output must begin with the first character of the code and end with the last character.
`;

export async function fixCode(code: string, language: string, review: any): Promise<string> {
  const provider = process.env.AI_PROVIDER || 'huggingface';
  const promptText = `Language: ${language}\n\nOriginal Code:\n${code}\n\nReview Suggestions to Apply:\n${JSON.stringify(review, null, 2)}`;

  if (provider === 'openai') {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        { role: 'system', content: FIX_SYSTEM_PROMPT },
        { role: 'user', content: promptText },
      ],
    });
    return response.choices[0].message.content?.replace(/^```[a-z]*\n?/, '')?.replace(/\n?```$/, '')?.trim() || code;

  } else if (provider === 'gemini') {
    return withRetry(async () => {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
      const model = genAI.getGenerativeModel({
        model: process.env.GEMINI_MODEL || 'gemini-2.0-flash-lite',
      });
      const prompt = `${FIX_SYSTEM_PROMPT}\n\n${promptText}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '').trim();
    });
    
  } else if (provider === 'huggingface') {
    return withRetry(async () => {
      const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
      const res = await hf.chatCompletion({
        model: process.env.HUGGINGFACE_MODEL || 'Qwen/Qwen2.5-Coder-32B-Instruct',
        messages: [
           { role: 'system', content: FIX_SYSTEM_PROMPT },
           { role: 'user', content: promptText }
        ],
        max_tokens: 2500,
      });
      
      let text = res.choices[0].message.content || code;
      const match = text.match(/```[a-zA-Z]*\n([\s\S]*?)```/);
      if (match) {
        return match[1].trim();
      }
      return text.replace(/^```[a-zA-Z]*\n?/, '').replace(/\n?```$/, '').trim();
    });

  } else if (provider === 'ollama') {
    const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
    const ollamaModel = process.env.OLLAMA_MODEL || 'llama3.2:3b';

    const response = await fetch(`${ollamaUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: ollamaModel,
        messages: [
          { role: 'system', content: FIX_SYSTEM_PROMPT },
          { role: 'user', content: promptText },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status} — is Ollama running?`);
    }

    const data = await response.json();
    return data.message.content.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '').trim();
  }

  throw new Error(`Unsupported AI provider: ${provider}`);
}
