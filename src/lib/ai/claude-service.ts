// Fallback para @anthropic-ai/sdk quando não instalado
let Anthropic: any;
try {
  Anthropic = require('@anthropic-ai/sdk').default;
} catch (error) {
  // Mock da classe Anthropic quando a dependência não está instalada
  Anthropic = class {
    constructor(config: any) {
      console.warn('Anthropic SDK not installed. Using mock implementation.');
    }
    
    messages = {
      create: async (params: any) => {
        console.warn('Mock Anthropic response');
        return {
          content: [{
            type: 'text',
            text: 'Este é um conteúdo de exemplo gerado pelo sistema mock. Instale @anthropic-ai/sdk para usar a funcionalidade real.'
          }]
        };
      }
    };
  };
}

interface ClaudeConfig {
  apiKey: string;
  model?: string;
}

interface ContentRequest {
  type: 'POST' | 'STORY' | 'REEL' | 'TELEGRAM_MESSAGE';
  category: 'EDUCATIONAL' | 'PROMOTIONAL' | 'ANALYSIS' | 'NEWS' | 'SIGNAL';
  platform: 'INSTAGRAM' | 'FACEBOOK' | 'TELEGRAM';
  topic?: string;
  keywords?: string[];
  tone?: 'professional' | 'casual' | 'urgent' | 'educational';
  maxLength?: number;
}

class ClaudeService {
  private client: any;
  private model: string;

  constructor(config: ClaudeConfig) {
    this.client = new Anthropic({
      apiKey: config.apiKey,
    });
    this.model = config.model || 'claude-3-haiku-20240307';
  }

  async generateContent(params: ContentRequest): Promise<string> {
    const {
      type,
      category,
      platform,
      topic = 'trading e opções binárias',
      keywords = [],
      tone = 'professional',
      maxLength = 280
    } = params;

    const systemPrompt = `Você é um especialista em marketing digital e criação de conteúdo para o nicho de opções binárias e trading. 
    
    Suas responsabilidades:
    - Criar conteúdo educacional e responsável
    - Evitar promessas de ganho garantido
    - Sempre mencionar riscos quando relevante
    - Usar linguagem clara e acessível
    - Focar em valor educacional`;

    const userPrompt = `Crie um ${type.toLowerCase()} para ${platform} na categoria ${category}.

    Especificações:
    - Tópico: ${topic}
    - Tom: ${tone}
    - Palavras-chave: ${keywords.join(', ')}
    - Limite de caracteres: ${maxLength}
    - Público-alvo: traders iniciantes e intermediários

    ${platform === 'INSTAGRAM' ? 'Inclua emojis relevantes e hashtags.' : ''}
    ${platform === 'FACEBOOK' ? 'Seja mais conversacional e detalhado.' : ''}
    ${platform === 'TELEGRAM' ? 'Seja direto e informativo.' : ''}
    
    ${category === 'SIGNAL' ? 'Para sinais, inclua: par, direção, entrada, stop loss, take profit, timeframe.' : ''}`;

    try {
      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: 500,
        temperature: 0.7,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ]
      });

      return message.content[0]?.type === 'text' ? message.content[0].text : '';
    } catch (error) {
      console.error('Erro ao gerar conteúdo com Claude:', error);
      throw new Error('Falha na geração de conteúdo');
    }
  }

  async improveCopywriting(content: string, objective: 'engagement' | 'conversion' | 'education'): Promise<string> {
    const systemPrompt = `Você é um especialista em copywriting para o mercado financeiro, especialmente opções binárias e forex.`;

    const objectives = {
      engagement: 'maximizar engajamento (likes, comentários, compartilhamentos)',
      conversion: 'maximizar conversões e cliques no call-to-action',
      education: 'maximizar o valor educacional e autoridade'
    };

    const userPrompt = `Melhore o seguinte conteúdo para ${objectives[objective]}:

    "${content}"

    Diretrizes:
    - Mantenha a mensagem principal
    - Use técnicas de copywriting eficazes
    - Torne mais envolvente e persuasivo
    - Mantenha responsabilidade e ética
    ${objective === 'engagement' ? '- Adicione elementos que incentivem interação' : ''}
    ${objective === 'conversion' ? '- Fortaleça o call-to-action' : ''}
    ${objective === 'education' ? '- Adicione mais valor educacional' : ''}`;

    try {
      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: 600,
        temperature: 0.6,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ]
      });

      return message.content[0]?.type === 'text' ? message.content[0].text : content;
    } catch (error) {
      console.error('Erro ao melhorar copywriting:', error);
      throw new Error('Falha na melhoria do conteúdo');
    }
  }

  async generateMarketInsight(pair: string, timeframe: string): Promise<string> {
    const systemPrompt = `Você é um analista experiente de mercados financeiros com foco em forex e opções binárias. 
    Forneça insights educacionais e responsáveis, sempre mencionando riscos.`;

    const userPrompt = `Crie um insight de mercado para ${pair} no timeframe ${timeframe}.

    Inclua:
    - Análise técnica básica
    - Fatores fundamentais relevantes
    - Possíveis cenários
    - Disclaimers sobre riscos
    - Linguagem acessível

    Formato: post para redes sociais (máximo 250 palavras)`;

    try {
      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: 500,
        temperature: 0.5,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ]
      });

      return message.content[0]?.type === 'text' ? message.content[0].text : '';
    } catch (error) {
      console.error('Erro ao gerar insight de mercado:', error);
      throw new Error('Falha na geração de insight');
    }
  }

  async generateHashtagSuggestions(content: string, platform: string, count: number = 10): Promise<string[]> {
    const systemPrompt = `Você é um especialista em hashtags para marketing digital no nicho de trading e opções binárias.`;

    const userPrompt = `Sugira ${count} hashtags relevantes para este conteúdo na plataforma ${platform}:

    "${content}"

    Critérios:
    - Relevantes ao conteúdo
    - Populares no nicho de trading
    - Mix de hashtags populares e específicas
    - Adequadas para ${platform}

    Retorne apenas as hashtags separadas por vírgula, sem o símbolo #.`;

    try {
      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: 200,
        temperature: 0.5,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ]
      });

      const hashtagsText = message.content[0]?.type === 'text' ? message.content[0].text : '';
      return hashtagsText
        .split(',')
        .map((tag: string) => tag.trim().replace('#', ''))
        .filter((tag: string) => tag.length > 0)
        .slice(0, count);
    } catch (error) {
      console.error('Erro ao gerar hashtags:', error);
      return [];
    }
  }

  async brainstormContentIdeas(topic: string, platform: string, count: number = 5): Promise<string[]> {
    const systemPrompt = `Você é um criador de conteúdo especializado em marketing para o mercado financeiro.`;

    const userPrompt = `Gere ${count} ideias criativas de conteúdo sobre ${topic} para ${platform}.

    Cada ideia deve ser:
    - Educacional e valiosa
    - Envolvente para o público
    - Adequada para ${platform}
    - Focada em autoridade e engajamento

    Formate como lista numerada com títulos chamativos.`;

    try {
      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: 400,
        temperature: 0.8,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ]
      });

      const ideasText = message.content[0]?.type === 'text' ? message.content[0].text : '';
      return ideasText
        .split('\n')
        .filter((line: string) => line.match(/^\d+\./))
        .map((line: string) => line.replace(/^\d+\.\s*/, '').trim())
        .filter((idea: string) => idea.length > 0);
    } catch (error) {
      console.error('Erro ao gerar ideias:', error);
      return [];
    }
  }
}

export { ClaudeService };
export type { ContentRequest };