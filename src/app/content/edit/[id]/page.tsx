'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ContentForm } from '@/components/content/ContentForm';
import { PlatformSelector } from '@/components/content/PlatformSelector';
import { Content, Platform } from '@/types';
import { useRouter } from 'next/navigation';

interface UploadedFile {
  id: string;
  url: string;
  filename: string;
  size: number;
  type: string;
  mimeType: string;
}

export default function EditContentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const contentId = params.id;
  const [content, setContent] = useState<Partial<Content>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

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
        
        // Configurar arquivos de mídia
        if (data.content.mediaFiles && data.content.mediaFiles.length > 0) {
          setUploadedFiles(data.content.mediaFiles);
        }
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

  const handleContentChange = (updates: Partial<Content>) => {
    setContent(prev => ({ ...prev, ...updates }));
  };

  const handlePlatformToggle = (platform: Platform) => {
    setContent(prev => {
      // Converter para array se for string
      const platforms = Array.isArray(prev.platforms) ? [...prev.platforms] : 
                      (typeof prev.platforms === 'string' ? prev.platforms.split(',').filter(p => p.trim() !== '') : []);
      
      const platformIndex = platforms.indexOf(platform as Platform);
      
      if (platformIndex >= 0) {
        platforms.splice(platformIndex, 1);
      } else {
        platforms.push(platform as Platform);
      }
      
      return { ...prev, platforms: platforms as Platform[] };
    });
  };

  const handleAIAssist = () => {
    setIsGenerating(true);
    // Implementar integração com IA aqui
    setTimeout(() => {
      setIsGenerating(false);
      alert('Funcionalidade de IA não implementada nesta versão');
    }, 1000);
  };

  const handleFileUploaded = (file: UploadedFile) => {
    setUploadedFiles(prev => [...prev, file]);
  };

  const handleFileRemoved = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
              <div className="h-24 bg-gray-200 rounded mb-6"></div>
              <div className="h-12 bg-gray-200 rounded mb-4"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Erro ao carregar conteúdo</h2>
            <p className="text-red-600">{error}</p>
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
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Editar Conteúdo</h1>
          <p className="mt-2 text-gray-600">
            Atualize seu conteúdo para publicação
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ContentForm
              content={content}
              onChange={handleContentChange}
              onAIAssist={handleAIAssist}
              isGenerating={isGenerating}
              onFileUploaded={handleFileUploaded}
              onFileRemoved={handleFileRemoved}
              uploadedFiles={uploadedFiles}
            />
          </div>

          <div className="space-y-6">
            <PlatformSelector
              selectedPlatforms={content.platforms || []}
              onPlatformToggle={handlePlatformToggle}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}