'use client';

import { 
  TrendingUp, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share, 
  MoreHorizontal,
  Instagram,
  Facebook,
  Send
} from 'lucide-react';
import { formatNumber } from '@/utils';

interface ContentPerformanceProps {
  data?: Array<{
    id: string;
    title: string;
    platform: string;
    publishedAt: string;
    reach: number;
    engagement: number;
    likes: number;
    comments: number;
    shares: number;
  }>;
  loading: boolean;
}

const platformIcons = {
  Instagram: Instagram,
  Facebook: Facebook,
  Telegram: Send
};

const platformColors = {
  Instagram: 'text-pink-600 bg-pink-100',
  Facebook: 'text-blue-600 bg-blue-100',
  Telegram: 'text-blue-500 bg-blue-50'
};

export function ContentPerformance({ data, loading }: ContentPerformanceProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className="w-12 h-12 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-24 h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Performance de Conteúdo</h3>
        <button className="text-sm text-primary-600 hover:text-primary-700">
          Ver todos
        </button>
      </div>

      <div className="space-y-4">
        {data?.map((content, index) => {
          const Icon = platformIcons[content.platform as keyof typeof platformIcons];
          const platformColor = platformColors[content.platform as keyof typeof platformColors];
          
          return (
            <div key={content.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
              {/* Ranking */}
              <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
              </div>

              {/* Platform Icon */}
              <div className={`p-2 rounded-lg ${platformColor}`}>
                {Icon && <Icon size={16} />}
              </div>

              {/* Content Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">{content.title}</h4>
                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                  <span>{content.platform}</span>
                  <span>•</span>
                  <span>{new Date(content.publishedAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              {/* Metrics */}
              <div className="flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="flex items-center text-gray-600">
                    <Eye size={14} className="mr-1" />
                    <span>{formatNumber(content.reach)}</span>
                  </div>
                  <span className="text-xs text-gray-500">Alcance</span>
                </div>

                <div className="text-center">
                  <div className="flex items-center text-gray-600">
                    <Heart size={14} className="mr-1" />
                    <span>{content.likes}</span>
                  </div>
                  <span className="text-xs text-gray-500">Curtidas</span>
                </div>

                <div className="text-center">
                  <div className="flex items-center text-gray-600">
                    <MessageCircle size={14} className="mr-1" />
                    <span>{content.comments}</span>
                  </div>
                  <span className="text-xs text-gray-500">Comentários</span>
                </div>

                <div className="text-center">
                  <div className="flex items-center text-green-600">
                    <TrendingUp size={14} className="mr-1" />
                    <span>{content.engagement.toFixed(1)}%</span>
                  </div>
                  <span className="text-xs text-gray-500">Engajamento</span>
                </div>
              </div>

              {/* Actions */}
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <MoreHorizontal size={16} />
              </button>
            </div>
          );
        })}
      </div>

      {(!data || data.length === 0) && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhum conteúdo publicado no período selecionado</p>
        </div>
      )}
    </div>
  );
}