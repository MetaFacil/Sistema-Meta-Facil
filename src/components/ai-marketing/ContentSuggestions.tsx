'use client';

import { useState } from 'react';
import { 
  Lightbulb, 
  TrendingUp, 
  Clock, 
  Target, 
  Copy, 
  RefreshCw, 
  Heart,
  MessageSquare,
  Share2,
  Instagram,
  Facebook,
  Send,
  Sparkles
} from 'lucide-react';

interface ContentSuggestion {
  id: string;
  type: 'post' | 'story' | 'video' | 'carousel';
  platform: 'INSTAGRAM' | 'FACEBOOK' | 'TELEGRAM' | 'ALL';
  title: string;
  content: string;
  hashtags: string[];
  estimatedEngagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  bestTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  trending: boolean;
}

interface ContentSuggestionsProps {
  suggestions?: ContentSuggestion[];
  onRegenerateSuggestions?: () => void;
  onUseSuggestion?: (suggestionId: string) => void;
  loading: boolean;
}

// Sugestões reais serão geradas pela IA
// Lista vazia para remover dados fictícios
const realSuggestions: ContentSuggestion[] = [];

// Dados fictícios removidos - sugestões serão geradas dinamicamente

export function ContentSuggestions({
  suggestions = realSuggestions,
  onRegenerateSuggestions = () => {},
  onUseSuggestion = () => {},
  loading
}: ContentSuggestionsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(suggestions.map(s => s.category)))];
  const platforms = ['all', 'INSTAGRAM', 'FACEBOOK', 'TELEGRAM'];

  const filteredSuggestions = suggestions.filter(suggestion => {
    const categoryMatch = selectedCategory === 'all' || suggestion.category === selectedCategory;
    const platformMatch = selectedPlatform === 'all' || 
                         suggestion.platform === selectedPlatform || 
                         suggestion.platform === 'ALL';
    return categoryMatch && platformMatch;
  });

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'INSTAGRAM':
        return <Instagram size={16} className="text-pink-600" />;
      case 'FACEBOOK':
        return <Facebook size={16} className="text-blue-600" />;
      case 'TELEGRAM':
        return <Send size={16} className="text-blue-500" />;
      case 'ALL':
        return <Share2 size={16} className="text-purple-600" />;
      default:
        return <Share2 size={16} className="text-gray-600" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'story':
        return '📖';
      case 'video':
        return '🎥';
      case 'carousel':
        return '🎠';
      default:
        return '📝';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'Fácil';
      case 'medium':
        return 'Médio';
      case 'hard':
        return 'Difícil';
      default:
        return difficulty;
    }
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Lightbulb size={24} className="text-yellow-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Sugestões de Conteúdo</h2>
            <p className="text-gray-600">Ideias personalizadas para suas redes sociais</p>
          </div>
        </div>
        <button
          onClick={onRegenerateSuggestions}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center space-x-2"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span>Gerar Novas Ideias</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Todas as Categorias' : category}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Plataforma</label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {platforms.map((platform) => (
                <option key={platform} value={platform}>
                  {platform === 'all' ? 'Todas as Plataformas' : platform}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Suggestions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSuggestions.map((suggestion) => (
          <div key={suggestion.id} className="bg-white rounded-xl border border-gray-200 p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getTypeIcon(suggestion.type)}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{suggestion.title}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    {getPlatformIcon(suggestion.platform)}
                    <span className="text-sm text-gray-600">{suggestion.platform}</span>
                    {suggestion.trending && (
                      <div className="flex items-center space-x-1">
                        <Sparkles size={12} className="text-yellow-500" />
                        <span className="text-xs text-yellow-600 font-medium">Trending</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(suggestion.difficulty)}`}>
                {getDifficultyLabel(suggestion.difficulty)}
              </span>
            </div>

            {/* Content Preview */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-800 whitespace-pre-line line-clamp-4">
                {suggestion.content}
              </p>
            </div>

            {/* Hashtags */}
            <div className="flex flex-wrap gap-1 mb-4">
              {suggestion.hashtags.slice(0, 4).map((hashtag) => (
                <span
                  key={hashtag}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md"
                >
                  {hashtag}
                </span>
              ))}
              {suggestion.hashtags.length > 4 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                  +{suggestion.hashtags.length - 4}
                </span>
              )}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Heart size={14} className="text-red-500" />
                  <span className="text-sm font-medium text-gray-900">
                    {suggestion.estimatedEngagement.likes}
                  </span>
                </div>
                <span className="text-xs text-gray-600">Curtidas</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <MessageSquare size={14} className="text-blue-500" />
                  <span className="text-sm font-medium text-gray-900">
                    {suggestion.estimatedEngagement.comments}
                  </span>
                </div>
                <span className="text-xs text-gray-600">Comentários</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Share2 size={14} className="text-green-500" />
                  <span className="text-sm font-medium text-gray-900">
                    {suggestion.estimatedEngagement.shares}
                  </span>
                </div>
                <span className="text-xs text-gray-600">Compartilhamentos</span>
              </div>
            </div>

            {/* Best Time */}
            <div className="flex items-center justify-center space-x-2 mb-4 p-2 bg-blue-50 rounded-lg">
              <Clock size={14} className="text-blue-600" />
              <span className="text-sm text-blue-700">
                Melhor horário: {suggestion.bestTime}
              </span>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => onUseSuggestion(suggestion.id)}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center justify-center space-x-2"
              >
                <Target size={16} />
                <span>Usar Sugestão</span>
              </button>
              <button
                onClick={() => copyToClipboard(suggestion.content)}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                title="Copiar conteúdo"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredSuggestions.length === 0 && (
        <div className="text-center py-12">
          <Lightbulb size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma sugestão encontrada
          </h3>
          <p className="text-gray-600 mb-4">
            Tente ajustar os filtros ou gerar novas ideias
          </p>
          <button
            onClick={onRegenerateSuggestions}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Gerar Sugestões
          </button>
        </div>
      )}

      {/* Tips */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
        <h3 className="text-lg font-semibold text-yellow-900 mb-3">💡 Dicas para Criar Conteúdo</h3>
        <ul className="text-sm text-yellow-800 space-y-2">
          <li className="flex items-start space-x-2">
            <span className="text-yellow-600">•</span>
            <span>Use hashtags relevantes para aumentar o alcance</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-yellow-600">•</span>
            <span>Poste nos horários de maior atividade da sua audiência</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-yellow-600">•</span>
            <span>Varie o tipo de conteúdo para manter o engajamento</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-yellow-600">•</span>
            <span>Sempre inclua call-to-action para incentivar interação</span>
          </li>
        </ul>
      </div>
    </div>
  );
}