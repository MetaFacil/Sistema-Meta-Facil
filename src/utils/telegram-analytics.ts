import { ContentAnalytics } from '@/types';

/**
 * Converte métricas brutas do Telegram em dados formatados para exibição
 * @param analytics Dados de analytics brutos
 * @returns Dados formatados para exibição
 */
export const formatTelegramAnalytics = (analytics: ContentAnalytics) => {
  return {
    subscribers: analytics.reach,
    views: analytics.impressions,
    forwards: analytics.shares,
    engagement: analytics.engagement,
    likes: analytics.likes,
    comments: analytics.comments,
    saves: analytics.saves,
    ctr: analytics.clickThroughRate
  };
};

/**
 * Calcula o total de métricas do Telegram para múltiplos conteúdos
 * @param analyticsList Lista de analytics de múltiplos conteúdos
 * @returns Totais agregados
 */
export const calculateTelegramTotals = (analyticsList: ContentAnalytics[]) => {
  return {
    totalSubscribers: analyticsList.reduce((sum, a) => sum + a.reach, 0),
    totalViews: analyticsList.reduce((sum, a) => sum + a.impressions, 0),
    totalForwards: analyticsList.reduce((sum, a) => sum + a.shares, 0),
    totalEngagement: analyticsList.reduce((sum, a) => sum + a.engagement, 0),
    totalLikes: analyticsList.reduce((sum, a) => sum + a.likes, 0),
    totalComments: analyticsList.reduce((sum, a) => sum + a.comments, 0),
    totalSaves: analyticsList.reduce((sum, a) => sum + a.saves, 0),
    avgCTR: analyticsList.reduce((sum, a) => sum + (a.clickThroughRate || 0), 0) / analyticsList.length || 0
  };
};

/**
 * Calcula a taxa de engajamento do Telegram
 * @param likes Número de curtidas
 * @param comments Número de comentários
 * @param shares Número de compartilhamentos
 * @param reach Alcance do conteúdo
 * @returns Taxa de engajamento em porcentagem
 */
export const calculateEngagementRate = (
  likes: number,
  comments: number,
  shares: number,
  reach: number
): number => {
  if (reach === 0) return 0;
  return ((likes + comments + shares) / reach) * 100;
};

/**
 * Formata números grandes para exibição (ex: 1000 -> 1K)
 * @param num Número a ser formatado
 * @returns Número formatado como string
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};