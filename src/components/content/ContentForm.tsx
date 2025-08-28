'use client';

import { useState } from 'react';
import { 
  Save, 
  Calendar, 
  Image, 
  Bot, 
  Hash, 
  Type,
  FileText,
  Clock,
  Eye
} from 'lucide-react';
import { Content, ContentCategory, ContentType, Platform } from '@/types';
import { CONTENT_CATEGORIES } from '@/lib/constants';
import { FileUpload } from './FileUpload';

interface UploadedFile {
  id: string;
  url: string;
  filename: string;
  size: number;
  type: string;
  mimeType: string;
}

interface ContentFormProps {
  content: Partial<Content>;
  onChange: (updates: Partial<Content>) => void;
  onAIAssist: () => void;
  isGenerating: boolean;
  onFileUploaded?: (file: UploadedFile) => void;
  onFileRemoved?: (fileId: string) => void;
  uploadedFiles?: UploadedFile[];
}

export function ContentForm({ 
  content, 
  onChange, 
  onAIAssist, 
  isGenerating,
  onFileUploaded,    
  onFileRemoved,     
  uploadedFiles = [] 
}: ContentFormProps) {
  const [charCount, setCharCount] = useState(0);
  const [hashtagCount, setHashtagCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileUploaded = (file: UploadedFile) => {
    if (onFileUploaded) {
      onFileUploaded(file);
    } else {
      console.log('Arquivo adicionado:', file);
      console.log('Todos os arquivos:', [...uploadedFiles, file]);
    }
  };

  const handleFileRemoved = (fileId: string) => {
    if (onFileRemoved) {
      onFileRemoved(fileId);
    } else {
      console.log('Arquivo removido:', fileId);
      console.log('Arquivos restantes:', uploadedFiles.filter(f => f.id !== fileId));
    }
  };

  const handleBodyChange = (value: string) => {
    setCharCount(value.length);
    const hashtags = value.match(/#\w+/g) || [];
    setHashtagCount(hashtags.length);
    onChange({ body: value });
  };

  const handleSave = async () => {
    if (!content.title || !content.body) {
      alert('Título e conteúdo são obrigatórios');
      return;
    }

    setIsSaving(true);
    try {
      // Preparar dados para envio - serializar arrays para strings
      const contentData = {
        ...content,
        status: 'DRAFT',
        platforms: Array.isArray(content.platforms) ? content.platforms.join(',') : content.platforms,
        hashtags: Array.isArray(content.hashtags) ? content.hashtags.join(',') : content.hashtags,
        mediaFileIds: uploadedFiles.map(f => f.id),
      };

      console.log('Enviando dados para salvar:', contentData);

      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contentData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao salvar conteúdo');
      }

      alert('Conteúdo salvo com sucesso!');
      console.log('Conteúdo salvo:', result.content);
      
      // Redirecionar para a biblioteca de conteúdo
      window.location.href = '/content/library';
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar conteúdo: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSchedule = async () => {
    if (!content.title || !content.body) {
      alert('Título e conteúdo são obrigatórios');
      return;
    }

    // Criar um input de data e hora no formato ISO
    const now = new Date();
    const localISOString = new Date(now.getTime() - (now.getTimezoneOffset() * 60000))
      .toISOString()
      .slice(0, 16); // Formato YYYY-MM-DDTHH:MM

    const scheduledForInput = document.createElement('input');
    scheduledForInput.type = 'datetime-local';
    scheduledForInput.value = localISOString;
    scheduledForInput.style.padding = '10px';
    scheduledForInput.style.borderRadius = '5px';
    scheduledForInput.style.border = '1px solid #ccc';
    scheduledForInput.style.width = '100%';
    scheduledForInput.style.marginBottom = '15px';

    // Criar um div de modal personalizado
    const modalContainer = document.createElement('div');
    modalContainer.style.position = 'fixed';
    modalContainer.style.top = '0';
    modalContainer.style.left = '0';
    modalContainer.style.width = '100%';
    modalContainer.style.height = '100%';
    modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modalContainer.style.display = 'flex';
    modalContainer.style.alignItems = 'center';
    modalContainer.style.justifyContent = 'center';
    modalContainer.style.zIndex = '1000';

    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = 'white';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '8px';
    modalContent.style.width = '400px';
    modalContent.style.maxWidth = '90%';
    modalContent.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';

    const modalTitle = document.createElement('h3');
    modalTitle.textContent = 'Agendar Publicação';
    modalTitle.style.marginBottom = '15px';
    modalTitle.style.fontSize = '18px';
    modalTitle.style.fontWeight = 'bold';

    const modalText = document.createElement('p');
    modalText.textContent = 'Selecione a data e hora para agendar a publicação:';
    modalText.style.marginBottom = '15px';

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'flex-end';
    buttonContainer.style.gap = '10px';

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancelar';
    cancelButton.style.padding = '8px 16px';
    cancelButton.style.border = '1px solid #ddd';
    cancelButton.style.borderRadius = '4px';
    cancelButton.style.backgroundColor = '#f5f5f5';
    cancelButton.style.cursor = 'pointer';

    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'Agendar';
    confirmButton.style.padding = '8px 16px';
    confirmButton.style.border = '1px solid transparent';
    confirmButton.style.borderRadius = '4px';
    confirmButton.style.backgroundColor = '#2563eb';
    confirmButton.style.color = 'white';
    confirmButton.style.cursor = 'pointer';

    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(confirmButton);

    modalContent.appendChild(modalTitle);
    modalContent.appendChild(modalText);
    modalContent.appendChild(scheduledForInput);
    modalContent.appendChild(buttonContainer);
    modalContainer.appendChild(modalContent);

    document.body.appendChild(modalContainer);

    return new Promise<string | null>((resolve) => {
      // Manipular o cancelamento
      cancelButton.onclick = () => {
        document.body.removeChild(modalContainer);
        resolve(null);
      };

      // Manipular a confirmação
      confirmButton.onclick = () => {
        const selectedDateTime = scheduledForInput.value;
        document.body.removeChild(modalContainer);
        resolve(selectedDateTime);
      };

      // Fechar ao clicar fora
      modalContainer.onclick = (e) => {
        if (e.target === modalContainer) {
          document.body.removeChild(modalContainer);
          resolve(null);
        }
      };
    }).then(async (scheduledFor) => {
      if (!scheduledFor) return; // Usuário cancelou

      setIsScheduling(true);
      try {
        // Preparar dados para envio - serializar arrays para strings
        const contentData = {
          ...content,
          status: 'SCHEDULED',
          scheduledFor,
          platforms: Array.isArray(content.platforms) ? content.platforms.join(',') : content.platforms,
          hashtags: Array.isArray(content.hashtags) ? content.hashtags.join(',') : content.hashtags,
          mediaFileIds: uploadedFiles.map(f => f.id),
        };

        console.log('Enviando dados para agendar:', contentData);

        const response = await fetch('/api/content', {
          method: 'POST',
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
        console.log('Conteúdo agendado:', result.content);
        
        // Redirecionar para a biblioteca de conteúdo
        window.location.href = '/content/library';
      } catch (error) {
        console.error('Erro ao agendar:', error);
        alert('Erro ao agendar conteúdo: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
      } finally {
        setIsScheduling(false);
      }
    });
  };

  const handlePublish = async () => {
    if (!content.title || !content.body) {
      alert('Título e conteúdo são obrigatórios');
      return;
    }

    // Verificar se há plataformas selecionadas
    const platforms = Array.isArray(content.platforms) ? content.platforms : 
                     (content.platforms ? content.platforms.split(',').filter(p => p.trim() !== '') : []);
    
    if (!platforms || platforms.length === 0) {
      alert('Selecione pelo menos uma plataforma para publicar');
      return;
    }

    setIsPublishing(true);
    try {
      // Simplificando o máximo possível:
      // 1. Salvar o conteúdo
      console.log('Arquivos para upload:', uploadedFiles);
      
      // Preparar dados para envio - serializar arrays para strings
      const contentData = {
        title: content.title,
        body: content.body,
        type: content.type || 'POST',
        category: content.category || 'EDUCATIONAL',
        status: 'DRAFT',
        platforms: Array.isArray(content.platforms) ? content.platforms.join(',') : content.platforms,
        hashtags: Array.isArray(content.hashtags) ? content.hashtags.join(',') : content.hashtags,
        mediaFileIds: uploadedFiles.map(f => f.id),
      };

      console.log('Enviando dados para publicar:', contentData);
      
      const saveResponse = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contentData),
      });

      const saveResult = await saveResponse.json();

      if (!saveResponse.ok) {
        throw new Error(saveResult.error || 'Erro ao salvar conteúdo');
      }

      const contentId = saveResult.content.id;
      
      // 2. Publicar no Telegram apenas
      console.log('Publicando APENAS no Telegram');
      const publishResponse = await fetch('/api/content/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentId,
          platforms: ['TELEGRAM'], // Esse array é correto aqui, a rota de publicar espera um array
        }),
      });

      const publishResult = await publishResponse.json();

      if (!publishResponse.ok) {
        throw new Error(publishResult.error || 'Erro ao publicar conteúdo');
      }

      if (publishResult.errors && publishResult.errors.length > 0) {
        const errorMessages = publishResult.errors.map((e: {platform: string, error: string}) => `${e.platform}: ${e.error}`).join('\n');
        alert(`Publicado parcialmente com erros:\n${errorMessages}`);
      } else {
        alert('Conteúdo publicado com sucesso!');
      }
      
      console.log('Conteúdo publicado:', publishResult);
    } catch (error) {
      console.error('Erro ao publicar:', error);
      alert(`Erro ao publicar conteúdo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsPublishing(false);
    }
  };

  const handlePreview = () => {
    if (!content.title && !content.body && uploadedFiles.length === 0) {
      alert('Adicione conteúdo para visualizar');
      return;
    }

    // Criar um modal para mostrar o preview
    const modalContainer = document.createElement('div');
    modalContainer.style.position = 'fixed';
    modalContainer.style.top = '0';
    modalContainer.style.left = '0';
    modalContainer.style.width = '100%';
    modalContainer.style.height = '100%';
    modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modalContainer.style.display = 'flex';
    modalContainer.style.alignItems = 'center';
    modalContainer.style.justifyContent = 'center';
    modalContainer.style.zIndex = '1000';

    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = 'white';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '8px';
    modalContent.style.width = '90%';
    modalContent.style.maxWidth = '700px';
    modalContent.style.maxHeight = '90vh';
    modalContent.style.overflowY = 'auto';
    modalContent.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';

    const modalHeader = document.createElement('div');
    modalHeader.style.display = 'flex';
    modalHeader.style.justifyContent = 'space-between';
    modalHeader.style.alignItems = 'center';
    modalHeader.style.marginBottom = '20px';

    const modalTitle = document.createElement('h3');
    modalTitle.textContent = 'Prévia do Conteúdo';
    modalTitle.style.fontSize = '18px';
    modalTitle.style.fontWeight = 'bold';

    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.style.backgroundColor = 'transparent';
    closeButton.style.border = 'none';
    closeButton.style.fontSize = '20px';
    closeButton.style.cursor = 'pointer';

    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);

    // Criar a div para o preview (simulando ContentPreview)
    const previewContainer = document.createElement('div');
    previewContainer.style.padding = '15px';
    previewContainer.style.border = '1px solid #e5e7eb';
    previewContainer.style.borderRadius = '8px';
    previewContainer.style.backgroundColor = '#f9fafb';

    // Plataforma (Telegram)
    const platformHeader = document.createElement('div');
    platformHeader.style.padding = '10px';
    platformHeader.style.backgroundColor = '#0088cc';
    platformHeader.style.color = 'white';
    platformHeader.style.borderTopLeftRadius = '8px';
    platformHeader.style.borderTopRightRadius = '8px';
    platformHeader.style.marginBottom = '10px';
    platformHeader.style.display = 'flex';
    platformHeader.style.alignItems = 'center';
    platformHeader.style.gap = '10px';
    platformHeader.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
      </svg>
      <span>Telegram Preview</span>
    `;

    // Cabeçalho da mensagem
    const messageHeader = document.createElement('div');
    messageHeader.style.display = 'flex';
    messageHeader.style.alignItems = 'center';
    messageHeader.style.gap = '10px';
    messageHeader.style.marginBottom = '15px';
    messageHeader.innerHTML = `
      <div style="width: 40px; height: 40px; border-radius: 50%; background-color: #0088cc; display: flex; align-items: center; justify-content: center;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </div>
      <div>
        <div style="font-weight: 600;">Canal Meta Fácil</div>
        <div style="font-size: 12px; color: #6b7280;">há 2 min</div>
      </div>
    `;

    // Conteúdo da mensagem
    const messageContent = document.createElement('div');
    
    // Título
    if (content.title) {
      const titleElement = document.createElement('h4');
      titleElement.style.fontWeight = 'bold';
      titleElement.style.marginBottom = '10px';
      titleElement.textContent = content.title;
      messageContent.appendChild(titleElement);
    }
    
    // Corpo
    if (content.body) {
      const bodyElement = document.createElement('p');
      bodyElement.style.whiteSpace = 'pre-wrap';
      bodyElement.style.marginBottom = '15px';
      bodyElement.textContent = content.body;
      messageContent.appendChild(bodyElement);
    }
    
    // Imagem (se houver)
    if (uploadedFiles.length > 0) {
      const imageContainer = document.createElement('div');
      imageContainer.style.marginBottom = '15px';
      imageContainer.style.borderRadius = '8px';
      imageContainer.style.overflow = 'hidden';
      
      const image = document.createElement('img');
      const imageUrl = uploadedFiles[0].url;
      image.src = imageUrl.startsWith('http') ? imageUrl : `${window.location.origin}${imageUrl}`;
      image.style.width = '100%';
      image.style.maxHeight = '300px';
      image.style.objectFit = 'contain';
      
      imageContainer.appendChild(image);
      messageContent.appendChild(imageContainer);
    }
    
    // Estatísticas da mensagem
    const messageStats = document.createElement('div');
    messageStats.style.display = 'flex';
    messageStats.style.alignItems = 'center';
    messageStats.style.justifyContent = 'space-between';
    messageStats.style.fontSize = '12px';
    messageStats.style.color = '#6b7280';
    messageStats.innerHTML = `
      <div style="display: flex; align-items: center; gap: 5px;">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
        <span>128 visualizações</span>
      </div>
      <div>
        <span>${content.body ? content.body.length : 0}/4096</span>
      </div>
    `;
    
    // Montar a mensagem completa
    previewContainer.appendChild(platformHeader);
    previewContainer.appendChild(messageHeader);
    previewContainer.appendChild(messageContent);
    previewContainer.appendChild(messageStats);
    
    // Botão de fechar
    const closeButtonContainer = document.createElement('div');
    closeButtonContainer.style.marginTop = '20px';
    closeButtonContainer.style.display = 'flex';
    closeButtonContainer.style.justifyContent = 'center';
    
    const closeModalButton = document.createElement('button');
    closeModalButton.textContent = 'Fechar';
    closeModalButton.style.padding = '8px 16px';
    closeModalButton.style.backgroundColor = '#f3f4f6';
    closeModalButton.style.border = '1px solid #d1d5db';
    closeModalButton.style.borderRadius = '4px';
    closeModalButton.style.cursor = 'pointer';
    
    closeButtonContainer.appendChild(closeModalButton);
    
    // Montar o modal completo
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(previewContainer);
    modalContent.appendChild(closeButtonContainer);
    modalContainer.appendChild(modalContent);
    
    // Adicionar o modal ao body
    document.body.appendChild(modalContainer);
    
    // Adicionar eventos
    closeButton.onclick = () => {
      document.body.removeChild(modalContainer);
    };
    
    closeModalButton.onclick = () => {
      document.body.removeChild(modalContainer);
    };
    
    modalContainer.onclick = (e) => {
      if (e.target === modalContainer) {
        document.body.removeChild(modalContainer);
      }
    };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Criar Conteúdo</h2>
        <button
          onClick={onAIAssist}
          disabled={isGenerating}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          <Bot size={16} />
          <span>{isGenerating ? 'Gerando...' : 'IA Assistente'}</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Type size={16} className="inline mr-2" />
            Título
          </label>
          <input
            type="text"
            value={content.title || ''}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Ex: Análise Técnica - EUR/USD em Alta"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Categoria e Tipo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <select
              value={content.category || 'EDUCATIONAL'}
              onChange={(e) => onChange({ category: e.target.value as ContentCategory })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {Object.entries(CONTENT_CATEGORIES).map(([key, category]) => (
                <option key={key} value={key}>
                  {category.name} - {category.description}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Conteúdo
            </label>
            <select
              value={content.type || 'POST'}
              onChange={(e) => onChange({ type: e.target.value as ContentType })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="POST">Post</option>
              <option value="STORY">Story</option>
              <option value="REEL">Reel</option>
              <option value="TELEGRAM_MESSAGE">Mensagem Telegram</option>
            </select>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              <FileText size={16} className="inline mr-2" />
              Conteúdo
            </label>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>{charCount} caracteres</span>
              <span>#{hashtagCount} hashtags</span>
            </div>
          </div>
          <textarea
            value={content.body || ''}
            onChange={(e) => handleBodyChange(e.target.value)}
            placeholder="Escreva seu conteúdo aqui... Use # para hashtags"
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          />
          <p className="mt-2 text-xs text-gray-500">
            💡 Dica: Use emojis e hashtags para aumentar o engajamento. A IA pode ajudar a otimizar seu conteúdo!
          </p>
        </div>

        {/* Hashtags sugeridas */}
        {content.hashtags && content.hashtags.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Hash size={16} className="inline mr-2" />
              Hashtags Sugeridas
            </label>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(content.hashtags) ? content.hashtags : content.hashtags.split(',')).map((hashtag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                >
                  #{hashtag.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Upload de mídia */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Image size={16} className="inline mr-2" />
            Mídia (Opcional)
          </label>
          <FileUpload
            onFileUploaded={handleFileUploaded}
            onFileRemoved={handleFileRemoved}
            uploadedFiles={uploadedFiles}
            contentId={content.id}
            maxFiles={5}
          />
        </div>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            <span>{isSaving ? 'Salvando...' : 'Salvar'}</span>
          </button>

          <button
            onClick={handleSchedule}
            disabled={isScheduling}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Calendar size={16} />
            <span>{isScheduling ? 'Agendando...' : 'Agendar'}</span>
          </button>

          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Clock size={16} />
            <span>{isPublishing ? 'Publicando...' : 'Publicar Agora'}</span>
          </button>

          <button
            onClick={handlePreview}
            className="flex items-center justify-center space-x-2 px-6 py-3 border border-primary-300 text-primary-700 rounded-lg hover:bg-primary-50 transition-colors"
          >
            <Eye size={16} />
            <span>Visualizar</span>
          </button>
        </div>
      </div>
    </div>
  );
}