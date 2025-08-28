'use client';

import { 
  Play, 
  Pause, 
  Edit, 
  Eye, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Users,
  Clock,
  Target
} from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'draft';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
  startDate: Date;
  endDate: Date;
  platform: 'facebook' | 'instagram' | 'telegram';
}

interface MarketingCampaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed' | 'draft';
  type: string;
  budget: number;
  spent: number;
  reach: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
  startDate: Date;
  endDate?: Date;
  platforms: string[];
}

interface CampaignOverviewProps {
  campaigns?: MarketingCampaign[];
  onCampaignAction?: (campaignId: string, action: 'pause' | 'resume' | 'stop' | 'duplicate') => void;
  loading?: boolean;
  showDetails?: boolean;
}

export function CampaignOverview({ 
  campaigns: propCampaigns, 
  onCampaignAction, 
  loading = false, 
  showDetails = false 
}: CampaignOverviewProps) {
  // Use campaigns from props or empty array (no mock data)
  const campaigns: Campaign[] = propCampaigns ? propCampaigns.map(campaign => ({
    id: campaign.id,
    name: campaign.name,
    status: campaign.status as 'active' | 'paused' | 'draft',
    budget: campaign.budget,
    spent: campaign.spent,
    impressions: campaign.impressions,
    clicks: campaign.clicks,
    conversions: campaign.conversions,
    ctr: campaign.ctr,
    cpc: campaign.cpc,
    startDate: campaign.startDate,
    endDate: campaign.endDate || new Date(),
    platform: 'facebook' as const
  })) : [];

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlatformColor = (platform: Campaign['platform']) => {
    switch (platform) {
      case 'facebook':
        return 'bg-blue-600';
      case 'instagram':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'telegram':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {campaigns.filter(c => c.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Campanhas Ativas</div>
            </div>
            <Play className="text-green-600" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(campaigns.reduce((sum, c) => sum + c.spent, 0))}
              </div>
              <div className="text-sm text-gray-600">Total Gasto</div>
            </div>
            <DollarSign className="text-blue-600" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {formatNumber(campaigns.reduce((sum, c) => sum + c.clicks, 0))}
              </div>
              <div className="text-sm text-gray-600">Total Cliques</div>
            </div>
            <Target className="text-purple-600" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {campaigns.reduce((sum, c) => sum + c.conversions, 0)}
              </div>
              <div className="text-sm text-gray-600">Conversões</div>
            </div>
            <Users className="text-green-600" size={24} />
          </div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Campanhas Ativas</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campanha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orçamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CTR
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CPC
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${getPlatformColor(campaign.platform)}`}></div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                        <div className="text-sm text-gray-500 capitalize">{campaign.platform}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
                      {campaign.status === 'active' ? 'Ativa' : 
                       campaign.status === 'paused' ? 'Pausada' : 'Rascunho'}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>{formatCurrency(campaign.budget)}</div>
                    <div className="text-xs text-gray-500">
                      Gasto: {formatCurrency(campaign.spent)}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-2">
                      <div>
                        <div>{formatNumber(campaign.impressions)} impressões</div>
                        <div className="text-xs text-gray-500">
                          {campaign.conversions} conversões
                        </div>
                      </div>
                      {campaign.conversions > 50 ? (
                        <TrendingUp size={16} className="text-green-500" />
                      ) : (
                        <TrendingDown size={16} className="text-red-500" />
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {campaign.ctr.toFixed(2)}%
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(campaign.cpc)}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye size={16} />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Edit size={16} />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        {campaign.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
        <h3 className="text-lg font-semibold text-purple-900 mb-4">📊 Resumo de Performance</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-purple-800">
          <div className="bg-white rounded-lg p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {((campaigns.reduce((sum, c) => sum + c.conversions, 0) / 
                   campaigns.reduce((sum, c) => sum + c.clicks, 0)) * 100).toFixed(1)}%
              </div>
              <div className="text-purple-600">Taxa de Conversão Média</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(campaigns.reduce((sum, c) => sum + c.spent, 0) / 
                               campaigns.reduce((sum, c) => sum + c.conversions, 0))}
              </div>
              <div className="text-blue-600">Custo por Conversão</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(campaigns.reduce((sum, c) => sum + c.conversions, 0) * 15 - 
                               campaigns.reduce((sum, c) => sum + c.spent, 0))}
              </div>
              <div className="text-green-600">ROI Estimado</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}