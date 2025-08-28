'use client';

import React from 'react';

import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Heart, 
  Users, 
  MessageCircle,
  Share,
  Target
} from 'lucide-react';
import { formatNumber } from '@/utils';

interface PerformanceOverviewProps {
  data?: {
    totalReach: number;
    totalImpressions: number;
    totalEngagement: number;
    engagementRate: number;
    followerGrowth: number;
    topPerformingPost: string;
  };
  loading: boolean;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  color: string;
  loading: boolean;
}

function MetricCard({ title, value, change, icon: Icon, color, loading }: MetricCardProps) {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            {change !== undefined && (
              <div className="w-16 h-6 bg-gray-200 rounded"></div>
            )}
          </div>
          <div className="w-24 h-8 bg-gray-200 rounded mb-2"></div>
          <div className="w-32 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const isPositive = change ? change >= 0 : true;
  const changeIcon = isPositive ? TrendingUp : TrendingDown;
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
  const changeBg = isPositive ? 'bg-green-50' : 'bg-red-50';

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${changeBg} ${changeColor}`}>
            {React.createElement(changeIcon, { size: 12, className: 'mr-1' })}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">
          {typeof value === 'number' ? formatNumber(value) : value}
        </h3>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </div>
  );
}

export function PerformanceOverview({ data, loading }: PerformanceOverviewProps) {
  const metrics = [
    {
      title: 'Alcance Total',
      value: data?.totalReach || 0,
      change: 15.2,
      icon: Eye,
      color: 'bg-blue-500'
    },
    {
      title: 'Total de Impressões',
      value: data?.totalImpressions || 0,
      change: 8.7,
      icon: Target,
      color: 'bg-purple-500'
    },
    {
      title: 'Total de Interações',
      value: data?.totalEngagement || 0,
      change: 12.4,
      icon: Heart,
      color: 'bg-red-500'
    },
    {
      title: 'Taxa de Engajamento',
      value: data ? `${data.engagementRate.toFixed(1)}%` : '0%',
      change: 5.3,
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      title: 'Crescimento de Seguidores',
      value: data ? `+${data.followerGrowth.toFixed(1)}%` : '0%',
      change: data?.followerGrowth,
      icon: Users,
      color: 'bg-indigo-500'
    },
    {
      title: 'Posts Publicados',
      value: 23,
      change: 21.8,
      icon: MessageCircle,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            icon={metric.icon}
            color={metric.color}
            loading={loading}
          />
        ))}
      </div>

      {/* Top Performing Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Destaques do Período
        </h3>
        
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Top Performing Post */}
            <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <div className="flex items-center mb-2">
                <div className="p-2 bg-yellow-500 rounded-lg mr-3">
                  <TrendingUp size={16} className="text-white" />
                </div>
                <span className="text-sm font-medium text-yellow-800">Post em Destaque</span>
              </div>
              <p className="text-sm text-gray-700 font-medium">
                {data?.topPerformingPost || 'Carregando...'}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {loading ? '...' : `${formatNumber(data?.totalReach || 0)} pessoas alcançadas`}
              </p>
            </div>

            {/* Best Engagement */}
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex items-center mb-2">
                <div className="p-2 bg-green-500 rounded-lg mr-3">
                  <Heart size={16} className="text-white" />
                </div>
                <span className="text-sm font-medium text-green-800">Melhor Engajamento</span>
              </div>
              <p className="text-sm text-gray-700 font-medium">
                Taxa de {loading ? '...' : `${data?.engagementRate.toFixed(1)}%`}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {loading ? '...' : `${formatNumber(data?.totalEngagement || 0)} interações`}
              </p>
            </div>

            {/* Growth Highlight */}
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-center mb-2">
                <div className="p-2 bg-blue-500 rounded-lg mr-3">
                  <Users size={16} className="text-white" />
                </div>
                <span className="text-sm font-medium text-blue-800">Crescimento</span>
              </div>
              <p className="text-sm text-gray-700 font-medium">
                +{loading ? '...' : `${data?.followerGrowth.toFixed(1)}%`} seguidores
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Comparado ao período anterior
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}