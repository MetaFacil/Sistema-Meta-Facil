'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, Bell, CheckCircle } from 'lucide-react';
import { useTelegramAnalyticsHistory } from '@/hooks/useTelegramAnalyticsHistory';

interface TelegramAlertsProps {
  contentId: string;
}

interface Alert {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
}

export function TelegramAlerts({ contentId }: TelegramAlertsProps) {
  const { stats, loading, error, fetchStats } = useTelegramAnalyticsHistory();
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    if (contentId) {
      fetchStats(contentId, '30d');
    }
  }, [contentId]);

  useEffect(() => {
    if (stats) {
      const newAlerts: Alert[] = [];
      
      // Verificar crescimento significativo
      if (stats.growth.likes > stats.averages.likes * 2) {
        newAlerts.push({
          id: 'likes_growth',
          type: 'success',
          title: 'Crescimento Excepcional de Curtidas',
          message: `As curtidas aumentaram em ${stats.growth.likes} no último período, mais que o dobro da média.`,
          timestamp: new Date()
        });
      }
      
      // Verificar queda significativa
      if (stats.growth.engagement < -stats.averages.engagement * 0.5) {
        newAlerts.push({
          id: 'engagement_drop',
          type: 'warning',
          title: 'Queda no Engajamento',
          message: `A taxa de engajamento caiu ${Math.abs(stats.growth.engagement)}% abaixo da média.`,
          timestamp: new Date()
        });
      }
      
      // Verificar engajamento alto
      if (stats.averages.engagement > 10) {
        newAlerts.push({
          id: 'high_engagement',
          type: 'success',
          title: 'Alto Engajamento',
          message: `A taxa média de engajamento está em ${stats.averages.engagement}%, indicando um bom desempenho.`,
          timestamp: new Date()
        });
      }
      
      setAlerts(newAlerts);
    }
  }, [stats]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-100 rounded"></div>
            <div className="h-16 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center text-red-600">
          <p>Erro ao carregar alertas: {error}</p>
        </div>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum alerta no momento</h3>
          <p className="text-gray-600">Todas as métricas estão dentro dos parâmetros normais.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Alertas de Métricas</h3>
        <Bell size={20} className="text-gray-500" />
      </div>
      
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div 
            key={alert.id}
            className={`p-4 rounded-lg border-l-4 ${
              alert.type === 'success' ? 'bg-green-50 border-green-500' :
              alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
              alert.type === 'error' ? 'bg-red-50 border-red-500' :
              'bg-blue-50 border-blue-500'
            }`}
          >
            <div className="flex items-start">
              <div className={`flex-shrink-0 mr-3 ${
                alert.type === 'success' ? 'text-green-500' :
                alert.type === 'warning' ? 'text-yellow-500' :
                alert.type === 'error' ? 'text-red-500' :
                'text-blue-500'
              }`}>
                {alert.type === 'success' ? <TrendingUp size={20} /> :
                 alert.type === 'warning' ? <AlertTriangle size={20} /> :
                 alert.type === 'error' ? <TrendingDown size={20} /> :
                 <Bell size={20} />}
              </div>
              <div className="flex-1">
                <h4 className={`text-sm font-medium ${
                  alert.type === 'success' ? 'text-green-800' :
                  alert.type === 'warning' ? 'text-yellow-800' :
                  alert.type === 'error' ? 'text-red-800' :
                  'text-blue-800'
                }`}>
                  {alert.title}
                </h4>
                <p className={`mt-1 text-sm ${
                  alert.type === 'success' ? 'text-green-700' :
                  alert.type === 'warning' ? 'text-yellow-700' :
                  alert.type === 'error' ? 'text-red-700' :
                  'text-blue-700'
                }`}>
                  {alert.message}
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  {alert.timestamp.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}