'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  Plus, 
  Search, 
  Filter,
  Edit2,
  Trash2,
  Eye,
  Play,
  Pause,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  MousePointer,
  Target,
  Calendar,
  BarChart3,
  Settings,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

interface Campaign {
  id: string;
  name: string;
  type: 'ORGANIC' | 'PAID';
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  objective: 'AWARENESS' | 'TRAFFIC' | 'ENGAGEMENT' | 'LEADS' | 'CONVERSIONS';
  budget: number;
  spent: number;
  startDate: Date;
  endDate?: Date;
  targetAudience?: any;
  createdAt: Date;
  updatedAt: Date;
  metrics: {
    impressions: number;
    reach: number;
    clicks: number;
    ctr: number;
    cpm: number;
    cpc: number;
    conversions: number;
    conversionRate: number;
  };
}

export default function CampaignsPage() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED'>('ALL');
  const [filterType, setFilterType] = useState<'ALL' | 'ORGANIC' | 'PAID'>('ALL');
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);

  // Mock data
  useEffect(() => {
    const mockCampaigns: Campaign[] = [
      {
        id: '1',
        name: 'Campanha de Awareness - Opções Binárias',
        type: 'PAID',
        status: 'ACTIVE',
        objective: 'AWARENESS',
        budget: 1000,
        spent: 450.50,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-02-15'),
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-20'),
        metrics: {
          impressions: 15680,
          reach: 12340,
          clicks: 234,
          ctr: 1.49,
          cpm: 36.50,
          cpc: 1.92,
          conversions: 12,
          conversionRate: 5.13
        }
      },
      {
        id: '2',
        name: 'Promoção Curso Trading Avançado',
        type: 'PAID',
        status: 'ACTIVE',
        objective: 'CONVERSIONS',
        budget: 2500,
        spent: 1875.25,
        startDate: new Date('2024-01-20'),
        endDate: new Date('2024-02-20'),
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-22'),
        metrics: {
          impressions: 28450,
          reach: 21230,
          clicks: 567,
          ctr: 1.99,
          cpm: 88.34,
          cpc: 3.31,
          conversions: 34,
          conversionRate: 6.00
        }
      },
      {
        id: '3',
        name: 'Conteúdo Orgânico - Educação Trading',
        type: 'ORGANIC',
        status: 'ACTIVE',
        objective: 'ENGAGEMENT',
        budget: 0,
        spent: 0,
        startDate: new Date('2024-01-01'),
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-22'),
        metrics: {
          impressions: 8920,
          reach: 7450,
          clicks: 189,
          ctr: 2.12,
          cpm: 0,
          cpc: 0,
          conversions: 8,
          conversionRate: 4.23
        }
      },
      {
        id: '4',
        name: 'Black Friday - Sinais Premium',
        type: 'PAID',
        status: 'COMPLETED',
        objective: 'CONVERSIONS',
        budget: 5000,
        spent: 4950.75,
        startDate: new Date('2023-11-20'),
        endDate: new Date('2023-11-30'),
        createdAt: new Date('2023-11-15'),
        updatedAt: new Date('2023-11-30'),
        metrics: {
          impressions: 45670,
          reach: 34820,
          clicks: 1234,
          ctr: 2.70,
          cpm: 142.18,
          cpc: 4.01,
          conversions: 89,
          conversionRate: 7.21
        }
      }
    ];

    setTimeout(() => {
      setCampaigns(mockCampaigns);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || campaign.status === filterStatus;
    const matchesType = filterType === 'ALL' || campaign.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalBudget = campaigns.reduce((acc, campaign) => acc + campaign.budget, 0);
  const totalSpent = campaigns.reduce((acc, campaign) => acc + campaign.spent, 0);
  const totalImpressions = campaigns.reduce((acc, campaign) => acc + campaign.metrics.impressions, 0);
  const totalClicks = campaigns.reduce((acc, campaign) => acc + campaign.metrics.clicks, 0);
  const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

  const getStatusBadge = (status: Campaign['status']) => {
    const styles = {
      DRAFT: 'bg-gray-100 text-gray-800',
      ACTIVE: 'bg-green-100 text-green-800',
      PAUSED: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-blue-100 text-blue-800'
    };

    const labels = {
      DRAFT: 'Rascunho',
      ACTIVE: 'Ativa',
      PAUSED: 'Pausada',
      COMPLETED: 'Concluída'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getObjectiveBadge = (objective: Campaign['objective']) => {
    const labels = {
      AWARENESS: 'Reconhecimento',
      TRAFFIC: 'Tráfego',
      ENGAGEMENT: 'Engajamento',
      LEADS: 'Leads',
      CONVERSIONS: 'Conversões'
    };

    return (
      <span className="px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded">
        {labels[objective]}
      </span>
    );
  };

  const handleToggleCampaign = (campaignId: string, currentStatus: Campaign['status']) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId 
        ? { ...campaign, status: newStatus, updatedAt: new Date() }
        : campaign
    ));
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campanhas</h1>
          <p className="text-gray-600 mt-2">Gerencie suas campanhas de marketing digital</p>
        </div>
        
        <div className="flex space-x-3">
          <Link
            href={"/campaigns/analytics" as any}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <BarChart3 size={16} />
            <span>Analytics</span>
          </Link>
          
          <Link
            href={"/campaigns/settings" as any}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <Settings size={16} />
            <span>Configurações</span>
          </Link>
          
          <Link
            href={"/campaigns/new" as any}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus size={16} />
            <span>Nova Campanha</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Campanhas Ativas</p>
              <p className="text-2xl font-bold text-gray-900">
                {campaigns.filter(c => c.status === 'ACTIVE').length}
              </p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp size={12} className="mr-1" />
                +2 este mês
              </p>
            </div>
            <Target className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Budget Total</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {totalBudget.toLocaleString('pt-BR')}
              </p>
              <p className="text-xs text-gray-600">
                Gasto: R$ {totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Impressões</p>
              <p className="text-2xl font-bold text-gray-900">
                {(totalImpressions / 1000).toFixed(1)}K
              </p>
              <p className="text-xs text-blue-600 flex items-center mt-1">
                <TrendingUp size={12} className="mr-1" />
                +15% vs mês anterior
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">CTR Médio</p>
              <p className="text-2xl font-bold text-gray-900">
                {avgCtr.toFixed(2)}%
              </p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp size={12} className="mr-1" />
                +0.3% vs mês anterior
              </p>
            </div>
            <MousePointer className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar campanhas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="ALL">Todos os Status</option>
              <option value="DRAFT">Rascunhos</option>
              <option value="ACTIVE">Ativas</option>
              <option value="PAUSED">Pausadas</option>
              <option value="COMPLETED">Concluídas</option>
            </select>
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="ALL">Todos os Tipos</option>
            <option value="PAID">Pagas</option>
            <option value="ORGANIC">Orgânicas</option>
          </select>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredCampaigns.length === 0 ? (
          <div className="p-12 text-center">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma campanha encontrada</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Tente ajustar sua busca.' : 'Comece criando sua primeira campanha.'}
            </p>
            <Link
              href={"/campaigns/new" as any}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <Plus size={16} />
              <span>Criar Primeira Campanha</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-900">Campanha</th>
                  <th className="text-left p-4 font-medium text-gray-900">Status</th>
                  <th className="text-left p-4 font-medium text-gray-900">Tipo</th>
                  <th className="text-left p-4 font-medium text-gray-900">Budget</th>
                  <th className="text-left p-4 font-medium text-gray-900">Performance</th>
                  <th className="text-left p-4 font-medium text-gray-900">Data</th>
                  <th className="text-right p-4 font-medium text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          {getObjectiveBadge(campaign.objective)}
                          {campaign.budget > 0 && campaign.spent / campaign.budget > 0.8 && (
                            <span className="flex items-center text-xs text-amber-600">
                              <AlertTriangle size={12} className="mr-1" />
                              80% do budget usado
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(campaign.status)}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded ${
                        campaign.type === 'PAID' 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {campaign.type === 'PAID' ? 'Paga' : 'Orgânica'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">
                          {campaign.budget > 0 
                            ? `R$ ${campaign.budget.toLocaleString('pt-BR')}`
                            : 'Orgânica'
                          }
                        </p>
                        {campaign.budget > 0 && (
                          <p className="text-gray-600">
                            Gasto: R$ {campaign.spent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Impressões:</span>
                          <span className="font-medium">{campaign.metrics.impressions.toLocaleString('pt-BR')}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">CTR:</span>
                          <span className="font-medium">{campaign.metrics.ctr.toFixed(2)}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Conversões:</span>
                          <span className="font-medium">{campaign.metrics.conversions}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{campaign.startDate.toLocaleDateString('pt-BR')}</span>
                      </div>
                      {campaign.endDate && (
                        <div className="text-xs text-gray-500 mt-1">
                          até {campaign.endDate.toLocaleDateString('pt-BR')}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/campaigns/${campaign.id}/analytics` as any}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                          title="Analytics"
                        >
                          <BarChart3 size={16} />
                        </Link>
                        
                        {campaign.status === 'ACTIVE' || campaign.status === 'PAUSED' ? (
                          <button
                            onClick={() => handleToggleCampaign(campaign.id, campaign.status)}
                            className={`p-2 rounded ${
                              campaign.status === 'ACTIVE'
                                ? 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-50'
                                : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                            }`}
                            title={campaign.status === 'ACTIVE' ? 'Pausar' : 'Ativar'}
                          >
                            {campaign.status === 'ACTIVE' ? <Pause size={16} /> : <Play size={16} />}
                          </button>
                        ) : null}
                        
                        <Link
                          href={`/campaigns/edit/${campaign.id}` as any}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </Link>
                        
                        <button
                          onClick={() => {
                            if (window.confirm('Tem certeza que deseja excluir esta campanha?')) {
                              setCampaigns(prev => prev.filter(c => c.id !== campaign.id));
                            }
                          }}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}