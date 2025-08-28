'use client';

import { useState } from 'react';
import { Platform, ContentCategory } from '@/types';

export interface AIRequest {
  prompt: string;
  type: 'content' | 'hashtags' | 'optimization' | 'analysis';
  platform?: Platform;
  category?: ContentCategory;
  context?: Record<string, any>;
}

export interface AIResponse {
  content?: string;
  hashtags?: string[];
  optimization?: {
    originalContent: string;
    optimizedContent: string;
    improvements: string[];
    score: number;
  };
  analysis?: {
    marketTrend: string;
    recommendations: string[];
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  };
  provider: 'openai' | 'claude';
  tokensUsed: number;
}

export interface MarketAnalysis {
  pair: string;
  trend: 'BULLISH' | 'BEARISH' | 'SIDEWAYS';
  confidence: number;
  timeframe: '1H' | '4H' | '1D' | '1W';
  keyLevels: {
    support: number[];
    resistance: number[];
  };
  technicalIndicators: {
    rsi: number;
    macd: string;
    movingAverages: {
      ma20: number;
      ma50: number;
      ma200: number;
    };
  };
  recommendation: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateContent = async (request: AIRequest): Promise<{ success: boolean; data?: AIResponse; error?: string }> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar conteúdo');
      }

      const data = await response.json();
      return { success: true, data: data.data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao gerar conteúdo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const generateHashtags = async (content: string, platform: Platform): Promise<{ success: boolean; hashtags?: string[]; error?: string }> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/generate-hashtags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, platform }),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar hashtags');
      }

      const data = await response.json();
      return { success: true, hashtags: data.data.hashtags };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao gerar hashtags';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const optimizeContent = async (
    content: string, 
    platform: Platform, 
    objective: 'engagement' | 'reach' | 'conversion'
  ): Promise<{ success: boolean; data?: AIResponse['optimization']; error?: string }> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/optimize-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, platform, objective }),
      });

      if (!response.ok) {
        throw new Error('Erro ao otimizar conteúdo');
      }

      const data = await response.json();
      return { success: true, data: data.data.optimization };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao otimizar conteúdo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const analyzeMarket = async (pair: string, timeframe: string): Promise<{ success: boolean; analysis?: MarketAnalysis; error?: string }> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/market-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pair, timeframe }),
      });

      if (!response.ok) {
        throw new Error('Erro ao analisar mercado');
      }

      const data = await response.json();
      return { success: true, analysis: data.data.analysis };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao analisar mercado';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const generateContentIdeas = async (
    category: ContentCategory, 
    targetAudience: string
  ): Promise<{ success: boolean; ideas?: string[]; error?: string }> => {
    setLoading(true);
    setError(null);

    try {
      const prompt = `Gere 5 ideias de conteúdo para ${category} direcionado para ${targetAudience} sobre opções binárias`;
      
      const result = await generateContent({
        prompt,
        type: 'content',
        category,
      });

      if (result.success && result.data?.content) {
        // Parse the content into ideas
        const ideas = result.data.content
          .split('\n')
          .filter(line => line.trim().length > 0)
          .slice(0, 5);
        
        return { success: true, ideas };
      }

      throw new Error('Erro ao gerar ideias de conteúdo');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao gerar ideias';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const chatWithAssistant = async (message: string, context?: Record<string, any>): Promise<{ success: boolean; response?: string; error?: string }> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, context }),
      });

      if (!response.ok) {
        throw new Error('Erro ao conversar com assistente');
      }

      const data = await response.json();
      return { success: true, response: data.data.response };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao conversar com assistente';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    generateContent,
    generateHashtags,
    optimizeContent,
    analyzeMarket,
    generateContentIdeas,
    chatWithAssistant,
    clearError: () => setError(null),
  };
}