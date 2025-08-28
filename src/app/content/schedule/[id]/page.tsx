'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Content, Platform } from '@/types';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Eye, Send } from 'lucide-react';
import { ContentPreview } from '@/components/content/ContentPreview';

export default function ScheduleContentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const contentId = params.id;
  const [content, setContent] = useState<Content | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scheduledDateTime, setScheduledDateTime] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/content/${contentId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erro ao carregar conteúdo');
        }

        // Converter plataformas e hashtags de string para array se necessário
        const contentData = {
          ...data.content,
          platforms: typeof data.content.platforms === 'string' 
            ? data.content.platforms.split(',').filter((p: string) => p.trim() !== '')
            : data.content.platforms || [],
          hashtags: typeof data.content.hashtags === 'string'
            ? data.content.hashtags.split(',').filter((h: string) => h.trim() !== '')
            : data.content.hashtags || []
        };

        setContent(contentData);

        // Configurar data/hora padrão para agendamento (próxima hora)
        const now = new Date();
        now.setHours(now.getHours() + 1);
        now.setMinutes(0);
        
        // Formato YYYY-MM-DDTHH:MM
        const defaultScheduleTime = now.toISOString().slice(0, 16);
        setScheduledDateTime(defaultScheduleTime);
      } catch (error) {
        console.error('Erro ao buscar conteúdo:', error);
        setError(error instanceof Error ? error.message : 'Erro desconhecido');
      } finally {
        setIsLoading(false);
      }
    };

    if (contentId) {
      fetchContent();
    }
  }, [contentId]);

  const handleSchedule = async () => {
    if (!content || !scheduledDateTime) {
      alert('Selecione uma data e hora para agendamento');
      return;
    }

    setIsScheduling(true);
    try {
      // Preparar dados para agendamento
      const contentData: any = {
        id: content.id,
        title: content.title,
        body: content.body,
        type: content.type,
        category: content.category,
        status: 'SCHEDULED',
        scheduledFor: scheduledDateTime,
        platforms: typeof content.platforms === 'string' 
          ? content.platforms 
          : content.platforms.join(','),
        hashtags: typeof content.hashtags === 'string'
          ? content.hashtags
          : content.hashtags?.join(','),
        mediaFileIds: content.mediaFiles?.map(f => f.id) || []
      };

      const response = await fetch(`/api/content/${contentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contentData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao agendar conteúdo');
      }

      alert('Conteúdo agendado com sucesso!');
      
      // Redirecionar para a biblioteca
      router.push('/content/library');
    } catch (error) {
      console.error('Erro ao agendar conteúdo:', error);
      alert('Erro ao agendar conteúdo: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    } finally {
      setIsScheduling(false);
    }
  };

  const handlePublishNow = async () => {
    if (!content) return;
    
    if (!confirm('Tem certeza que deseja publicar este conteúdo agora?')) {
      return;
    }

    setIsScheduling(true);
    try {
      const response = await fetch('/api/content/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentId: content.id,
          platforms: Array.isArray(content.platforms) ? content.platforms : content.platforms.split(','),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao publicar conteúdo');
      }

      if (result.errors && result.errors.length > 0) {
        const errorMessages = result.errors.map((e: {platform: string, error: string}) => `${e.platform}: ${e.error}`).join('\n');
        alert(`Publicado parcialmente com erros:\n${errorMessages}`);
      } else {
        alert('Conteúdo publicado com sucesso!');
      }
      
      // Redirecionar para a biblioteca
      router.push('/content/library');
    } catch (error) {
      console.error('Erro ao publicar conteúdo:', error);
      alert('Erro ao publicar conteúdo: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    } finally {
      setIsScheduling(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
              <div className="h-64 bg-gray-200 rounded mb-6"></div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !content) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Erro ao carregar conteúdo</h2>
            <p className="text-red-600">{error || 'Conteúdo não encontrado'}</p>
            <button 
              onClick={() => router.push('/content/library')}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Voltar para Biblioteca
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header com título */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/content/library')}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2"
          >
            <ArrowLeft size={16} className="mr-1" />
            Voltar para Biblioteca
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Agendar Publicação</h1>
          <p className="mt-2 text-gray-600">
            Agende o conteúdo para ser publicado automaticamente
          </p>
        </div>

        {/* Conteúdo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coluna esquerda - Formulário de agendamento */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Definir Data e Hora</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar size={16} className="inline mr-2" />
                    Data e Hora de Publicação
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledDateTime}
                    onChange={(e) => setScheduledDateTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Selecione a data e hora em que o conteúdo será publicado automaticamente.
                  </p>
                </div>
                
                <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700">Plataformas Selecionadas</p>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(content.platforms) && content.platforms.map((platform) => (
                      <span 
                        key={platform}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                      >
                        {platform}
                      </span>
                    ))}
                    {(!Array.isArray(content.platforms) || content.platforms.length === 0) && (
                      <p className="text-sm text-red-600">
                        Nenhuma plataforma selecionada. Volte e edite o conteúdo para selecionar plataformas.
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSchedule}
                    disabled={isScheduling || !scheduledDateTime}
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Calendar size={16} />
                    <span>{isScheduling ? 'Agendando...' : 'Agendar Publicação'}</span>
                  </button>

                  <button
                    onClick={handlePublishNow}
                    disabled={isScheduling}
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={16} />
                    <span>{isScheduling ? 'Publicando...' : 'Publicar Agora'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalhes do Conteúdo</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Título</h3>
                  <p className="mt-1 text-sm text-gray-900">{content.title}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Categoria</h3>
                  <p className="mt-1 text-sm text-gray-900">{content.category}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Tipo</h3>
                  <p className="mt-1 text-sm text-gray-900">{content.type}</p>
                </div>
                
                {content.hashtags && Array.isArray(content.hashtags) && content.hashtags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Hashtags</h3>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {content.hashtags.map((tag, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Coluna direita - Preview */}
          <div>
            <ContentPreview 
              content={content} 
              platforms={Array.isArray(content.platforms) ? content.platforms : []}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}