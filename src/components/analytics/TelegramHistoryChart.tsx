'use client';

import { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTelegramAnalyticsHistory } from '@/hooks/useTelegramAnalyticsHistory';
import { AnalyticsHistory } from '@/types';

interface TelegramHistoryChartProps {
  contentId: string;
}

interface ChartData {
  date: string;
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  engagement: number;
}

export function TelegramHistoryChart({ contentId }: TelegramHistoryChartProps) {
  const { history, stats, loading, error, fetchHistory, fetchStats } = useTelegramAnalyticsHistory();
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    if (contentId) {
      fetchHistory(contentId, 100); // Buscar até 100 registros
      fetchStats(contentId, period);
    }
  }, [contentId, period]);

  useEffect(() => {
    // Transformar dados do histórico para o formato do gráfico
    const formattedData: ChartData[] = history.map((record: AnalyticsHistory) => ({
      date: format(new Date(record.recordedAt), 'dd/MM', { locale: ptBR }),
      impressions: record.impressions,
      reach: record.reach,
      likes: record.likes,
      comments: record.comments,
      engagement: record.engagement
    })).reverse(); // Inverter para mostrar do mais antigo ao mais recente

    setChartData(formattedData);
  }, [history]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-64 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center text-red-600">
          <p>Erro ao carregar histórico: {error}</p>
          <button 
            onClick={() => {
              fetchHistory(contentId, 100);
              fetchStats(contentId, period);
            }}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-0">
          Histórico de Métricas do Telegram
        </h3>
        
        <div className="flex space-x-2">
          <select 
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
            <option value="1y">Último ano</option>
          </select>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum dado de histórico disponível</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Gráfico de Impressões e Alcance */}
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-4">Visualizações e Alcance</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280" 
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#6b7280" 
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="impressions" 
                    name="Impressões" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="reach" 
                    name="Alcance" 
                    stroke="#10b981" 
                    fill="#10b981" 
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico de Engajamento */}
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-4">Engajamento</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280" 
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#6b7280" 
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="likes" 
                    name="Curtidas" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="comments" 
                    name="Comentários" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="engagement" 
                    name="Engajamento (%)" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Estatísticas Resumidas */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-blue-600 mb-1">Crescimento de Impressões</div>
                <div className={`text-xl font-bold ${stats.growth.impressions >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.growth.impressions >= 0 ? '+' : ''}{stats.growth.impressions}
                </div>
                <div className="text-xs text-gray-500">
                  Média: {stats.averages.impressions} por coleta
                </div>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4">
                <div className="text-sm text-red-600 mb-1">Crescimento de Curtidas</div>
                <div className={`text-xl font-bold ${stats.growth.likes >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.growth.likes >= 0 ? '+' : ''}{stats.growth.likes}
                </div>
                <div className="text-xs text-gray-500">
                  Média: {stats.averages.likes} por coleta
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-sm text-purple-600 mb-1">Taxa de Engajamento</div>
                <div className={`text-xl font-bold ${stats.growth.engagement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.growth.engagement >= 0 ? '+' : ''}{stats.growth.engagement}%
                </div>
                <div className="text-xs text-gray-500">
                  Média: {stats.averages.engagement}% por coleta
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}