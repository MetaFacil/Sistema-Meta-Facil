'use client';

import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Heart, 
  MessageSquare, 
  Share,
  Target,
  DollarSign,
  Eye,
  BarChart3
} from 'lucide-react';

interface OverallMetrics {
  totalPosts: number;
  totalViews: number;
  totalEngagement: number;
  totalFollowers: number;
  conversionRate: number;
  revenue: number;
}

interface PlatformMetrics {
  instagram: {
    followers: number;
    engagement: number;
    reach: number;
    impressions: number;
  };
  facebook: {
    followers: number;
    engagement: number;
    reach: number;
    impressions: number;
  };
  telegram: {
    subscribers: number;
    messagesSent: number;
    clickRate: number;
    conversionRate: number;
  };
}

interface PerformanceInsightsProps {
  metrics?: OverallMetrics;
  platformMetrics?: PlatformMetrics;
  loading: boolean;
}

export function PerformanceInsights({ 
  metrics = {
    totalPosts: 0,
    totalViews: 0,
    totalEngagement: 0,
    totalFollowers: 0,
    conversionRate: 0,
    revenue: 0
  }, 
  platformMetrics = {
    instagram: { followers: 0, engagement: 0, reach: 0, impressions: 0 },
    facebook: { followers: 0, engagement: 0, reach: 0, impressions: 0 },
    telegram: { subscribers: 0, messagesSent: 0, clickRate: 0, conversionRate: 0 }
  }, 
  loading 
}: PerformanceInsightsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <BarChart3 size={24} className="mr-2 text-purple-600" />
          Insights de Performance
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatNumber(metrics?.totalPosts || 0)}
                </div>
                <div className="text-sm text-blue-600">Posts Publicados</div>
              </div>
              <Target className="text-blue-600" size={24} />
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {formatNumber(metrics?.totalViews || 0)}
                </div>
                <div className="text-sm text-green-600">Visualizações</div>
              </div>
              <Eye className="text-green-600" size={24} />
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {formatNumber(metrics?.totalEngagement || 0)}
                </div>
                <div className="text-sm text-purple-600">Engajamento</div>
              </div>
              <Heart className="text-purple-600" size={24} />
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {formatNumber(metrics?.totalFollowers || 0)}
                </div>
                <div className="text-sm text-yellow-600">Seguidores</div>
              </div>
              <Users className="text-yellow-600" size={24} />
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {(metrics?.conversionRate || 0).toFixed(1)}%
                </div>
                <div className="text-sm text-red-600">Conversão</div>
              </div>
              <TrendingUp className="text-red-600" size={24} />
            </div>
          </div>
          
          <div className="bg-emerald-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold text-emerald-600">
                  {formatCurrency(metrics?.revenue || 0)}
                </div>
                <div className="text-sm text-emerald-600">Receita</div>
              </div>
              <DollarSign className="text-emerald-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Platform Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Instagram */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Instagram</h3>
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"></div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Seguidores</span>
              <span className="font-semibold">{formatNumber(platformMetrics?.instagram?.followers || 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Engajamento</span>
              <span className="font-semibold">{(platformMetrics?.instagram?.engagement || 0).toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Alcance</span>
              <span className="font-semibold">{formatNumber(platformMetrics?.instagram?.reach || 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Impressões</span>
              <span className="font-semibold">{formatNumber(platformMetrics?.instagram?.impressions || 0)}</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center text-sm">
              <TrendingUp size={16} className="text-green-500 mr-1" />
              <span className="text-green-600">+12% esta semana</span>
            </div>
          </div>
        </div>

        {/* Facebook */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Facebook</h3>
            <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Seguidores</span>
              <span className="font-semibold">{formatNumber(platformMetrics?.facebook?.followers || 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Engajamento</span>
              <span className="font-semibold">{(platformMetrics?.facebook?.engagement || 0).toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Alcance</span>
              <span className="font-semibold">{formatNumber(platformMetrics?.facebook?.reach || 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Impressões</span>
              <span className="font-semibold">{formatNumber(platformMetrics?.facebook?.impressions || 0)}</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center text-sm">
              <TrendingUp size={16} className="text-green-500 mr-1" />
              <span className="text-green-600">+8% esta semana</span>
            </div>
          </div>
        </div>

        {/* Telegram */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Telegram</h3>
            <div className="w-8 h-8 bg-blue-500 rounded-lg"></div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Inscritos</span>
              <span className="font-semibold">{formatNumber(platformMetrics?.telegram?.subscribers || 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Mensagens Enviadas</span>
              <span className="font-semibold">{formatNumber(platformMetrics?.telegram?.messagesSent || 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Taxa de Clique</span>
              <span className="font-semibold">{(platformMetrics?.telegram?.clickRate || 0).toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Conversão</span>
              <span className="font-semibold">{(platformMetrics?.telegram?.conversionRate || 0).toFixed(1)}%</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center text-sm">
              <TrendingUp size={16} className="text-green-500 mr-1" />
              <span className="text-green-600">+15% esta semana</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">🤖 Recomendações da IA</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <ul className="space-y-2">
            <li className="flex items-start space-x-2">
              <span className="text-blue-600">•</span>
              <span>Aumente a frequência de posts no Instagram (+20% de engajamento)</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600">•</span>
              <span>Posts com análises técnicas têm melhor performance</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600">•</span>
              <span>Horário ideal para posting: 18:00-20:00</span>
            </li>
          </ul>
          <ul className="space-y-2">
            <li className="flex items-start space-x-2">
              <span className="text-blue-600">•</span>
              <span>Use mais stories para aumentar alcance</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600">•</span>
              <span>Telegram está com maior taxa de conversão</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600">•</span>
              <span>Considere campanhas pagas no Facebook</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}