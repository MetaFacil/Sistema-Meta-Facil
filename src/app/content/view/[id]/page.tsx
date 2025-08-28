'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  ArrowLeft, 
  Calendar, 
  Hash, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share, 
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { Content } from '@/types';
import { formatRelativeTime, formatNumber } from '@/utils';
import { TelegramHistoryChart } from '@/components/analytics/TelegramHistoryChart';
import { TelegramAlerts } from '@/components/analytics/TelegramAlerts';

interface ContentDetailsProps {
  content: Content;
}

function ContentDetails({ content }: ContentDetailsProps) {
  const router = useRouter();
  const [isCollecting, setIsCollecting] = useState(false);

  const handleBack = () => {
    router.push('/content/library');
  };

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
      
      // Recarregar a página para mostrar as novas métricas
      window.location.reload();
    } catch (error) {
      console.error('Error collecting analytics:', error);
      alert('Erro ao coletar métricas');
    } finally {
      setIsCollecting(false);
    }
  };

  // Converter strings em arrays se necessário
  const platforms = typeof content.platforms === 'string' 
    ? content.platforms.split(',').filter(p => p.trim() !== '')
    : content.platforms || [];
    
  const hashtags = typeof content.hashtags === 'string'
    ? content.hashtags.split(',').filter(h => h.trim() !== '')
    : content.hashtags || [];

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Visualizar Conteúdo</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            {content.status === 'PUBLISHED' && platforms.includes('telegram') && (
              <button
                onClick={handleCollectAnalytics}
                disabled={isCollecting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isCollecting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Coletando...
                  </>
                ) : (
                  <>
                    <BarChart3 size={16} className="mr-2" />
                    Coletar Métricas
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card do Conteúdo */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{content.title}</h2>
                
                <div className="prose max-w-none mb-6">
                  <p className="text-gray-700 whitespace-pre-wrap">{content.body}</p>
                </div>
                
                {/* Hashtags */}
                {hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {hashtags.map((hashtag, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                        <Hash size={14} className="mr-1" />
                        {hashtag}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Informações do Conteúdo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={16} className="mr-2" />
                    <span>
                      Criado em {new Date(content.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  {content.publishedAt && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={16} className="mr-2" />
                      <span>
                        Publicado em {new Date(content.publishedAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                      {content.category.toLowerCase().replace('_', ' ')}
                    </span>
                    <span className="mx-2">•</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                      {content.status.toLowerCase().replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {platforms.map((platform) => (
                      <span key={platform} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {platform.toLowerCase().replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Métricas do Telegram */}
            {content.status === 'PUBLISHED' && platforms.includes('telegram') && content.analytics && content.analytics.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas do Telegram</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Eye size={20} className="text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatNumber(content.analytics[0].impressions)}
                    </div>
                    <div className="text-sm text-gray-600">Impressões</div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <TrendingUp size={20} className="text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatNumber(content.analytics[0].reach)}
                    </div>
                    <div className="text-sm text-gray-600">Alcance</div>
                  </div>
                  
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Heart size={20} className="text-red-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatNumber(content.analytics[0].likes)}
                    </div>
                    <div className="text-sm text-gray-600">Curtidas</div>
                  </div>
                  
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <MessageCircle size={20} className="text-yellow-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatNumber(content.analytics[0].comments)}
                    </div>
                    <div className="text-sm text-gray-600">Comentários</div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Taxa de Engajamento</span>
                    <span className="font-semibold text-gray-900">
                      {content.analytics[0].engagement.toFixed(2)}%
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                      style={{ width: `${Math.min(content.analytics[0].engagement, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar com Informações Adicionais */}
          <div className="space-y-6">
            {/* Arquivos de Mídia */}
            {content.mediaFiles && content.mediaFiles.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Mídia</h3>
                
                <div className="space-y-3">
                  {content.mediaFiles.map((file) => (
                    <div key={file.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      {file.type === 'IMAGE' ? (
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                          <div className="bg-gray-300 border-2 border-dashed rounded-xl w-8 h-8" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <div className="text-blue-600 font-bold text-xs">
                            {file.type.substring(0, 3)}
                          </div>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.filename}
                        </p>
                        <p className="text-xs text-gray-500">
                          {file.mimeType} • {(file.size / 1024).toFixed(1)}KB
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Informações do Conteúdo */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">ID</div>
                  <div className="text-sm text-gray-900 font-mono break-all">
                    {content.id}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Tipo</div>
                  <div className="text-sm text-gray-900 capitalize">
                    {content.type.toLowerCase().replace('_', ' ')}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Status</div>
                  <div className="text-sm text-gray-900 capitalize">
                    {content.status.toLowerCase().replace('_', ' ')}
                  </div>
                </div>
                
                {content.scheduledFor && (
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Agendado para</div>
                    <div className="text-sm text-gray-900">
                      {new Date(content.scheduledFor).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Alertas de Métricas */}
            {content.status === 'PUBLISHED' && platforms.includes('telegram') && (
              <TelegramAlerts contentId={content.id} />
            )}
          </div>
        </div>
        
        {/* Histórico de Métricas do Telegram */}
        {content.status === 'PUBLISHED' && platforms.includes('telegram') && (
          <div className="mt-6">
            <TelegramHistoryChart contentId={content.id} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function ContentViewPage({ params }: { params: { id: string } }) {
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`/api/content/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch content');
        }
        
        const data = await response.json();
        
        // Converter strings em arrays para platforms e hashtags
        const processedContent = {
          ...data.content,
          platforms: typeof data.content.platforms === 'string' 
            ? data.content.platforms.split(',').filter((p: string) => p.trim() !== '')
            : data.content.platforms || [],
          hashtags: typeof data.content.hashtags === 'string'
            ? data.content.hashtags.split(',').filter((h: string) => h.trim() !== '')
            : data.content.hashtags || []
        };
        
        setContent(processedContent);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        console.error('Error fetching content:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchContent();
    }
  }, [params.id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-16 bg-gray-200 rounded"></div>
                    <div className="h-16 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="text-red-800">
              <h3 className="text-lg font-medium mb-2">Erro ao carregar conteúdo</h3>
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!content) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="text-yellow-800">
              <h3 className="text-lg font-medium mb-2">Conteúdo não encontrado</h3>
              <p>O conteúdo solicitado não foi encontrado.</p>
              <button
                onClick={() => window.location.assign('/content/library')}
                className="mt-4 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
              >
                Voltar para biblioteca
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return <ContentDetails content={content} />;
}