'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ContentForm } from '@/components/content/ContentForm';
import { PlatformSelector } from '@/components/content/PlatformSelector';
import { AIAssistant } from '@/components/content/AIAssistant';
import { ContentPreview } from '@/components/content/ContentPreview';
import { Content, Platform } from '@/types';

export default function CreateContentPage() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [content, setContent] = useState<Partial<Content>>({
    title: '',
    body: '',
    type: 'POST',
    category: 'EDUCATIONAL',
    status: 'DRAFT',
    platforms: [],
    hashtags: [],
  });
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]); // Adicionado estado para arquivos carregados
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleContentChange = (updates: Partial<Content>) => {
    setContent(prev => ({ ...prev, ...updates }));
  };

  const handlePlatformToggle = (platform: Platform) => {
    const newPlatforms = selectedPlatforms.includes(platform)
      ? selectedPlatforms.filter(p => p !== platform)
      : [...selectedPlatforms, platform];
    
    setSelectedPlatforms(newPlatforms);
    handleContentChange({ platforms: newPlatforms });
  };

  // Funções para gerenciar arquivos carregados
  const handleFileUploaded = (file: any) => {
    setUploadedFiles(prev => [...prev, file]);
  };

  const handleFileRemoved = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleAIGenerate = async (prompt: string) => {
    setIsGenerating(true);
    try {
      // Aqui integrará com a API de IA
      // Por enquanto, simulamos a geração
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const generatedContent = `Análise técnica sobre opções binárias baseada em: ${prompt}
      
O mercado de opções binárias apresenta oportunidades interessantes para traders que dominam análise técnica. É fundamental entender os padrões de candlestick e indicadores como RSI e MACD.

📊 Pontos importantes:
• Gestão de risco é essencial
• Diversificação do portfólio
• Análise de tendências

#opcoesbinarias #trading #analisetecnica #investimentos #mercadofinanceiro`;

      handleContentChange({ 
        body: generatedContent,
        hashtags: ['opcoesbinarias', 'trading', 'analisetecnica', 'investimentos', 'mercadofinanceiro']
      });
    } catch (error) {
      console.error('Erro ao gerar conteúdo:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Criar conteúdo com arquivos de mídia para o preview
  const contentWithMedia = {
    ...content,
    mediaFiles: uploadedFiles
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Criar Conteúdo</h1>
          <p className="mt-2 text-gray-600">
            Crie conteúdo otimizado para suas campanhas de marketing em opções binárias
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Seletor de plataformas */}
            <PlatformSelector
              selectedPlatforms={selectedPlatforms}
              onPlatformToggle={handlePlatformToggle}
            />

            {/* Formulário de conteúdo */}
            <ContentForm
              content={content}
              onChange={handleContentChange}
              onAIAssist={() => setShowAIAssistant(true)}
              isGenerating={isGenerating}
              onFileUploaded={handleFileUploaded}
              onFileRemoved={handleFileRemoved}
              uploadedFiles={uploadedFiles}
            />
          </div>

          {/* Sidebar com preview e IA */}
          <div className="space-y-6">
            {/* Preview */}
            <ContentPreview
              content={contentWithMedia}
              platforms={selectedPlatforms}
            />

            {/* Assistente de IA */}
            <AIAssistant
              isOpen={showAIAssistant}
              onClose={() => setShowAIAssistant(false)}
              onGenerate={handleAIGenerate}
              isGenerating={isGenerating}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}