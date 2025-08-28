'use client';

import { useState, useEffect } from 'react';
import { Platform } from '@/types';

export interface AnalyticsData {
  platform: Platform;
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  engagement: number;
  clickThroughRate?: number;
  date: Date;
}

export interface PlatformMetrics {
  platform: Platform;
  totalImpressions: number;
  totalReach: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  averageEngagement: number;
  growthRate: number;
  topPerformingContent: {
    id: string;
    title: string;
    engagement: number;
  }[];
}

export interface OverallMetrics {
  totalPosts: number;
  totalImpressions: number;
  totalReach: number;
  totalEngagement: number;
  averageEngagementRate: number;
  bestPerformingPlatform: Platform;
  growthRate: number;
}

interface DateRange {
  from: Date;
  to: Date;
}

export function useAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [platformMetrics, setPlatformMetrics] = useState<PlatformMetrics[]>([]);
  const [overallMetrics, setOverallMetrics] = useState<OverallMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async (dateRange?: DateRange, platforms?: Platform[]) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      
      if (dateRange?.from) params.append('from', dateRange.from.toISOString());
      if (dateRange?.to) params.append('to', dateRange.to.toISOString());
      if (platforms?.length) params.append('platforms', platforms.join(','));

      const response = await fetch(`/api/analytics?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar analytics');
      }

      const data = await response.json();
      setAnalyticsData(data.analytics || []);
      setPlatformMetrics(data.platformMetrics || []);
      setOverallMetrics(data.overallMetrics || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlatformAnalytics = async (platform: Platform, dateRange?: DateRange) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ platform });
      
      if (dateRange?.from) params.append('from', dateRange.from.toISOString());
      if (dateRange?.to) params.append('to', dateRange.to.toISOString());

      const response = await fetch(`/api/analytics/platform?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao carregar analytics do ${platform}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Error fetching platform analytics:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchContentAnalytics = async (contentId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/analytics/content/${contentId}`);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar analytics do conteúdo');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Error fetching content analytics:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Nova função para coletar métricas do Telegram
  const collectTelegramAnalytics = async (contentId?: string) => {
    setLoading(true);
    setError(null);

    try {
      const url = contentId 
        ? '/api/analytics/telegram' 
        : '/api/analytics/telegram';
      
      const body = contentId ? { contentId } : {};

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error('Erro ao coletar métricas do Telegram');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Error collecting Telegram analytics:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (
    reportType: 'daily' | 'weekly' | 'monthly',
    dateRange?: DateRange,
    platforms?: Platform[]
  ) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ type: reportType });
      
      if (dateRange?.from) params.append('from', dateRange.from.toISOString());
      if (dateRange?.to) params.append('to', dateRange.to.toISOString());
      if (platforms?.length) params.append('platforms', platforms.join(','));

      const response = await fetch(`/api/analytics/report?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Erro ao gerar relatório');
      }

      const data = await response.json();
      return { success: true, report: data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao gerar relatório';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const exportData = async (
    format: 'csv' | 'pdf',
    dateRange?: DateRange,
    platforms?: Platform[]
  ) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ format });
      
      if (dateRange?.from) params.append('from', dateRange.from.toISOString());
      if (dateRange?.to) params.append('to', dateRange.to.toISOString());
      if (platforms?.length) params.append('platforms', platforms.join(','));

      const response = await fetch(`/api/analytics/export?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Erro ao exportar dados');
      }

      // Baixar arquivo
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao exportar dados';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch analytics on mount
  useEffect(() => {
    const defaultDateRange = {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      to: new Date()
    };
    fetchAnalytics(defaultDateRange);
  }, []);

  return {
    analyticsData,
    platformMetrics,
    overallMetrics,
    loading,
    error,
    fetchAnalytics,
    fetchPlatformAnalytics,
    fetchContentAnalytics,
    collectTelegramAnalytics, // Nova função adicionada
    generateReport,
    exportData,
    clearError: () => setError(null),
  };
}