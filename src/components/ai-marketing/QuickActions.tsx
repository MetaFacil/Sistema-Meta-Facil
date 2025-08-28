'use client';

import { 
  BarChart3, 
  Lightbulb, 
  Target, 
  TrendingUp, 
  Zap,
  MessageSquare,
  PieChart,
  Brain
} from 'lucide-react';

interface QuickActionsProps {
  onActionClick: (action: string) => void;
}

const quickActions = [
  {
    id: 'market_analysis',
    title: 'Análise de Mercado',
    description: 'Análise técnica completa do par selecionado',
    icon: BarChart3,
    color: 'bg-blue-100 text-blue-600',
    bgColor: 'hover:bg-blue-50'
  },
  {
    id: 'content_ideas',
    title: 'Ideias de Conteúdo',
    description: 'Gerar ideias de posts para redes sociais',
    icon: Lightbulb,
    color: 'bg-yellow-100 text-yellow-600',
    bgColor: 'hover:bg-yellow-50'
  },
  {
    id: 'strategy_tips',
    title: 'Estratégias de Marketing',
    description: 'Dicas de marketing para opções binárias',
    icon: Target,
    color: 'bg-green-100 text-green-600',
    bgColor: 'hover:bg-green-50'
  },
  {
    id: 'performance_review',
    title: 'Análise de Performance',
    description: 'Review das campanhas e sugestões',
    icon: TrendingUp,
    color: 'bg-purple-100 text-purple-600',
    bgColor: 'hover:bg-purple-50'
  }
];

const aiFeatures = [
  {
    id: 'market_insights',
    title: 'Insights de Mercado',
    description: 'Análise em tempo real dos movimentos do mercado',
    icon: Brain,
    stats: '24/7'
  },
  {
    id: 'content_optimization',
    title: 'Otimização de Conteúdo',
    description: 'IA otimiza seus posts para máximo engajamento',
    icon: Zap,
    stats: '+85%'
  },
  {
    id: 'audience_analysis',
    title: 'Análise de Audiência',
    description: 'Entenda melhor seu público-alvo',
    icon: PieChart,
    stats: '360°'
  },
  {
    id: 'auto_responses',
    title: 'Respostas Automáticas',
    description: 'IA responde dúvidas comuns automaticamente',
    icon: MessageSquare,
    stats: 'Auto'
  }
];

export function QuickActions({ onActionClick }: QuickActionsProps) {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
        <div className="space-y-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => onActionClick(action.id)}
                className={`w-full p-4 rounded-lg border border-gray-200 text-left transition-colors ${action.bgColor}`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{action.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* AI Features */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recursos de IA</h3>
        <div className="space-y-4">
          {aiFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.id} className="flex items-start space-x-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Icon size={16} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 text-sm">{feature.title}</h4>
                    <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      {feature.stats}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas Rápidas</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Consultas IA hoje</span>
            <span className="font-semibold text-gray-900">47</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Conteúdo gerado</span>
            <span className="font-semibold text-gray-900">12</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Análises realizadas</span>
            <span className="font-semibold text-gray-900">8</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Taxa de sucesso</span>
            <span className="font-semibold text-green-600">87%</span>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-6">
        <h3 className="text-lg font-semibold text-yellow-900 mb-3">💡 Dica do Dia</h3>
        <p className="text-sm text-yellow-800">
          Use perguntas específicas para obter análises mais precisas. 
          Exemplo: "Analise EUR/USD no timeframe de 1 hora considerando RSI e MACD"
        </p>
      </div>
    </div>
  );
}