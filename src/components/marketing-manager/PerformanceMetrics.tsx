'use client';

import { TrendingUp, TrendingDown, DollarSign, Users, Eye, MousePointer } from 'lucide-react';

interface PerformanceMetricsProps {
  metrics?: {
    totalReach: number;
    totalSpent: number;
    totalConversions: number;
    averageCTR: number;
    activeCampaigns: number;
    budgetUtilization: number;
  };
  loading?: boolean;
}

export function PerformanceMetrics({ metrics, loading }: PerformanceMetricsProps) {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">R$ {loading ? '...' : metrics?.totalSpent.toLocaleString() || '0'}</div>
              <div className="text-sm text-gray-600">Gasto Total</div>
              <div className="flex items-center mt-2">
                <TrendingUp size={14} className="text-green-500 mr-1" />
                <span className="text-xs text-green-600">+12.5%</span>
              </div>
            </div>
            <DollarSign className="text-green-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{loading ? '...' : metrics?.totalConversions.toLocaleString() || '0'}</div>
              <div className="text-sm text-gray-600">Conversões</div>
              <div className="flex items-center mt-2">
                <TrendingUp size={14} className="text-green-500 mr-1" />
                <span className="text-xs text-green-600">+8.3%</span>
              </div>
            </div>
            <Users className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{loading ? '...' : ((metrics?.totalReach || 0) / 1000).toFixed(1) + 'K'}</div>
              <div className="text-sm text-gray-600">Alcance Total</div>
              <div className="flex items-center mt-2">
                <TrendingDown size={14} className="text-red-500 mr-1" />
                <span className="text-xs text-red-600">-2.1%</span>
              </div>
            </div>
            <Eye className="text-purple-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{loading ? '...' : metrics?.averageCTR.toFixed(1) + '%' || '0%'}</div>
              <div className="text-sm text-gray-600">CTR Médio</div>
              <div className="flex items-center mt-2">
                <TrendingUp size={14} className="text-green-500 mr-1" />
                <span className="text-xs text-green-600">+1.5%</span>
              </div>
            </div>
            <MousePointer className="text-orange-600" size={32} />
          </div>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance por Plataforma</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Gráfico de Performance</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversões por Período</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Gráfico de Conversões</span>
          </div>
        </div>
      </div>
    </div>
  );
}