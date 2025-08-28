'use client';

import { useState } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Lightbulb, 
  Target, 
  TrendingUp,
  Hash,
  MessageSquare,
  Sparkles
} from 'lucide-react';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

const promptSuggestions = [
  {
    icon: TrendingUp,
    title: 'Análise de Mercado',
    description: 'Criar análise técnica do EUR/USD',
    prompt: 'Crie uma análise técnica detalhada do par EUR/USD para traders de opções binárias, incluindo pontos de entrada e saída, com foco em gestão de risco.'
  },
  {
    icon: Lightbulb,
    title: 'Conteúdo Educativo',
    description: 'Dicas para iniciantes',
    prompt: 'Escreva um post educativo sobre os 5 erros mais comuns que iniciantes cometem em opções binárias e como evitá-los.'
  },
  {
    icon: Target,
    title: 'Estratégia de Trading',
    description: 'Estratégia para hoje',
    prompt: 'Desenvolva uma estratégia de trading para o dia atual, considerando indicadores técnicos como RSI, MACD e Bollinger Bands.'
  },
  {
    icon: Hash,
    title: 'Hashtags Otimizadas',
    description: 'Gerar hashtags relevantes',
    prompt: 'Sugira 20 hashtags relevantes e populares para conteúdo sobre opções binárias no Brasil, dividindo entre hashtags gerais e específicas.'
  }
];

export function AIAssistant({ isOpen, onClose, onGenerate, isGenerating }: AIAssistantProps) {
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('educativo');

  const handleGenerate = (prompt: string) => {
    onGenerate(prompt);
    setCustomPrompt('');
  };

  const handleCustomGenerate = () => {
    if (customPrompt.trim()) {
      handleGenerate(customPrompt);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">IA Marketing Assistant</h2>
                <p className="text-sm text-gray-600">Especialista em opções binárias</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Category Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de Conteúdo
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['educativo', 'promocional', 'análise', 'sinal'].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    p-3 rounded-lg border text-sm font-medium transition-colors
                    ${selectedCategory === category
                      ? 'border-purple-300 bg-purple-50 text-purple-700'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Suggestions */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <Sparkles size={16} className="mr-2 text-purple-600" />
              Sugestões Rápidas
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {promptSuggestions.map((suggestion, index) => {
                const Icon = suggestion.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleGenerate(suggestion.prompt)}
                    disabled={isGenerating}
                    className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Icon size={16} className="text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Prompt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
              <MessageSquare size={16} className="mr-2" />
              Prompt Personalizado
            </label>
            <div className="space-y-3">
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Descreva o que você gostaria que a IA criasse para você..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
              <button
                onClick={handleCustomGenerate}
                disabled={!customPrompt.trim() || isGenerating}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
                <span>{isGenerating ? 'Gerando...' : 'Gerar Conteúdo'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-start space-x-3">
            <Lightbulb size={16} className="text-yellow-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-gray-900">Dicas para melhores resultados:</h4>
              <ul className="text-xs text-gray-600 mt-1 space-y-1">
                <li>• Seja específico sobre o tipo de análise ou estratégia</li>
                <li>• Mencione o público-alvo (iniciantes, experientes, etc.)</li>
                <li>• Indique se quer foco em educação ou oportunidades</li>
                <li>• Especifique pares de moedas ou ativos se relevante</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}