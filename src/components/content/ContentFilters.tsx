'use client';

import { Filter, RefreshCw } from 'lucide-react';
import { ContentCategory, ContentStatus, Platform } from '@/types';
import { CONTENT_CATEGORIES, CONTENT_STATUS } from '@/lib/constants';

interface ContentFiltersProps {
  filters: {
    category: ContentCategory | 'ALL';
    status: ContentStatus | 'ALL';
    platform: Platform | 'ALL';
    dateRange: 'ALL' | 'TODAY' | 'WEEK' | 'MONTH';
  };
  onFilterChange: (filters: ContentFiltersProps['filters']) => void;
  contentCount: number;
  totalCount: number;
}

export function ContentFilters({ filters, onFilterChange, contentCount, totalCount }: ContentFiltersProps) {
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const handleReset = () => {
    onFilterChange({
      category: 'ALL',
      status: 'ALL',
      platform: 'ALL',
      dateRange: 'ALL'
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== 'ALL');

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter size={20} className="text-gray-600" />
          <h3 className="font-medium text-gray-900">Filtros</h3>
          <span className="text-sm text-gray-500">
            ({contentCount} de {totalCount} conteúdos)
          </span>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
          >
            <RefreshCw size={14} />
            <span>Limpar filtros</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoria
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          >
            <option value="ALL">Todas as categorias</option>
            {Object.entries(CONTENT_CATEGORIES).map(([key, category]) => (
              <option key={key} value={key}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          >
            <option value="ALL">Todos os status</option>
            {Object.entries(CONTENT_STATUS).map(([key, status]) => (
              <option key={key} value={key}>
                {status.name}
              </option>
            ))}
          </select>
        </div>

        {/* Platform Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Plataforma
          </label>
          <select
            value={filters.platform}
            onChange={(e) => handleFilterChange('platform', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          >
            <option value="ALL">Todas as plataformas</option>
            <option value="INSTAGRAM">Instagram</option>
            <option value="FACEBOOK">Facebook</option>
            <option value="TELEGRAM">Telegram</option>
          </select>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Período
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          >
            <option value="ALL">Todos os períodos</option>
            <option value="TODAY">Hoje</option>
            <option value="WEEK">Última semana</option>
            <option value="MONTH">Último mês</option>
          </select>
        </div>
      </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filters.category !== 'ALL' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Categoria: {CONTENT_CATEGORIES[filters.category as ContentCategory]?.name}
              </span>
            )}
            {filters.status !== 'ALL' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Status: {CONTENT_STATUS[filters.status as ContentStatus]?.name}
              </span>
            )}
            {filters.platform !== 'ALL' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Plataforma: {filters.platform}
              </span>
            )}
            {filters.dateRange !== 'ALL' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Período: {
                  filters.dateRange === 'TODAY' ? 'Hoje' :
                  filters.dateRange === 'WEEK' ? 'Última semana' :
                  'Último mês'
                }
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}