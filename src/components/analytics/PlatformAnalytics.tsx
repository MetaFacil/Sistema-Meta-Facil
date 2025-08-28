'use client';

import { Instagram, Facebook, Send } from 'lucide-react';
import { formatNumber } from '@/utils';

interface PlatformAnalyticsProps {
  data?: {
    instagram: {
      followers: number;
      reach: number;
      impressions: number;
      engagement: number;
      stories: number;
      reels: number;
    };
    facebook: {
      followers: number;
      reach: number;
      impressions: number;
      engagement: number;
      pageViews: number;
      shares: number;
    };
    telegram: {
      subscribers: number;
      views: number;
      forwards: number;
      engagement: number;
      channels: number;
      groups: number;
    };
  };
  selectedPlatform: 'all' | 'instagram' | 'facebook' | 'telegram';
  loading: boolean;
}

interface PlatformCardProps {
  platform: 'instagram' | 'facebook' | 'telegram';
  data: any;
  isSelected: boolean;
  loading: boolean;
}

function PlatformCard({ platform, data, isSelected, loading }: PlatformCardProps) {
  const platformConfig = {
    instagram: {
      name: 'Instagram',
      icon: Instagram,
      color: 'from-pink-500 to-purple-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      textColor: 'text-pink-600',
      metrics: [
        { label: 'Seguidores', value: data?.followers, key: 'followers' },
        { label: 'Alcance', value: data?.reach, key: 'reach' },
        { label: 'Impressões', value: data?.impressions, key: 'impressions' },
        { label: 'Stories', value: data?.stories, key: 'stories' },
        { label: 'Reels', value: data?.reels, key: 'reels' },
        { label: 'Engajamento', value: data?.engagement, key: 'engagement' }
      ]
    },
    facebook: {
      name: 'Facebook',
      icon: Facebook,
      color: 'from-blue-500 to-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-600',
      metrics: [
        { label: 'Seguidores', value: data?.followers, key: 'followers' },
        { label: 'Alcance', value: data?.reach, key: 'reach' },
        { label: 'Impressões', value: data?.impressions, key: 'impressions' },
        { label: 'Visualizações', value: data?.pageViews, key: 'pageViews' },
        { label: 'Compartilhamentos', value: data?.shares, key: 'shares' },
        { label: 'Engajamento', value: data?.engagement, key: 'engagement' }
      ]
    },
    telegram: {
      name: 'Telegram',
      icon: Send,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-500',
      metrics: [
        { label: 'Inscritos', value: data?.subscribers, key: 'subscribers' },
        { label: 'Visualizações', value: data?.views, key: 'views' },
        { label: 'Encaminhamentos', value: data?.forwards, key: 'forwards' },
        { label: 'Canais', value: data?.channels, key: 'channels' },
        { label: 'Grupos', value: data?.groups, key: 'groups' },
        { label: 'Engajamento', value: data?.engagement, key: 'engagement' }
      ]
    }
  };

  const config = platformConfig[platform];
  const Icon = config.icon;

  if (loading) {
    return (
      <div className={`bg-white rounded-xl border-2 border-gray-200 p-6`}>
        <div className="animate-pulse">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4"></div>
            <div className="w-24 h-6 bg-gray-200 rounded"></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="w-16 h-6 bg-gray-200 rounded"></div>
                <div className="w-12 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`
      bg-white rounded-xl border-2 transition-all duration-200 p-6
      ${isSelected 
        ? `${config.borderColor} ${config.bgColor}` 
        : 'border-gray-200 hover:border-gray-300'
      }
    `}>
      {/* Platform Header */}
      <div className="flex items-center mb-6">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center mr-4`}>
          <Icon size={24} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{config.name}</h3>
          <p className="text-sm text-gray-600">Análise de performance</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {config.metrics.map((metric) => (
          <div key={metric.key} className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-gray-900 mb-1">
              {formatNumber(metric.value || 0)}
            </div>
            <div className="text-xs text-gray-600">{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Engagement Rate */}
      <div className="mt-4 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Taxa de Engajamento</span>
          <span className={`text-lg font-bold ${config.textColor}`}>
            {data ? ((data.engagement / data.reach) * 100).toFixed(1) : '0.0'}%
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full bg-gradient-to-r ${config.color}`}
            style={{ 
              width: data ? `${Math.min(((data.engagement / data.reach) * 100), 100)}%` : '0%'
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export function PlatformAnalytics({ data, selectedPlatform, loading }: PlatformAnalyticsProps) {
  const platforms: ('instagram' | 'facebook' | 'telegram')[] = ['instagram', 'facebook', 'telegram'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Análise por Plataforma</h2>
        <div className="text-sm text-gray-600">
          {selectedPlatform === 'all' ? 'Todas as plataformas' : `Foco em ${selectedPlatform}`}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {platforms.map((platform) => (
          <PlatformCard
            key={platform}
            platform={platform}
            data={data?.[platform]}
            isSelected={selectedPlatform === platform || selectedPlatform === 'all'}
            loading={loading}
          />
        ))}
      </div>

      {/* Summary */}
      {!loading && data && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo Comparativo</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {formatNumber(
                  (data.instagram.followers || 0) + 
                  (data.facebook.followers || 0) + 
                  (data.telegram.subscribers || 0)
                )}
              </div>
              <div className="text-sm text-gray-600">Total de Seguidores</div>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {formatNumber(
                  (data.instagram.reach || 0) + 
                  (data.facebook.reach || 0) + 
                  (data.telegram.views || 0)
                )}
              </div>
              <div className="text-sm text-gray-600">Alcance Total</div>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {formatNumber(
                  (data.instagram.engagement || 0) + 
                  (data.facebook.engagement || 0) + 
                  (data.telegram.engagement || 0)
                )}
              </div>
              <div className="text-sm text-gray-600">Total de Interações</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}