'use client';

import { useState } from 'react';
import { 
  MoreHorizontal, 
  Edit, 
  Copy, 
  Trash2, 
  Calendar, 
  Eye, 
  Instagram, 
  Facebook, 
  Send,
  Clock,
  TrendingUp,
  Heart,
  MessageCircle,
  Share,
  Edit3,
  BarChart3
} from 'lucide-react';
import { Content, Platform } from '@/types';
import { CONTENT_CATEGORIES, CONTENT_STATUS } from '@/lib/constants';
import { formatRelativeTime, formatNumber } from '@/utils';
import { useRouter } from 'next/navigation';

interface ContentGridProps {
  contents: Content[];
  loading: boolean;
  onDelete: (contentId: string) => void;
  onDuplicate: (contentId: string) => void;
}

interface ContentCardProps {
  content: Content;
  onDelete: (contentId: string) => void;
  onDuplicate: (contentId: string) => void;
}

// Componentes auxiliares
const CategoryBadge = ({ category }: { category: string }) => {
  // Convertendo o objeto CONTENT_CATEGORIES em array para usar o método find
  const categoriesArray = Object.entries(CONTENT_CATEGORIES).map(([key, value]) => ({
    value: key,
    ...value
  }));
  
  const categoryConfig = categoriesArray.find((cat: any) => cat.value === category);
  if (!categoryConfig) return null;
  
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${categoryConfig.color}-100 text-${categoryConfig.color}-800`}>
      {categoryConfig.name}
    </span>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  // Convertendo o objeto CONTENT_STATUS em array para usar o método find
  const statusesArray = Object.entries(CONTENT_STATUS).map(([key, value]) => ({
    value: key,
    ...value
  }));
  
  const statusConfig = statusesArray.find((s: any) => s.value === status);
  if (!statusConfig) return null;
  
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${statusConfig.color}-100 text-${statusConfig.color}-800`}>
      {statusConfig.name}
    </span>
  );
};

const platformIcons = {
  INSTAGRAM: Instagram,
  FACEBOOK: Facebook,
  TELEGRAM: Send
};

const ContentCard = ({ content, onDelete, onDuplicate }: ContentCardProps) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleEdit = () => {
    router.push(`/content/edit/${content.id}`);
  };

  const handleView = () => {
    router.push(`/content/view/${content.id}`);
  };

  const handleSchedule = () => {
    router.push(`/content/schedule/${content.id}`);
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este conteúdo?')) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/content/${content.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete content');
      }

      // Reload the page to show updated content list
      window.location.reload();
    } catch (error) {
      console.error('Error deleting content:', error);
      alert('Erro ao excluir conteúdo');
    } finally {
      setIsDeleting(false);
    }
  };

  // Nova função para coletar métricas do Telegram
  const handleCollectAnalytics = async () => {
    setIsCollecting(true);
    try {
      const response = await fetch('/api/analytics/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contentId: content.id })
      });

      if (!response.ok) {
        throw new Error('Failed to collect analytics');
      }

      const data = await response.json();
      alert('Métricas coletadas com sucesso!');
      
      // Recarregar os dados para mostrar as novas métricas
      window.location.reload();
    } catch (error) {
      console.error('Error collecting analytics:', error);
      alert('Erro ao coletar métricas: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    } finally {
      setIsCollecting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
              {content.title}
            </h3>

            <div className="flex items-center justify-between mb-3">
              <CategoryBadge category={content.category} />
              <StatusBadge status={content.status} />
            </div>

            {content.scheduledFor && (
              <div className="flex items-center text-sm text-gray-600 mb-3">
                <Clock size={14} className="mr-1" />
                <span>
                  {new Date(content.scheduledFor).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            )}

            <div className="flex items-center space-x-1 mb-3">
              {(Array.isArray(content.platforms) ? content.platforms : (content.platforms || '').split(','))
                .filter(platform => platform.trim() !== '')
                .map((platform: string, index: number) => {
                  const typedPlatform = platform.toUpperCase() as keyof typeof platformIcons;
                  const Icon = platformIcons[typedPlatform];
                  if (!Icon) return null;
                  return (
                    <div key={index} className="p-1">
                      <Icon size={14} className={
                        typedPlatform === 'INSTAGRAM' ? 'text-pink-600' :
                        typedPlatform === 'FACEBOOK' ? 'text-blue-600' :
                        'text-blue-500'
                      } />
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <MoreHorizontal size={16} />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="py-2">
                  <button
                    onClick={() => { handleView(); setShowDropdown(false); }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Eye size={14} className="mr-3" />
                    Visualizar
                  </button>
                  <button
                    onClick={() => { handleEdit(); setShowDropdown(false); }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Edit size={14} className="mr-3" />
                    Editar
                  </button>
                  <button
                    onClick={() => { onDuplicate(content.id); setShowDropdown(false); }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Copy size={14} className="mr-3" />
                    Duplicar
                  </button>
                  {content.status === 'DRAFT' && (
                    <button
                      onClick={() => { handleSchedule(); setShowDropdown(false); }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Calendar size={14} className="mr-3" />
                      Agendar
                    </button>
                  )}
                  <hr className="my-2" />
                  <button
                    onClick={() => { onDelete(content.id); setShowDropdown(false); }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={14} className="mr-3" />
                    Excluir
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Preview */}
      <div className="p-4">
        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
          {content.body}
        </p>

        {/* Hashtags */}
        {content.hashtags && (Array.isArray(content.hashtags) ? content.hashtags : content.hashtags.split(',')).filter(tag => tag.trim() !== '').length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {(Array.isArray(content.hashtags) ? content.hashtags : content.hashtags.split(','))
              .filter(tag => tag.trim() !== '')
              .slice(0, 3)
              .map((hashtag: string, index: number) => (
                <span key={index} className="text-xs text-primary-600">
                  #{hashtag.trim()}
                </span>
              ))}
            {(Array.isArray(content.hashtags) ? content.hashtags : content.hashtags.split(',')).filter(tag => tag.trim() !== '').length > 3 && (
              <span className="text-xs text-gray-500">
                +{(Array.isArray(content.hashtags) ? content.hashtags : content.hashtags.split(',')).filter(tag => tag.trim() !== '').length - 3} mais
              </span>
            )}
          </div>
        )}

        {/* Analytics (if published) */}
        {content.status === 'PUBLISHED' && content.analytics && content.analytics.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Eye size={12} className="text-gray-500 mr-1" />
                <span className="text-xs font-medium text-gray-900">
                  {formatNumber(content.analytics[0]?.reach || 0)}
                </span>
              </div>
              <span className="text-xs text-gray-500">Alcance</span>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Heart size={12} className="text-gray-500 mr-1" />
                <span className="text-xs font-medium text-gray-900">
                  {formatNumber(content.analytics[0]?.likes || 0)}
                </span>
              </div>
              <span className="text-xs text-gray-500">Curtidas</span>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <TrendingUp size={12} className="text-gray-500 mr-1" />
                <span className="text-xs font-medium text-gray-900">
                  {formatNumber(content.analytics[0]?.comments || 0)}
                </span>
              </div>
              <span className="text-xs text-gray-500">Comentários</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleView}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="Visualizar"
            >
              <Eye size={16} />
            </button>
            
            <button
              onClick={handleEdit}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="Editar"
            >
              <Edit3 size={16} />
            </button>
            
            <button
              onClick={handleSchedule}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="Agendar"
            >
              <Calendar size={16} />
            </button>
          </div>

          <div className="flex items-center space-x-1">
            {/* Botão para coletar métricas do Telegram - apenas para conteúdos publicados no Telegram */}
            {content.status === 'PUBLISHED' && 
             (Array.isArray(content.platforms) 
               ? content.platforms.includes('TELEGRAM' as Platform) 
               : (content.platforms || '').split(',').includes('telegram')) && (
              <button
                onClick={handleCollectAnalytics}
                disabled={isCollecting}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Coletar métricas do Telegram"
              >
                {isCollecting ? (
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <BarChart3 size={16} />
                )}
              </button>
            )}
            
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Excluir"
            >
              {isDeleting ? (
                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Trash2 size={16} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function LoadingSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="flex space-x-2 mb-3">
          <div className="h-5 bg-gray-200 rounded-full w-16"></div>
          <div className="h-5 bg-gray-200 rounded-full w-20"></div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          <div className="h-3 bg-gray-200 rounded w-4/6"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  );
}

export function ContentGrid({ contents, loading, onDelete, onDuplicate }: ContentGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <LoadingSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (contents.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Calendar size={48} className="mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhum conteúdo encontrado
        </h3>
        <p className="text-gray-600 mb-6">
          Ajuste os filtros ou crie seu primeiro conteúdo
        </p>
        <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          Criar Primeiro Conteúdo
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contents.map((content) => (
        <ContentCard
          key={content.id}
          content={content}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
        />
      ))}
    </div>
  );
}