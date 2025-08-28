'use client';

import { useState } from 'react';
import { 
  Bot, 
  Wand2, 
  Hash, 
  TrendingUp, 
  Lightbulb,
  Copy,
  RefreshCw,
  Settings,
  Sparkles,
  MessageSquare,
  BarChart3
} from 'lucide-react';

interface AIAssistantProps {
  initialContent?: string;
  platform?: 'INSTAGRAM' | 'FACEBOOK' | 'TELEGRAM';
  contentType?: 'POST' | 'STORY' | 'REEL' | 'TELEGRAM_MESSAGE';
  onContentGenerated?: (content: string) => void;
}

type AIFeature = 'generate' | 'optimize' | 'hashtags' | 'analysis' | 'ideas';

interface GenerationParams {
  type: 'POST' | 'STORY' | 'REEL' | 'TELEGRAM_MESSAGE';
  category: 'EDUCATIONAL' | 'PROMOTIONAL' | 'ANALYSIS' | 'NEWS' | 'SIGNAL';
  platform: 'INSTAGRAM' | 'FACEBOOK' | 'TELEGRAM';
  topic?: string;
  keywords?: string[];
  tone?: 'professional' | 'casual' | 'urgent' | 'educational';
  maxLength?: number;
}

export function AIAssistant({ 
  initialContent = '', 
  platform = 'INSTAGRAM',
  contentType = 'POST',
  onContentGenerated 
}: AIAssistantProps) {
  const [activeFeature, setActiveFeature] = useState<AIFeature>('generate');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  // Form states
  const [generationParams, setGenerationParams] = useState<GenerationParams>({
    type: contentType,
    category: 'EDUCATIONAL',
    platform: platform,
    topic: '',
    keywords: [],
    tone: 'professional',
    maxLength: 280
  });
  
  const [optimizationContent, setOptimizationContent] = useState(initialContent);
  const [optimizationObjective, setOptimizationObjective] = useState<'engagement' | 'reach' | 'conversion'>('engagement');
  
  const [hashtagContent, setHashtagContent] = useState(initialContent);
  const [maxHashtags, setMaxHashtags] = useState(10);
  
  const [marketPair, setMarketPair] = useState('EUR/USD');
  const [marketTimeframe, setMarketTimeframe] = useState('1h');
  const [analysisType, setAnalysisType] = useState<'technical' | 'fundamental' | 'both'>('both');
  
  const [ideaTopic, setIdeaTopic] = useState('');
  const [ideaCount, setIdeaCount] = useState(5);

  const features = [
    { id: 'generate', label: 'Gerar Conteúdo', icon: Wand2, color: 'text-purple-600' },
    { id: 'optimize', label: 'Otimizar', icon: Sparkles, color: 'text-blue-600' },
    { id: 'hashtags', label: 'Hashtags', icon: Hash, color: 'text-green-600' },
    { id: 'analysis', label: 'Análise', icon: BarChart3, color: 'text-orange-600' },
    { id: 'ideas', label: 'Ideias', icon: Lightbulb, color: 'text-yellow-600' }
  ];

  const handleGenerateContent = async () => {
    if (!generationParams.topic?.trim()) {
      setError('Por favor, informe o tópico do conteúdo');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...generationParams,
          keywords: generationParams.keywords?.filter(k => k.trim() !== '') || []
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao gerar conteúdo');
      }

      const data = await response.json();
      setResult(data.data.content);
      
      if (onContentGenerated) {
        onContentGenerated(data.data.content);
      }
    } catch (err) {
      setError('Erro ao gerar conteúdo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleOptimizeContent = async () => {
    if (!optimizationContent.trim()) {
      setError('Por favor, informe o conteúdo para otimizar');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/ai/optimize-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: optimizationContent,
          platform: generationParams.platform,
          objective: optimizationObjective
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao otimizar conteúdo');
      }

      const data = await response.json();
      setResult(data.data.optimizedContent);
      
      if (onContentGenerated) {
        onContentGenerated(data.data.optimizedContent);
      }
    } catch (err) {
      setError('Erro ao otimizar conteúdo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateHashtags = async () => {
    if (!hashtagContent.trim()) {
      setError('Por favor, informe o conteúdo para gerar hashtags');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/ai/generate-hashtags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: hashtagContent,
          platform: generationParams.platform,
          maxHashtags
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao gerar hashtags');
      }

      const data = await response.json();
      setResult(data.data.hashtags.join(' '));
    } catch (err) {
      setError('Erro ao gerar hashtags. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAnalysis = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/ai/market-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pair: marketPair,
          timeframe: marketTimeframe,
          analysisType
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao gerar análise');
      }

      const data = await response.json();
      setResult(data.data.analysis);
      
      if (onContentGenerated) {
        onContentGenerated(data.data.analysis);
      }
    } catch (err) {
      setError('Erro ao gerar análise. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
  };

  const clearResult = () => {
    setResult('');
    setError('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Assistente IA</h3>
          <p className="text-sm text-gray-600">Gere e otimize conteúdo com inteligência artificial</p>
        </div>
      </div>

      {/* Feature Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <button
              key={feature.id}
              onClick={() => {
                setActiveFeature(feature.id as AIFeature);
                clearResult();
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeFeature === feature.id
                  ? 'bg-primary-100 text-primary-700 border border-primary-200'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon size={16} className={feature.color} />
              <span className="text-sm font-medium">{feature.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content based on active feature */}
      <div className="space-y-4">
        {activeFeature === 'generate' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Conteúdo</label>
                <select
                  value={generationParams.type}
                  onChange={(e) => setGenerationParams(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="POST">Post</option>
                  <option value="STORY">Story</option>
                  <option value="REEL">Reel</option>
                  <option value="TELEGRAM_MESSAGE">Mensagem Telegram</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                <select
                  value={generationParams.category}
                  onChange={(e) => setGenerationParams(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="EDUCATIONAL">Educacional</option>
                  <option value="PROMOTIONAL">Promocional</option>
                  <option value="ANALYSIS">Análise</option>
                  <option value="NEWS">Notícias</option>
                  <option value="SIGNAL">Sinal</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tópico *</label>
              <input
                type="text"
                value={generationParams.topic || ''}
                onChange={(e) => setGenerationParams(prev => ({ ...prev, topic: e.target.value }))}
                placeholder="Ex: Análise técnica EUR/USD"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tom</label>
                <select
                  value={generationParams.tone}
                  onChange={(e) => setGenerationParams(prev => ({ ...prev, tone: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="professional">Profissional</option>
                  <option value="casual">Casual</option>
                  <option value="urgent">Urgente</option>
                  <option value="educational">Educacional</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Limite de Caracteres</label>
                <input
                  type="number"
                  value={generationParams.maxLength}
                  onChange={(e) => setGenerationParams(prev => ({ ...prev, maxLength: parseInt(e.target.value) }))}
                  min="50"
                  max="2000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateContent}
              disabled={loading}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4" />
              )}
              <span>{loading ? 'Gerando...' : 'Gerar Conteúdo'}</span>
            </button>
          </div>
        )}

        {activeFeature === 'optimize' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Conteúdo para Otimizar *</label>
              <textarea
                value={optimizationContent}
                onChange={(e) => setOptimizationContent(e.target.value)}
                placeholder="Cole seu conteúdo aqui para otimização..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Objetivo da Otimização</label>
              <select
                value={optimizationObjective}
                onChange={(e) => setOptimizationObjective(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="engagement">Maximizar Engajamento</option>
                <option value="reach">Maximizar Alcance</option>
                <option value="conversion">Maximizar Conversão</option>
              </select>
            </div>

            <button
              onClick={handleOptimizeContent}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>{loading ? 'Otimizando...' : 'Otimizar Conteúdo'}</span>
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Resultado</h4>
              <div className="flex space-x-2">
                <button
                  onClick={copyToClipboard}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                  title="Copiar"
                >
                  <Copy size={16} />
                </button>
                <button
                  onClick={clearResult}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                  title="Limpar"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm text-gray-900 font-sans">{result}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}