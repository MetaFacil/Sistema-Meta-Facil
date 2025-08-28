import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAIService } from '@/lib/ai/ai-service';
import { z } from 'zod';

const optimizeContentSchema = z.object({
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  platform: z.enum(['INSTAGRAM', 'FACEBOOK', 'TELEGRAM']),
  objective: z.enum(['engagement', 'reach', 'conversion']),
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
    const validatedData = optimizeContentSchema.parse(body);

    // Get AI service
    const aiService = getAIService();

    // Optimize content
    const result = await aiService.optimizeContent(validatedData);

    return NextResponse.json({
      success: true,
      data: {
        originalContent: validatedData.content,
        optimizedContent: result.optimizedContent,
        provider: result.provider,
        improvements: result.improvements,
        optimization: {
          objective: validatedData.objective,
          platform: validatedData.platform
        },
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error optimizing content:', error);

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