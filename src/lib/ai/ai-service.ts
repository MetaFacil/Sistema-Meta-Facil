import { OpenAIService, ContentGenerationParams } from './openai-service';
import { ClaudeService, ContentRequest } from './claude-service';

type AIProvider = 'openai' | 'claude';

interface AIServiceConfig {
  defaultProvider?: AIProvider;
  openai?: {
    apiKey: string;
    model?: string;
  };
  claude?: {
    apiKey: string;
    model?: string;
  };
}

interface GenerateContentOptions extends ContentGenerationParams {
  provider?: AIProvider;
}

interface OptimizeContentOptions {
  content: string;
  platform: 'INSTAGRAM' | 'FACEBOOK' | 'TELEGRAM';
  objective: 'engagement' | 'reach' | 'conversion';
  provider?: AIProvider;
}

interface GenerateHashtagsOptions {
  content: string;
  platform: 'INSTAGRAM' | 'FACEBOOK' | 'TELEGRAM';
  maxHashtags?: number;
  provider?: AIProvider;
}

interface GenerateIdeasOptions {
  topic: string;
  platform: string;
  count?: number;
  provider?: AIProvider;
}

interface MarketAnalysisOptions {
  pair: string;
  timeframe: string;
  analysisType?: 'technical' | 'fundamental' | 'both';
  provider?: AIProvider;
}

class AIService {
  private openaiService?: OpenAIService;
  private claudeService?: ClaudeService;
  private defaultProvider: AIProvider;

  constructor(config: AIServiceConfig) {
    this.defaultProvider = config.defaultProvider || 'openai';

    if (config.openai) {
      this.openaiService = new OpenAIService(config.openai);
    }

    if (config.claude) {
      this.claudeService = new ClaudeService(config.claude);
    }

    // Ensure at least one provider is configured
    if (!this.openaiService && !this.claudeService) {
      throw new Error('Pelo menos um provedor de IA deve ser configurado');
    }
  }

  private getProvider(provider?: AIProvider): AIProvider {
    const selectedProvider = provider || this.defaultProvider;
    
    if (selectedProvider === 'openai' && !this.openaiService) {
      if (this.claudeService) return 'claude';
      throw new Error('Provedor OpenAI não configurado');
    }
    
    if (selectedProvider === 'claude' && !this.claudeService) {
      if (this.openaiService) return 'openai';
      throw new Error('Provedor Claude não configurado');
    }
    
    return selectedProvider;
  }

  async generateContent(options: GenerateContentOptions): Promise<{
    content: string;
    provider: AIProvider;
    metadata: {
      wordCount: number;
      characterCount: number;
      estimatedReadTime: number;
    }
  }> {
    const provider = this.getProvider(options.provider);
    let content = '';

    try {
      if (provider === 'openai' && this.openaiService) {
        content = await this.openaiService.generateContent(options);
      } else if (provider === 'claude' && this.claudeService) {
        const claudeParams: ContentRequest = {
          type: options.type,
          category: options.category,
          platform: options.platform,
          topic: options.topic,
          keywords: options.keywords,
          tone: options.tone,
          maxLength: options.maxLength
        };
        content = await this.claudeService.generateContent(claudeParams);
      }

      const wordCount = content.split(/\\s+/).length;
      const characterCount = content.length;
      const estimatedReadTime = Math.ceil(wordCount / 200); // 200 words per minute

      return {
        content,
        provider,
        metadata: {
          wordCount,
          characterCount,
          estimatedReadTime
        }
      };
    } catch (error) {
      console.error(`Erro ao gerar conteúdo com ${provider}:`, error);
      
      // Try fallback provider
      const fallbackProvider = provider === 'openai' ? 'claude' : 'openai';
      if ((fallbackProvider === 'openai' && this.openaiService) || 
          (fallbackProvider === 'claude' && this.claudeService)) {
        return this.generateContent({ ...options, provider: fallbackProvider });
      }
      
      throw error;
    }
  }

  async optimizeContent(options: OptimizeContentOptions): Promise<{
    optimizedContent: string;
    provider: AIProvider;
    improvements: string[];
  }> {
    const provider = this.getProvider(options.provider);
    let optimizedContent = '';
    const improvements: string[] = [];

    try {
      if (provider === 'openai' && this.openaiService) {
        optimizedContent = await this.openaiService.optimizeContent({
          content: options.content,
          platform: options.platform,
          objective: options.objective === 'reach' ? 'engagement' : options.objective
        });
      } else if (provider === 'claude' && this.claudeService) {
        const objective = options.objective === 'reach' ? 'engagement' : 
                        options.objective === 'conversion' ? 'conversion' : 'education';
        optimizedContent = await this.claudeService.improveCopywriting(options.content, objective);
      }

      // Analyze improvements (basic analysis)
      const originalLength = options.content.length;
      const optimizedLength = optimizedContent.length;
      
      if (optimizedLength > originalLength) {
        improvements.push('Conteúdo expandido com mais detalhes');
      }
      if (optimizedContent.includes('?')) {
        improvements.push('Adicionadas perguntas para engajamento');
      }
      if (optimizedContent.includes('!')) {
        improvements.push('Adicionado tom mais persuasivo');
      }

      return {
        optimizedContent,
        provider,
        improvements
      };
    } catch (error) {
      console.error(`Erro ao otimizar conteúdo com ${provider}:`, error);
      throw error;
    }
  }

  async generateHashtags(options: GenerateHashtagsOptions): Promise<{
    hashtags: string[];
    provider: AIProvider;
  }> {
    const provider = this.getProvider(options.provider);
    let hashtags: string[] = [];

    try {
      if (provider === 'openai' && this.openaiService) {
        hashtags = await this.openaiService.generateHashtags({
          content: options.content,
          platform: options.platform,
          niche: 'opções binárias',
          maxHashtags: options.maxHashtags || 10
        });
      } else if (provider === 'claude' && this.claudeService) {
        hashtags = await this.claudeService.generateHashtagSuggestions(
          options.content,
          options.platform,
          options.maxHashtags || 10
        );
      }

      return {
        hashtags: hashtags.map(tag => tag.startsWith('#') ? tag : `#${tag}`),
        provider
      };
    } catch (error) {
      console.error(`Erro ao gerar hashtags com ${provider}:`, error);
      throw error;
    }
  }

  async generateContentIdeas(options: GenerateIdeasOptions): Promise<{
    ideas: string[];
    provider: AIProvider;
  }> {
    const provider = this.getProvider(options.provider);
    let ideas: string[] = [];

    try {
      if (provider === 'openai' && this.openaiService) {
        ideas = await this.openaiService.generatePostIdeas(
          options.topic,
          options.platform,
          options.count || 5
        );
      } else if (provider === 'claude' && this.claudeService) {
        ideas = await this.claudeService.brainstormContentIdeas(
          options.topic,
          options.platform,
          options.count || 5
        );
      }

      return {
        ideas,
        provider
      };
    } catch (error) {
      console.error(`Erro ao gerar ideias com ${provider}:`, error);
      throw error;
    }
  }

  async generateMarketAnalysis(options: MarketAnalysisOptions): Promise<{
    analysis: string;
    provider: AIProvider;
  }> {
    const provider = this.getProvider(options.provider);
    let analysis = '';

    try {
      if (provider === 'openai' && this.openaiService) {
        analysis = await this.openaiService.generateMarketAnalysis({
          pair: options.pair,
          timeframe: options.timeframe,
          analysisType: options.analysisType || 'both'
        });
      } else if (provider === 'claude' && this.claudeService) {
        analysis = await this.claudeService.generateMarketInsight(
          options.pair,
          options.timeframe
        );
      }

      return {
        analysis,
        provider
      };
    } catch (error) {
      console.error(`Erro ao gerar análise de mercado com ${provider}:`, error);
      throw error;
    }
  }

  async getProviderStatus(): Promise<{
    openai: boolean;
    claude: boolean;
    default: AIProvider;
  }> {
    return {
      openai: !!this.openaiService,
      claude: !!this.claudeService,
      default: this.defaultProvider
    };
  }

  switchDefaultProvider(provider: AIProvider): void {
    if (provider === 'openai' && !this.openaiService) {
      throw new Error('OpenAI não está configurado');
    }
    if (provider === 'claude' && !this.claudeService) {
      throw new Error('Claude não está configurado');
    }
    
    this.defaultProvider = provider;
  }
}

// Singleton instance
let aiServiceInstance: AIService | null = null;

export function createAIService(config: AIServiceConfig): AIService {
  aiServiceInstance = new AIService(config);
  return aiServiceInstance;
}

export function getAIService(): AIService {
  if (!aiServiceInstance) {
    throw new Error('Serviço de IA não foi inicializado. Chame createAIService primeiro.');
  }
  return aiServiceInstance;
}

export { AIService };
export type {
  AIProvider,
  AIServiceConfig,
  GenerateContentOptions,
  OptimizeContentOptions,
  GenerateHashtagsOptions,
  GenerateIdeasOptions,
  MarketAnalysisOptions
};