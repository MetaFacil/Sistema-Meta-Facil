import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAIService } from '@/lib/ai/ai-service';
import { z } from 'zod';

const generateHashtagsSchema = z.object({
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  platform: z.enum(['INSTAGRAM', 'FACEBOOK', 'TELEGRAM']),
  maxHashtags: z.number().min(1).max(30).optional(),
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
    const validatedData = generateHashtagsSchema.parse(body);

    // Get AI service
    const aiService = getAIService();

    // Generate hashtags
    const result = await aiService.generateHashtags({
      content: validatedData.content,
      platform: validatedData.platform,
      maxHashtags: validatedData.maxHashtags || 10,
      provider: validatedData.provider
    });

    return NextResponse.json({
      success: true,
      data: {
        hashtags: result.hashtags,
        provider: result.provider,
        count: result.hashtags.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error generating hashtags:', error);

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