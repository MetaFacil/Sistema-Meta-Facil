'use client';

import { useState, useEffect } from 'react';
import { AnalyticsHistory, ContentAnalytics } from '@/types';

interface HistoryStats {
  period: string;
  startDate: string;
  endDate: string;
  totalRecords: number;
  growth: {
    impressions: number;
    reach: number;
    likes: number;
    comments: number;
    shares: number;
    engagement: number;
  };
  averages: {
    impressions: number;
    reach: number;
    likes: number;
    comments: number;
    shares: number;
    engagement: number;
  };
  firstRecord?: AnalyticsHistory;
  lastRecord?: AnalyticsHistory;
}

export function useTelegramAnalyticsHistory() {
  const [history, setHistory] = useState<AnalyticsHistory[]>([]);
  const [current, setCurrent] = useState<ContentAnalytics | null>(null);
  const [stats, setStats] = useState<HistoryStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async (contentId: string, limit: number = 30) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/analytics/telegram/history?contentId=${contentId}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar histórico de métricas');
      }

      const data = await response.json();
      
      if (data.success) {
        setHistory(data.history || []);
        setCurrent(data.current || null);
      } else {
        throw new Error(data.error || 'Erro desconhecido');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Error fetching Telegram analytics history:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (contentId: string, period: string = '30d') => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analytics/telegram/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contentId, period })
      });
      
      if (!response.ok) {
        throw new Error('Erro ao carregar estatísticas do histórico');
      }

      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats || null);
      } else {
        throw new Error(data.error || 'Erro desconhecido');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Error fetching Telegram analytics stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    history,
    current,
    stats,
    loading,
    error,
    fetchHistory,
    fetchStats,
    clearError
  };
}