// Configurações da aplicação
export const APP_CONFIG = {
  name: 'Meta Fácil',
  description: 'Marketing Completo para Opções Binárias',
  version: '1.0.0',
  author: 'Meta Fácil Team',
  website: 'https://metafacil.com',
  supportEmail: 'suporte@metafacil.com',
};

// Configurações de plataformas
export const PLATFORMS = {
  INSTAGRAM: {
    name: 'Instagram',
    color: '#E4405F',
    icon: 'Instagram',
    maxCharacters: 2200,
    maxHashtags: 30,
    supportedMediaTypes: ['image', 'video'],
    maxFileSize: 100, // MB
  },
  FACEBOOK: {
    name: 'Facebook',
    color: '#1877F2',
    icon: 'Facebook',
    maxCharacters: 63206,
    maxHashtags: 20,
    supportedMediaTypes: ['image', 'video', 'document'],
    maxFileSize: 200, // MB
  },
  TELEGRAM: {
    name: 'Telegram',
    color: '#0088CC',
    icon: 'Send',
    maxCharacters: 4096,
    maxHashtags: 5,
    supportedMediaTypes: ['image', 'video', 'document', 'audio'],
    maxFileSize: 50, // MB
  },
} as const;

// Categorias de conteúdo
export const CONTENT_CATEGORIES = {
  EDUCATIONAL: {
    name: 'Educativo',
    color: 'blue',
    description: 'Conteúdo educacional sobre trading e opções binárias',
  },
  PROMOTIONAL: {
    name: 'Promocional',
    color: 'red',
    description: 'Promoções, ofertas e call-to-actions',
  },
  ANALYSIS: {
    name: 'Análise',
    color: 'purple',
    description: 'Análises técnicas e fundamentalistas',
  },
  NEWS: {
    name: 'Notícias',
    color: 'green',
    description: 'Notícias do mercado financeiro',
  },
  SIGNAL: {
    name: 'Sinal',
    color: 'yellow',
    description: 'Sinais de trading e oportunidades',
  },
  ENTERTAINMENT: {
    name: 'Entretenimento',
    color: 'pink',
    description: 'Conteúdo de entretenimento relacionado ao trading',
  },
} as const;

// Status de conteúdo
export const CONTENT_STATUS = {
  DRAFT: {
    name: 'Rascunho',
    color: 'gray',
    description: 'Conteúdo em desenvolvimento',
  },
  SCHEDULED: {
    name: 'Agendado',
    color: 'blue',
    description: 'Agendado para publicação',
  },
  PUBLISHED: {
    name: 'Publicado',
    color: 'green',
    description: 'Publicado com sucesso',
  },
  ARCHIVED: {
    name: 'Arquivado',
    color: 'orange',
    description: 'Conteúdo arquivado',
  },
  FAILED: {
    name: 'Falhou',
    color: 'red',
    description: 'Falha na publicação',
  },
} as const;

// Configurações de IA
export const AI_CONFIG = {
  models: {
    GPT4: {
      name: 'GPT-4',
      provider: 'OpenAI',
      maxTokens: 8192,
      temperature: 0.7,
    },
    GPT3_5: {
      name: 'GPT-3.5 Turbo',
      provider: 'OpenAI',
      maxTokens: 4096,
      temperature: 0.7,
    },
    CLAUDE: {
      name: 'Claude 3',
      provider: 'Anthropic',
      maxTokens: 8192,
      temperature: 0.7,
    },
  },
  prompts: {
    contentGeneration: `Você é um especialista em marketing digital para opções binárias. 
    Crie conteúdo educativo, profissional e persuasivo que seja adequado para {platform}.
    Foque em: análise técnica, gerenciamento de risco e psicologia do trader.
    Tom: {tone}
    Categoria: {category}
    Público-alvo: Traders e investidores brasileiros`,
    
    hashtagSuggestion: `Sugira hashtags relevantes para opções binárias e trading.
    Plataforma: {platform}
    Categoria: {category}
    Máximo: {maxHashtags} hashtags
    Foque em hashtags populares e específicas do nicho brasileiro`,
    
    captionOptimization: `Otimize este texto para {platform}:
    "{content}"
    
    Melhore para aumentar engajamento, mantendo o tom profissional.
    Adicione call-to-action apropriado.
    Limite de caracteres: {maxCharacters}`,
  },
};

// Configurações de API
export const API_LIMITS = {
  META: {
    daily: 200,
    hourly: 25,
    burst: 5,
  },
  TELEGRAM: {
    daily: 1000,
    hourly: 30,
    burst: 10,
  },
  AI: {
    daily: 100,
    hourly: 10,
    burst: 3,
  },
};

// URLs e endpoints
export const API_ENDPOINTS = {
  META: {
    baseUrl: 'https://graph.facebook.com/v18.0',
    auth: '/oauth/access_token',
    pages: '/me/accounts',
    posts: '/{page-id}/feed',
    media: '/{page-id}/photos',
    insights: '/{post-id}/insights',
  },
  TELEGRAM: {
    baseUrl: 'https://api.telegram.org/bot',
    sendMessage: '/sendMessage',
    sendPhoto: '/sendPhoto',
    sendDocument: '/sendDocument',
    sendVideo: '/sendVideo',
  },
};

// Configurações de notificação
export const NOTIFICATION_TYPES = {
  POST_PUBLISHED: 'post_published',
  CAMPAIGN_STARTED: 'campaign_started',
  CAMPAIGN_ENDED: 'campaign_ended',
  QUOTA_WARNING: 'quota_warning',
  QUOTA_EXCEEDED: 'quota_exceeded',
  SYSTEM_ALERT: 'system_alert',
};

// Configurações de assinatura
export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'Gratuito',
    price: 0,
    features: [
      '5 posts por mês',
      '1 plataforma conectada',
      'Suporte por email',
      'Analytics básicos',
    ],
    limits: {
      postsPerMonth: 5,
      platforms: 1,
      aiRequests: 10,
      storage: 100, // MB
    },
  },
  PREMIUM: {
    name: 'Premium',
    price: 97,
    features: [
      'Posts ilimitados',
      '3 plataformas conectadas',
      'IA avançada',
      'Analytics completos',
      'Suporte prioritário',
      'Agendamento avançado',
    ],
    limits: {
      postsPerMonth: -1, // ilimitado
      platforms: 3,
      aiRequests: 500,
      storage: 5000, // MB
    },
  },
  ENTERPRISE: {
    name: 'Empresarial',
    price: 297,
    features: [
      'Tudo do Premium',
      'Múltiplas contas',
      'White label',
      'API personalizada',
      'Suporte 24/7',
      'Treinamento dedicado',
    ],
    limits: {
      postsPerMonth: -1,
      platforms: -1,
      aiRequests: -1,
      storage: -1,
    },
  },
};

// Configurações de tempo
export const TIME_ZONES = [
  'America/Sao_Paulo',
  'America/New_York',
  'Europe/London',
  'Asia/Tokyo',
] as const;

// Configurações de idioma
export const LANGUAGES = {
  'pt-BR': 'Português (Brasil)',
  'en-US': 'English (US)',
} as const;

// Regex patterns
export const REGEX_PATTERNS = {
  hashtag: /#[a-zA-Z0-9_]+/g,
  mention: /@[a-zA-Z0-9._]+/g,
  url: /https?:\/\/[^\s]+/g,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
};

// Configurações de cache
export const CACHE_KEYS = {
  USER_METRICS: 'user_metrics',
  RECENT_POSTS: 'recent_posts',
  PLATFORM_INSIGHTS: 'platform_insights',
  AI_PROMPTS: 'ai_prompts',
  USER_SETTINGS: 'user_settings',
};

// Configurações de validação
export const VALIDATION_RULES = {
  content: {
    title: { minLength: 5, maxLength: 100 },
    body: { minLength: 10, maxLength: 5000 },
  },
  user: {
    name: { minLength: 2, maxLength: 50 },
    email: { maxLength: 100 },
    password: { minLength: 8, maxLength: 100 },
  },
  file: {
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'video/mp4',
      'video/avi',
      'application/pdf',
    ],
  },
};

export default {
  APP_CONFIG,
  PLATFORMS,
  CONTENT_CATEGORIES,
  CONTENT_STATUS,
  AI_CONFIG,
  API_LIMITS,
  API_ENDPOINTS,
  NOTIFICATION_TYPES,
  SUBSCRIPTION_PLANS,
  TIME_ZONES,
  LANGUAGES,
  REGEX_PATTERNS,
  CACHE_KEYS,
  VALIDATION_RULES,
};