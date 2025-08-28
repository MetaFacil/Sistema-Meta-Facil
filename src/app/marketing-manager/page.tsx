'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MarketingManagerHeader } from '@/components/marketing-manager/MarketingManagerHeader';
import { CampaignOverview } from '@/components/marketing-manager/CampaignOverview';
import { PerformanceMetrics } from '@/components/marketing-manager/PerformanceMetrics';
import { AutomationRules } from '@/components/marketing-manager/AutomationRules';
import { ContentCalendar } from '@/components/marketing-manager/ContentCalendar';
import { AudienceInsights } from '@/components/marketing-manager/AudienceInsights';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useContent } from '@/hooks/useContent';

interface MarketingCampaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed' | 'draft';
  type: 'awareness' | 'conversion' | 'engagement' | 'traffic';
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

// Campanhas reais serão carregadas da API futuramente
// Por enquanto, lista vazia para remover dados fictícios
const REAL_CAMPAIGNS: MarketingCampaign[] = [];

export default function MarketingManagerPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'automation' | 'calendar' | 'audience'>('overview');
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(REAL_CAMPAIGNS);
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  });

  const { 
    overallMetrics, 
    platformMetrics, 
    fetchAnalytics, 
    loading: analyticsLoading 
  } = useAnalytics();

  const { 
    contents, 
    fetchContents, 
    loading: contentLoading 
  } = useContent();

  useEffect(() => {
    fetchAnalytics(dateRange);
    fetchContents();
  }, [dateRange]);

  const activeCampaigns = campaigns.filter(c => c.status === 'active');
  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalReach = campaigns.reduce((sum, c) => sum + c.reach, 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);
  const averageCTR = campaigns.length > 0 ? campaigns.reduce((sum, c) => sum + c.ctr, 0) / campaigns.length : 0;

  const handleCampaignAction = (campaignId: string, action: 'pause' | 'resume' | 'stop' | 'duplicate') => {
    setCampaigns(prev => prev.map(campaign => {
      if (campaign.id === campaignId) {
        switch (action) {
          case 'pause':
            return { ...campaign, status: 'paused' as const };
          case 'resume':
            return { ...campaign, status: 'active' as const };
          case 'stop':
            return { ...campaign, status: 'completed' as const };
          default:
            return campaign;
        }
      }
      return campaign;
    }));
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <MarketingManagerHeader 
          totalBudget={totalBudget}
          totalSpent={totalSpent}
          activeCampaigns={activeCampaigns.length}
          totalCampaigns={campaigns.length}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Visão Geral', icon: '📊' },
                { id: 'campaigns', label: 'Campanhas', icon: '🎯' },
                { id: 'automation', label: 'Automação', icon: '⚡' },
                { id: 'calendar', label: 'Calendário', icon: '📅' },
                { id: 'audience', label: 'Audiência', icon: '👥' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <PerformanceMetrics
                metrics={{
                  totalReach,
                  totalSpent,
                  totalConversions,
                  averageCTR,
                  activeCampaigns: activeCampaigns.length,
                  budgetUtilization: (totalSpent / totalBudget) * 100
                }}
                loading={analyticsLoading}
              />
              <CampaignOverview
                campaigns={campaigns}
                onCampaignAction={handleCampaignAction}
                loading={false}
              />
            </div>
          )}

          {activeTab === 'campaigns' && (
            <CampaignOverview
              campaigns={campaigns}
              onCampaignAction={handleCampaignAction}
              loading={false}
              showDetails={true}
            />
          )}

          {activeTab === 'automation' && (
            <AutomationRules 
              rules={[]}
              onCreateRule={() => {}}
              onEditRule={() => {}}
              onDeleteRule={() => {}}
              onToggleRule={() => {}}
            />
          )}

          {activeTab === 'calendar' && (
            <ContentCalendar 
              contents={contents}
              loading={contentLoading}
            />
          )}

          {activeTab === 'audience' && (
            <AudienceInsights
              platformMetrics={platformMetrics}
              overallMetrics={overallMetrics}
              loading={analyticsLoading}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}