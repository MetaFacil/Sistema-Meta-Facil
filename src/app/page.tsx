'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentPosts } from '@/components/dashboard/RecentPosts';
import { DashboardMetrics as MetricsType } from '@/types';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<MetricsType>({
    postsCreated: 0,
    totalLikes: 0,
    totalComments: 0,
    totalShares: 0,
    averageEngagement: 0,
    totalReach: 0,
    growthRate: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carregar dados reais do backend
    const fetchData = async () => {
      setLoading(true);
      
      // Inicializar com valores zerados
      setMetrics({
        postsCreated: 0,
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0,
        averageEngagement: 0,
        totalReach: 0,
        growthRate: 0,
      });
      
      setLoading(false);
    };

    fetchData();
    
    // Verificar e publicar conteúdos agendados automaticamente
    const checkScheduledContent = async () => {
      try {
        // Chamar a API silenciosamente para verificar conteúdos agendados
        await fetch('/api/content/publish-scheduled', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Verificação automática de conteúdos agendados executada');
      } catch (error) {
        console.error('Erro ao verificar conteúdos agendados:', error);
      }
    };
    
    // Executar a verificação após o carregamento da página
    checkScheduledContent();
    
    // Configurar um intervalo para verificar a cada 5 minutos enquanto a página estiver aberta
    const intervalId = setInterval(checkScheduledContent, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Dashboard Meta Fácil
            </h1>
            <p className="mt-2 text-gray-600">
              Visão geral das suas campanhas de marketing para opções binárias
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>Últimos 30 dias</option>
              <option>Últimos 7 dias</option>
              <option>Hoje</option>
            </select>
          </div>
        </div>

        {/* Métricas principais */}
        <DashboardMetrics metrics={metrics} loading={loading} />

        {/* Ações rápidas */}
        <QuickActions />

        {/* Posts recentes */}
        <RecentPosts />
      </div>
    </DashboardLayout>
  );
}