'use client';

import { 
  RefreshCw, 
  Download, 
  Filter,
  Calendar,
  TrendingUp
} from 'lucide-react';

interface AnalyticsHeaderProps {
  dateRange: '7d' | '30d' | '90d' | '1y';
  onDateRangeChange: (range: '7d' | '30d' | '90d' | '1y') => void;
  selectedPlatform: 'all' | 'instagram' | 'facebook' | 'telegram';
  onPlatformChange: (platform: 'all' | 'instagram' | 'facebook' | 'telegram') => void;
  onRefresh: () => void;
  loading: boolean;
}

const dateRangeOptions = [
  { value: '7d' as const, label: 'Últimos 7 dias' },
  { value: '30d' as const, label: 'Últimos 30 dias' },
  { value: '90d' as const, label: 'Últimos 90 dias' },
  { value: '1y' as const, label: 'Último ano' }
];

const platformOptions = [
  { value: 'all' as const, label: 'Todas as plataformas' },
  { value: 'instagram' as const, label: 'Instagram' },
  { value: 'facebook' as const, label: 'Facebook' },
  { value: 'telegram' as const, label: 'Telegram' }
];

export function AnalyticsHeader({
  dateRange,
  onDateRangeChange,
  selectedPlatform,
  onPlatformChange,
  onRefresh,
  loading
}: AnalyticsHeaderProps) {
  const handleExport = () => {
    // Implementar exportação de relatórios
    console.log('Exportando relatórios...');
  };

  return (
    <div>
      {/* Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <TrendingUp size={28} className="mr-3 text-primary-600" />
            Análises e Relatórios
          </h1>
          <p className="mt-2 text-gray-600">
            Acompanhe o desempenho das suas campanhas de marketing em opções binárias
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Atualizar</span>
          </button>
          
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Download size={16} />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-600" />
            <span className="font-medium text-gray-900">Filtros:</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Date Range Filter */}
            <div className="flex items-center space-x-2">
              <Calendar size={16} className="text-gray-500" />
              <label className="text-sm font-medium text-gray-700">Período:</label>
              <select
                value={dateRange}
                onChange={(e) => onDateRangeChange(e.target.value as typeof dateRange)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              >
                {dateRangeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Platform Filter */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Plataforma:</label>
              <select
                value={selectedPlatform}
                onChange={(e) => onPlatformChange(e.target.value as typeof selectedPlatform)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              >
                {platformOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              📅 {dateRangeOptions.find(opt => opt.value === dateRange)?.label}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              🌐 {platformOptions.find(opt => opt.value === selectedPlatform)?.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}