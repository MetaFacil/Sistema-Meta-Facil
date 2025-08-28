// Fallback para openai quando não instalado
let OpenAI: any;
try {
  OpenAI = require('openai').default;
} catch (error) {
  // Mock da classe OpenAI quando a dependência não está instalada
  OpenAI = class {
    constructor(config: any) {
      console.warn('OpenAI SDK not installed. Using mock implementation.');
    }
    
    chat = {
      completions: {
        create: async (params: any) => {
          console.warn('Mock OpenAI response');
          return {
            choices: [{
              message: {
                content: 'Este é um conteúdo de exemplo gerado pelo sistema mock. Instale a dependência openai para usar a funcionalidade real.'
              }
            }],
            usage: {
              total_tokens: 100
            }
          };
        }
      }
    };
  };
}

interface OpenAIConfig {
  apiKey: string;
  model?: string;
}

interface ContentGenerationParams {
  type: 'POST' | 'STORY' | 'REEL' | 'TELEGRAM_MESSAGE';
  category: 'EDUCATIONAL' | 'PROMOTIONAL' | 'ANALYSIS' | 'NEWS' | 'SIGNAL';
  platform: 'INSTAGRAM' | 'FACEBOOK' | 'TELEGRAM';
  topic?: string;
  keywords?: string[];
  tone?: 'professional' | 'casual' | 'urgent' | 'educational';
  maxLength?: number;
}

interface HashtagSuggestionParams {
  content: string;
  platform: 'INSTAGRAM' | 'FACEBOOK' | 'TELEGRAM';
  niche: string;
  maxHashtags?: number;
}

interface ContentOptimizationParams {
  content: string;
  platform: 'INSTAGRAM' | 'FACEBOOK' | 'TELEGRAM';
  objective: 'engagement' | 'reach' | 'conversion';
}

interface MarketAnalysisParams {
  pair: string; // e.g., 'EUR/USD'
  timeframe: string; // e.g., '1h', '4h', '1d'
  analysisType: 'technical' | 'fundamental' | 'both';
}

class OpenAIService {
  private client: any;
  private model: string;

  constructor(config: OpenAIConfig) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
    });
    this.model = config.model || 'gpt-4-turbo-preview';
  }

  async generateContent(params: ContentGenerationParams): Promise<string> {
    const {
      type,
      category,
      platform,
      topic,
      keywords = [],
      tone = 'professional',
      maxLength = 280
    } = params;

    const platformInstructions = {
      INSTAGRAM: 'para Instagram, incluindo emojis relevantes e call-to-action',
      FACEBOOK: 'para Facebook, mais conversacional e detalhado',
      TELEGRAM: 'para Telegram, direto e informativo'
    };

    const categoryInstructions = {
      EDUCATIONAL: 'conteúdo educacional sobre trading e opções binárias',
      PROMOTIONAL: 'conteúdo promocional para serviços de trading',
      ANALYSIS: 'análise técnica ou fundamental de mercado',
      NEWS: 'notícias relevantes para traders',
      SIGNAL: 'sinal de trading com entrada, stop loss e take profit'
    };

    const prompt = `
    Crie um ${type.toLowerCase()} ${categoryInstructions[category]} ${platformInstructions[platform]}.
    
    Especificações:
    - Tom: ${tone}
    - Tópico: ${topic || 'trading e opções binárias'}
    - Palavras-chave: ${keywords.join(', ')}
    - Limite de caracteres: ${maxLength}
    - Público-alvo: traders iniciantes e intermediários interessados em opções binárias
    
    Diretrizes importantes:
    - Use linguagem clara e acessível
    - Inclua valor educacional
    - Evite promessas de ganho garantido
    - Mencione riscos quando relevante
    - Seja específico e actionável
    ${platform === 'INSTAGRAM' ? '- Inclua 3-5 hashtags relevantes' : ''}
    ${category === 'SIGNAL' ? '- Inclua: par de moedas, direção, entrada, stop loss, take profit, timeframe' : ''}
    
    Conteúdo:
    `;

    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em marketing digital para o nicho de opções binárias e trading. Crie conteúdo envolvente, educacional e responsável.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Erro ao gerar conteúdo:', error);
      throw new Error('Falha na geração de conteúdo');
    }
  }

  async generateHashtags(params: HashtagSuggestionParams): Promise<string[]> {
    const { content, platform, niche, maxHashtags = 10 } = params;

    const prompt = `
    Sugira ${maxHashtags} hashtags relevantes para o seguinte conteúdo sobre ${niche} na plataforma ${platform}:
    
    Conteúdo: "${content}"
    
    Diretrizes:
    - Hashtags populares no nicho de opções binárias e trading
    - Mix de hashtags populares e específicas
    - Relevantes para o conteúdo específico
    - Adequadas para a plataforma ${platform}
    
    Retorne apenas as hashtags separadas por vírgula, sem numeração.
    `;

    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em hashtags para marketing digital no nicho de trading e opções binárias.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.5
      });

      const hashtagsText = completion.choices[0]?.message?.content || '';
      return hashtagsText
        .split(',')
        .map((tag: string) => tag.trim().replace('#', ''))
        .filter((tag: string) => tag.length > 0)
        .slice(0, maxHashtags);
    } catch (error) {
      console.error('Erro ao gerar hashtags:', error);
      throw new Error('Falha na geração de hashtags');
    }
  }

  async optimizeContent(params: ContentOptimizationParams): Promise<string> {
    const { content, platform, objective } = params;

    const objectiveInstructions = {
      engagement: 'maximize o engajamento (likes, comentários, compartilhamentos)',
      reach: 'maximize o alcance e visibilidade',
      conversion: 'maximize conversões e cliques no call-to-action'
    };

    const prompt = `
    Otimize o seguinte conteúdo para ${platform} com foco em ${objectiveInstructions[objective]}:
    
    Conteúdo original: "${content}"
    
    Diretrizes de otimização:
    - Mantenha a mensagem principal
    - Melhore a estrutura e fluidez
    - Adicione elementos que aumentem ${objective}
    - Use técnicas de copywriting eficazes
    - Mantenha o tom profissional mas envolvente
    ${platform === 'INSTAGRAM' ? '- Otimize para Stories e Feed' : ''}
    ${objective === 'engagement' ? '- Inclua perguntas ou CTAs para comentários' : ''}
    ${objective === 'conversion' ? '- Fortaleça o call-to-action' : ''}
    
    Retorne apenas o conteúdo otimizado.
    `;

    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em copywriting e otimização de conteúdo para redes sociais no nicho de trading.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.6
      });

      return completion.choices[0]?.message?.content || content;
    } catch (error) {
      console.error('Erro ao otimizar conteúdo:', error);
      throw new Error('Falha na otimização de conteúdo');
    }
  }

  async generateMarketAnalysis(params: MarketAnalysisParams): Promise<string> {
    const { pair, timeframe, analysisType } = params;

    const prompt = `
    Crie uma análise ${analysisType} para o par ${pair} no timeframe ${timeframe}.
    
    ${analysisType === 'technical' || analysisType === 'both' ? `
    Análise Técnica deve incluir:
    - Principais níveis de suporte e resistência
    - Padrões gráficos identificados
    - Indicadores técnicos relevantes (RSI, MACD, Médias Móveis)
    - Possíveis cenários de preço
    ` : ''}
    
    ${analysisType === 'fundamental' || analysisType === 'both' ? `
    Análise Fundamental deve incluir:
    - Eventos econômicos relevantes
    - Fatores que podem impactar o par
    - Sentimento de mercado atual
    ` : ''}
    
    Diretrizes:
    - Linguagem acessível para traders iniciantes e intermediários
    - Inclua disclaimers sobre riscos
    - Seja específico mas não dê garantias
    - Foque em educação e insights valiosos
    
    Formato para redes sociais (máximo 300 palavras).
    `;

    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'Você é um analista experiente de mercados financeiros especializado em forex e opções binárias.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 600,
        temperature: 0.5
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Erro ao gerar análise de mercado:', error);
      throw new Error('Falha na geração de análise de mercado');
    }
  }

  async generatePostIdeas(topic: string, platform: string, count: number = 5): Promise<string[]> {
    const prompt = `
    Gere ${count} ideias criativas de posts sobre ${topic} para ${platform} no nicho de opções binárias e trading.
    
    Cada ideia deve ser:
    - Única e envolvente
    - Educacional ou valiosa para traders
    - Adequada para a plataforma ${platform}
    - Focada em construir autoridade e engajamento
    
    Formate como uma lista numerada com títulos chamativos.
    `;

    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'Você é um criador de conteúdo especializado em marketing digital para o mercado financeiro.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 400,
        temperature: 0.8
      });

      const ideas = completion.choices[0]?.message?.content || '';
      return ideas
        .split('\n')
        .filter((line: string) => line.match(/^\d+\./))
        .map((line: string) => line.replace(/^\d+\.\s*/, '').trim())
        .filter((idea: string) => idea.length > 0);
    } catch (error) {
      console.error('Erro ao gerar ideias de posts:', error);
      throw new Error('Falha na geração de ideias');
    }
  }
}

export { OpenAIService };
export type {
  ContentGenerationParams,
  HashtagSuggestionParams,
  ContentOptimizationParams,
  MarketAnalysisParams
};