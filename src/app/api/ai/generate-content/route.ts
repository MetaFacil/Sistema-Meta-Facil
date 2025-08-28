import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAIService } from '@/lib/ai/ai-service';
import { z } from 'zod';

const generateContentSchema = z.object({
  type: z.enum(['POST', 'STORY', 'REEL', 'TELEGRAM_MESSAGE']),
  category: z.enum(['EDUCATIONAL', 'PROMOTIONAL', 'ANALYSIS', 'NEWS', 'SIGNAL']),
  platform: z.enum(['INSTAGRAM', 'FACEBOOK', 'TELEGRAM']),
  topic: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  tone: z.enum(['professional', 'casual', 'urgent', 'educational']).optional(),
  maxLength: z.number().optional(),
  provider: z.enum(['openai', 'claude']).optional()
});

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = generateContentSchema.parse(body);

    // Get AI service
    const aiService = getAIService();

    // Generate content
    const result = await aiService.generateContent(validatedData);

    return NextResponse.json({
      success: true,
      data: {
        content: result.content,
        provider: result.provider,
        metadata: result.metadata,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error generating content:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}