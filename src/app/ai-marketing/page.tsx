'use client';

import { useState, useRef, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AIMarketingHeader } from '@/components/ai-marketing/AIMarketingHeader';
import { AIAssistantChat } from '@/components/ai-marketing/AIAssistantChat';
import { MarketAnalysisPanel } from '@/components/ai-marketing/MarketAnalysisPanel';
import { ContentSuggestions } from '@/components/ai-marketing/ContentSuggestions';
import { PerformanceInsights } from '@/components/ai-marketing/PerformanceInsights';
import { QuickActions } from '@/components/ai-marketing/QuickActions';
import { useAI } from '@/hooks/useAI';
import { useAnalytics } from '@/hooks/useAnalytics';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: Record<string, any>;
}

export default function AIMarketingPage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'analysis' | 'suggestions' | 'insights'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Olá! Sou seu assistente de IA especializado em marketing para opções binárias. Como posso ajudá-lo hoje? Posso fornecer análises de mercado, gerar conteúdo otimizado, sugerir estratégias de marketing ou responder dúvidas sobre o mercado financeiro.',
      timestamp: new Date(),
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [selectedPair, setSelectedPair] = useState('EUR/USD');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1H');
  
  const { 
    chatWithAssistant, 
    analyzeMarket, 
    generateContentIdeas, 
    loading: aiLoading 
  } = useAI();
  
  const { 
    overallMetrics, 
    platformMetrics, 
    loading: analyticsLoading 
  } = useAnalytics();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || aiLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Gerar contexto com base nas métricas e dados disponíveis
    const context = {
      currentMetrics: overallMetrics,
      platformData: platformMetrics,
      selectedPair,
      timeframe: selectedTimeframe,
    };

    const result = await chatWithAssistant(inputMessage, context);

    if (result.success && result.response) {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: result.response,
        timestamp: new Date(),
        context,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } else {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Wrapper para corrigir tipos
  const handleAnalyzeMarket = async (pair: string, timeframe: string): Promise<{ success: boolean; analysis?: string; error?: string }> => {
    const result = await analyzeMarket(pair, timeframe);
    if (result.success && result.analysis) {
      return {
        success: true,
        analysis: typeof result.analysis === 'string' ? result.analysis : JSON.stringify(result.analysis),
        error: result.error
      };
    }
    return {
      success: result.success,
      analysis: undefined,
      error: result.error
    };
  };

  const handleGenerateContentIdeas = async (category: any, targetAudience: string) => {
    return await generateContentIdeas(category, targetAudience);
  };

  const handleQuickAction = async (action: string) => {
    let prompt = '';
    
    switch (action) {
      case 'market_analysis':
        prompt = `Faça uma análise completa do par ${selectedPair} no timeframe ${selectedTimeframe}. Inclua tendências, níveis de suporte/resistência e recomendações para opções binárias.`;
        break;
      case 'content_ideas':
        prompt = 'Gere 5 ideias de conteúdo para Instagram sobre opções binárias que podem aumentar o engajamento e atrair novos seguidores interessados em trading.';
        break;
      case 'strategy_tips':
        prompt = 'Forneça 3 estratégias de marketing digital específicas para promover sinais de opções binárias nas redes sociais, focando em compliance e transparência.';
        break;
      case 'performance_review':
        prompt = 'Com base nas métricas atuais, analise o desempenho das campanhas e sugira melhorias específicas para aumentar o ROI.';
        break;
      default:
        return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: prompt,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    const context = {
      currentMetrics: overallMetrics,
      platformData: platformMetrics,
      selectedPair,
      timeframe: selectedTimeframe,
      quickAction: action,
    };

    const result = await chatWithAssistant(prompt, context);

    if (result.success && result.response) {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: result.response,
        timestamp: new Date(),
        context,
      };

      setMessages(prev => [...prev, assistantMessage]);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <AIMarketingHeader 
          selectedPair={selectedPair}
          onPairChange={setSelectedPair}
          selectedTimeframe={selectedTimeframe}
          onTimeframeChange={setSelectedTimeframe}
        />

        {/* Tabs Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'chat', label: 'Assistente IA', icon: '🤖' },
                { id: 'analysis', label: 'Análise de Mercado', icon: '📊' },
                { id: 'suggestions', label: 'Sugestões de Conteúdo', icon: '💡' },
                { id: 'insights', label: 'Insights de Performance', icon: '📈' },
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
          {activeTab === 'chat' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chat Area */}
              <div className="lg:col-span-2">
                <AIAssistantChat
                  messages={messages}
                  inputMessage={inputMessage}
                  onInputChange={setInputMessage}
                  onSendMessage={handleSendMessage}
                  onKeyPress={handleKeyPress}
                  loading={aiLoading}
                  messagesEndRef={messagesEndRef}
                />
              </div>

              {/* Quick Actions */}
              <div className="lg:col-span-1">
                <QuickActions onActionClick={handleQuickAction} />
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <MarketAnalysisPanel
              selectedPair={selectedPair}
              selectedTimeframe={selectedTimeframe}
              onAnalyze={handleAnalyzeMarket}
              loading={aiLoading}
            />
          )}

          {activeTab === 'suggestions' && (
            <ContentSuggestions
              loading={aiLoading}
            />
          )}

          {activeTab === 'insights' && overallMetrics && (
            <PerformanceInsights
              metrics={{
                totalPosts: overallMetrics.totalPosts,
                totalViews: overallMetrics.totalReach,
                totalEngagement: overallMetrics.totalEngagement,
                totalFollowers: 0,
                conversionRate: 0,
                revenue: 0
              }}
              platformMetrics={{
                instagram: { followers: 0, engagement: 0, reach: 0, impressions: 0 },
                facebook: { followers: 0, engagement: 0, reach: 0, impressions: 0 },
                telegram: { subscribers: 0, messagesSent: 0, clickRate: 0, conversionRate: 0 }
              }}
              loading={analyticsLoading}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}