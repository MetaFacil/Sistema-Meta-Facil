'use client';

import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  Heart, 
  MessageCircle, 
  Share, 
  Users, 
  Eye 
} from 'lucide-react';
import { DashboardMetrics as MetricsType } from '@/types';

interface DashboardMetricsProps {
  metrics: MetricsType;
  loading: boolean;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ElementType;
  loading: boolean;
  color?: string;
}

interface TelegramMetrics {
  subscribers: number;
  views: number;
  engagementRate: number;
  channelName?: string;
  isLoading: boolean;
  error?: string;
}

function MetricCard({ title, value, change, icon: Icon, loading, color = 'text-primary-600' }: MetricCardProps) {
  const isPositive = change >= 0;
  const changeIcon = isPositive ? TrendingUp : TrendingDown;
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
  const changeBg = isPositive ? 'bg-green-50' : 'bg-red-50';

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="animate-pulse">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            <div className="w-16 h-6 bg-gray-200 rounded"></div>
          </div>
          <div className="mt-4">
            <div className="w-24 h-8 bg-gray-200 rounded"></div>
            <div className="w-20 h-4 bg-gray-200 rounded mt-2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-lg bg-gray-50 ${color}`}>
          <Icon size={24} />
        </div>
        <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${changeBg} ${changeColor}`}>
          {React.createElement(changeIcon, { size: 12, className: 'mr-1' })}
          {Math.abs(change)}%
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-2xl font-bold text-gray-900">
          {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
        </h3>
        <p className="text-sm text-gray-600 mt-1">{title}</p>
      </div>
    </div>
  );
}

export function DashboardMetrics({ metrics, loading }: DashboardMetricsProps) {
  const [telegramMetrics, setTelegramMetrics] = useState<TelegramMetrics>({
    subscribers: 0,
    views: 0,
    engagementRate: 0,
    isLoading: true
  });

  // Carregar métricas do Telegram
  useEffect(() => {
    const fetchTelegramMetrics = async () => {
      setTelegramMetrics(prev => ({ ...prev, isLoading: true }));
      try {
        // Chamar a API para obter métricas reais do Telegram
        const response = await fetch('/api/analytics/telegram');
        
        if (!response.ok) {
          throw new Error(`Erro ao obter métricas: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.chatInfo) {
          console.log('Dados do Telegram recebidos:', data);
          
          // Calcular métricas agregadas de todos os conteúdos
          const totalImpressions = data.analytics.reduce((sum: number, item: any) => sum + item.impressions, 0);
          const totalLikes = data.analytics.reduce((sum: number, item: any) => sum + item.likes, 0);
          const totalComments = data.analytics.reduce((sum: number, item: any) => sum + item.comments, 0);
          const totalShares = data.analytics.reduce((sum: number, item: any) => sum + item.shares, 0);
          
          // Calcular engajamento médio
          const engagementRate = data.analytics.length > 0 
            ? data.analytics.reduce((sum: number, item: any) => sum + item.engagement, 0) / data.analytics.length 
            : 0;
          
          setTelegramMetrics({
            subscribers: data.chatInfo.members || 0,
            views: totalImpressions,
            engagementRate: parseFloat(engagementRate.toFixed(2)),
            channelName: data.chatInfo.title || 'Canal Aberto',
            isLoading: false
          });
        } else {
          throw new Error('Dados inválidos recebidos da API');
        }
      } catch (error) {
        console.error('Erro ao buscar métricas do Telegram:', error);
        setTelegramMetrics(prev => ({ 
          ...prev, 
          isLoading: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        }));
      }
    };

    fetchTelegramMetrics();
  }, []);

  const metricCards = [
    {
      title: 'Posts Criados',
      value: metrics.postsCreated,
      change: 0,
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'Total de Curtidas',
      value: metrics.totalLikes,
      change: 0,
      icon: Heart,
      color: 'text-red-600'
    },
    {
      title: 'Comentários',
      value: metrics.totalComments,
      change: 0,
      icon: MessageCircle,
      color: 'text-green-600'
    },
    {
      title: 'Compartilhamentos',
      value: metrics.totalShares,
      change: 0,
      icon: Share,
      color: 'text-purple-600'
    },
    {
      title: 'Engajamento Médio',
      value: `${metrics.averageEngagement}%`,
      change: 0,
      icon: TrendingUp,
      color: 'text-yellow-600'
    },
    {
      title: 'Alcance Total',
      value: metrics.totalReach,
      change: metrics.growthRate,
      icon: Users,
      color: 'text-indigo-600'
    }
  ];

  // Métricas do Telegram com dados reais
  const telegramMetricCards = [
    {
      title: `Inscritos no Telegram${telegramMetrics.channelName ? ` (${telegramMetrics.channelName})` : ''}`,
      value: telegramMetrics.subscribers,
      change: 0, // Valor fixo até termos histórico para comparação
      icon: Users,
      color: 'text-blue-500'
    },
    {
      title: 'Visualizações no Telegram',
      value: telegramMetrics.views,
      change: 0, // Valor fixo até termos histórico para comparação
      icon: Eye,
      color: 'text-green-500'
    },
    {
      title: 'Taxa de Engajamento TG',
      value: `${telegramMetrics.engagementRate}%`,
      change: 0, // Valor fixo até termos histórico para comparação
      icon: TrendingUp,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metricCards.map((metric) => (
        <MetricCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          change={metric.change}
          icon={metric.icon}
          loading={loading}
          color={metric.color}
        />
      ))}
      
      {/* Métricas do Telegram */}
      {!telegramMetrics.isLoading && telegramMetricCards.map((metric) => (
        <MetricCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          change={metric.change}
          icon={metric.icon}
          loading={telegramMetrics.isLoading}
          color={metric.color}
        />
      ))}
      
      {/* Exibir mensagem de erro se houver */}
      {telegramMetrics.error && (
        <div className="col-span-full bg-red-50 p-4 rounded-lg border border-red-200 text-red-700">
          <p>Erro ao carregar métricas do Telegram: {telegramMetrics.error}</p>
        </div>
      )}
    </div>
  );
}