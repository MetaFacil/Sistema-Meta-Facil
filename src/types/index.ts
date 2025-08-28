// ===== ENUMS E TIPOS BÁSICOS =====

export type UserRole = 'USER' | 'ADMIN' | 'MODERATOR';
export type SubscriptionPlan = 'FREE' | 'PREMIUM' | 'ENTERPRISE';
export type SubscriptionStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
export type Provider = 'META' | 'TELEGRAM';
export type Platform = 'INSTAGRAM' | 'FACEBOOK' | 'TELEGRAM';
export type ContentType = 'POST' | 'STORY' | 'REEL' | 'TELEGRAM_MESSAGE';
export type ContentCategory = 'EDUCATIONAL' | 'PROMOTIONAL' | 'ANALYSIS' | 'NEWS' | 'SIGNAL' | 'ENTERTAINMENT';
export type ContentStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED' | 'FAILED';
export type MediaType = 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT';
export type CampaignType = 'AWARENESS' | 'TRAFFIC' | 'ENGAGEMENT' | 'CONVERSION' | 'LEAD_GENERATION';
export type CampaignStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
export type AIPromptType = 'CONTENT_GENERATION' | 'HASHTAG_GENERATION' | 'OPTIMIZATION' | 'ANALYSIS' | 'CHAT';
export type AIModel = 'GPT4' | 'GPT35' | 'CLAUDE_3' | 'CLAUDE_HAIKU';
export type CalendarEventStatus = 'SCHEDULED' | 'PUBLISHED' | 'FAILED' | 'CANCELLED';
export type BlogStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type Language = 'PT_BR' | 'EN_US' | 'ES_ES';

// ===== MODELOS DE DADOS =====

export interface User {
  id: string;
  name?: string | null;
  email: string;
  emailVerified?: Date | null;
  image?: string | null;
  password?: string;
  role: UserRole;
  plan: SubscriptionPlan;
  company?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSubscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: Date;
  endDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConnectedAccount {
  id: string;
  userId: string;
  provider: Provider; // 'META' | 'TELEGRAM'
  accountId: string; // ID real da conta no provedor
  accountName: string; // Nome da conta
  accessToken: string; // Token de acesso
  refreshToken?: string | null; // Token de refresh (opcional)
  expiresAt?: Date | null; // Data de expiração (opcional)
  isActive: boolean; // Status da conta
  defaultChannelId?: string | null; // ID do canal padrão para o Telegram
  defaultChannelName?: string | null; // Nome do canal padrão para o Telegram
  createdAt: Date;
  updatedAt: Date;
}

export interface Content {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: ContentType;
  category: ContentCategory;
  status: ContentStatus;
  platforms: Platform[] | string;
  hashtags: string[] | string;
  scheduledFor?: Date | null;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  mediaFiles?: MediaFile[];
  analytics?: ContentAnalytics[];
}

export interface MediaFile {
  id: string;
  contentId: string;
  type: MediaType;
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  createdAt: Date;
}

export interface ContentAnalytics {
  id: string;
  contentId: string;
  platform: Platform;
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  engagement: number;
  clickThroughRate?: number | null;
  lastUpdated: Date;
  // Histórico de métricas
  history?: AnalyticsHistory[];
}

// Novo tipo para histórico de métricas
export interface AnalyticsHistory {
  id: string;
  analyticsId: string;
  platform: Platform;
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  engagement: number;
  clickThroughRate?: number | null;
  recordedAt: Date;
}

export interface Campaign {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  type: CampaignType;
  status: CampaignStatus;
  budget?: number | null;
  startDate: Date;
  endDate?: Date | null;
  targetAudience?: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
  contents?: Content[];
  analytics?: CampaignAnalytics[];
}

export interface CampaignAnalytics {
  id: string;
  campaignId: string;
  totalSpent: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpm: number;
  cpc: number;
  conversions: number;
  conversionRate: number;
  date: Date;
}

export interface AIPrompt {
  id: string;
  userId: string;
  type: AIPromptType;
  prompt: string;
  response: string;
  model: AIModel;
  tokensUsed: number;
  createdAt: Date;
}

export interface CalendarEvent {
  id: string;
  contentId: string;
  userId: string;
  title: string;
  description?: string | null;
  scheduledFor: Date;
  platforms: Platform[];
  status: CalendarEventStatus;
  createdAt: Date;
  updatedAt: Date;
  content?: Content;
}

export interface BlogPost {
  id: string;
  userId: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  status: BlogStatus;
  seoTitle?: string | null;
  seoDescription?: string | null;
  tags: string[];
  featuredImage?: string | null;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SystemSettings {
  id: string;
  userId: string;
  autoPost: boolean;
  defaultPlatforms: Platform[];
  timezone: string;
  language: Language;
  notifications: Record<string, any>;
  apiLimits: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// ===== INTERFACES DE DASHBOARD =====

export interface DashboardMetrics {
  postsCreated: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  averageEngagement: number;
  totalReach: number;
  growthRate: number;
}

export interface PlatformMetrics {
  platform: Platform;
  posts: number;
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  engagement: number;
  growthRate: number;
}

// ===== INTERFACES DE API =====

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// ===== INTERFACES DE INTEGRAÇÃO =====

export interface MetaAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

export interface MetaPostData {
  message: string;
  link?: string;
  picture?: string;
  name?: string;
  caption?: string;
  description?: string;
  scheduled_publish_time?: number;
  published?: boolean;
}

export interface MetaPostResponse {
  id: string;
  post_id?: string;
}

export interface TelegramBotInfo {
  id: number;
  is_bot: boolean;
  first_name: string;
  username: string;
  can_join_groups: boolean;
  can_read_all_group_messages: boolean;
  supports_inline_queries: boolean;
}

export interface TelegramMessage {
  chat_id: string | number;
  text: string;
  parse_mode?: 'Markdown' | 'HTML';
  disable_web_page_preview?: boolean;
  disable_notification?: boolean;
  reply_to_message_id?: number;
}

// ===== INTERFACES DE IA =====

export interface AIGenerationRequest {
  prompt: string;
  platform?: Platform;
  category?: ContentCategory;
  tone?: 'professional' | 'casual' | 'educational' | 'promotional';
  length?: 'short' | 'medium' | 'long';
  includeHashtags?: boolean;
  includeEmojis?: boolean;
  provider?: 'openai' | 'claude';
}

export interface AIGenerationResponse {
  content: string;
  hashtags?: string[];
  provider: string;
  tokensUsed: number;
  confidence: number;
}

export interface MarketAnalysisRequest {
  pair: string;
  timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w';
  includeTA?: boolean;
  includeSentiment?: boolean;
}

export interface MarketAnalysisResponse {
  pair: string;
  timeframe: string;
  trend: 'BULLISH' | 'BEARISH' | 'SIDEWAYS';
  confidence: number;
  price: {
    current: number;
    change: number;
    changePercent: number;
  };
  technicalAnalysis?: {
    rsi: number;
    macd: {
      value: number;
      signal: number;
      histogram: number;
    };
    movingAverages: {
      sma20: number;
      sma50: number;
      sma200: number;
    };
    support: number[];
    resistance: number[];
  };
  sentiment?: {
    score: number;
    label: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
    sources: string[];
  };
  recommendation: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  timestamp: Date;
}

// ===== INTERFACES DE FORMULÁRIOS =====

export interface LoginFormData {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  company?: string;
  acceptTerms: boolean;
}

export interface ContentFormData {
  title: string;
  body: string;
  category: ContentCategory;
  platforms: Platform[];
  hashtags: string[];
  scheduledFor?: Date;
  mediaFiles?: File[];
}

export interface CampaignFormData {
  name: string;
  description?: string;
  type: CampaignType;
  budget?: number;
  startDate: Date;
  endDate?: Date;
  targetAudience?: {
    age?: { min: number; max: number };
    gender?: 'all' | 'male' | 'female';
    location?: string[];
    interests?: string[];
  };
  contentIds?: string[];
}

export interface BlogPostFormData {
  title: string;
  content: string;
  excerpt?: string;
  seoTitle?: string;
  seoDescription?: string;
  tags: string[];
  featuredImage?: File;
  publishNow?: boolean;
  publishedAt?: Date;
}

// ===== INTERFACES DE COMPONENTES =====

export interface TableColumn<T = any> {
  key: keyof T | string;
  title: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, record: T) => React.ReactNode;
}

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface ChartDataPoint {
  date: Date;
  value: number;
  label?: string;
  platform?: Platform;
}

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
  icon?: React.ComponentType<any>;
}

// ===== INTERFACES DE NOTIFICAÇÕES =====

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}

export interface Toast {
  id: string;
  title: string;
  message?: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// ===== INTERFACES DE CONFIGURAÇÃO =====

export interface AppConfig {
  name: string;
  version: string;
  description: string;
  author: string;
  supportEmail: string;
  features: {
    ai: boolean;
    analytics: boolean;
    campaigns: boolean;
    blog: boolean;
    integrations: boolean;
  };
  limits: {
    freeplan: {
      postsPerMonth: number;
      aiRequestsPerMonth: number;
      platformConnections: number;
    };
    premium: {
      postsPerMonth: number;
      aiRequestsPerMonth: number;
      platformConnections: number;
    };
    enterprise: {
      postsPerMonth: number;
      aiRequestsPerMonth: number;
      platformConnections: number;
    };
  };
}

export interface APIEndpoints {
  auth: {
    login: string;
    register: string;
    logout: string;
    refresh: string;
  };
  content: {
    list: string;
    create: string;
    update: string;
    delete: string;
    publish: string;
    schedule: string;
  };
  analytics: {
    overview: string;
    platform: string;
    content: string;
    export: string;
  };
  ai: {
    generate: string;
    optimize: string;
    analyze: string;
    chat: string;
  };
  integrations: {
    meta: {
      auth: string;
      publish: string;
      analytics: string;
    };
    telegram: {
      setup: string;
      send: string;
      status: string;
    };
  };
}

// ===== TIPOS DE UTILIDADES =====

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// ===== INTERFACES DE CONTEXTO =====

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (data: RegisterFormData) => Promise<{ success: boolean; error?: string }>;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'userId' | 'createdAt'>) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

// ===== EXTENSÕES DO NEXT-AUTH =====

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: string;
      plan: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    role: string;
    plan: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    plan: string;
  }
}
