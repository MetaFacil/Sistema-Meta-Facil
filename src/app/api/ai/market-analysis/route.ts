import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAIService } from '@/lib/ai/ai-service';
import { z } from 'zod';

const generateAnalysisSchema = z.object({
  pair: z.string().min(1, 'Par de moedas é obrigatório'),
  timeframe: z.string().min(1, 'Timeframe é obrigatório'),
  analysisType: z.enum(['technical', 'fundamental', 'both']).optional(),
  provider: z.enum(['openai', 'claude']).optional()
});

const commonCurrencyPairs = [
  'EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD', 'USD/CAD', 'NZD/USD',
  'EUR/GBP', 'EUR/JPY', 'GBP/JPY', 'CHF/JPY', 'AUD/JPY', 'CAD/JPY', 'NZD/JPY',
  'EUR/CHF', 'GBP/CHF', 'AUD/CHF', 'CAD/CHF', 'NZD/CHF'
];

const commonTimeframes = ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w', '1M'];

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
    const validatedData = generateAnalysisSchema.parse(body);

    // Validate currency pair format
    if (!commonCurrencyPairs.includes(validatedData.pair.toUpperCase())) {
      return NextResponse.json(
        { 
          error: 'Par de moedas não suportado',
          supportedPairs: commonCurrencyPairs
        },
        { status: 400 }
      );
    }

    // Validate timeframe
    if (!commonTimeframes.includes(validatedData.timeframe.toLowerCase())) {
      return NextResponse.json(
        { 
          error: 'Timeframe não suportado',
          supportedTimeframes: commonTimeframes
        },
        { status: 400 }
      );
    }

    // Get AI service
    const aiService = getAIService();

    // Generate market analysis
    const result = await aiService.generateMarketAnalysis({
      pair: validatedData.pair.toUpperCase(),
      timeframe: validatedData.timeframe.toLowerCase(),
      analysisType: validatedData.analysisType || 'both',
      provider: validatedData.provider
    });

    return NextResponse.json({
      success: true,
      data: {
        analysis: result.analysis,
        provider: result.provider,
        marketData: {
          pair: validatedData.pair.toUpperCase(),
          timeframe: validatedData.timeframe.toLowerCase(),
          analysisType: validatedData.analysisType || 'both'
        },
        disclaimer: 'Esta análise é apenas para fins educacionais. Trading envolve riscos significativos de perda.',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error generating market analysis:', error);

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

export async function GET() {
  return NextResponse.json({
    supportedPairs: commonCurrencyPairs,
    supportedTimeframes: commonTimeframes,
    analysisTypes: ['technical', 'fundamental', 'both'],
    providers: ['openai', 'claude']
  });
}