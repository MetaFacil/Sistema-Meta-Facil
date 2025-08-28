'use client';

import { Settings, Users, TrendingUp, Calendar } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

interface MarketingManagerHeaderProps {
  totalBudget: number;
  totalSpent: number;
  activeCampaigns: number;
  totalCampaigns: number;
  dateRange: {
    from: Date;
    to: Date;
  };
  onDateRangeChange: Dispatch<SetStateAction<{ from: Date; to: Date; }>>;
}

export function MarketingManagerHeader({ 
  totalBudget, 
  totalSpent, 
  activeCampaigns, 
  totalCampaigns 
}: MarketingManagerHeaderProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Title Section */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <TrendingUp size={24} className="text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Marketing Manager</h1>
            <p className="text-gray-600">Gerenciamento automático de campanhas e audiência</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2">
            <Calendar size={16} />
            <span>Nova Campanha</span>
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
            <Users size={16} />
            <span>Audiência</span>
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">{activeCampaigns} Campanhas Ativas</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Orçamento: R$ {totalBudget.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-gray-600">Gasto: R$ {totalSpent.toLocaleString()}</span>
            </div>
          </div>
          <div className="text-gray-500 text-sm">
            Última sincronização: {new Date().toLocaleTimeString('pt-BR')}
          </div>
        </div>
      </div>
    </div>
  );
}