'use client';

import { useState, useEffect } from 'react';
import { Instagram, Facebook, Send, Eye, Heart, MessageCircle, Share } from 'lucide-react';
import { Content, Platform } from '@/types';
import { PLATFORMS } from '@/lib/constants';

interface ContentPreviewProps {
  content: Partial<Content>;
  platforms: Platform[];
}

const platformPreviews = {
  INSTAGRAM: {
    icon: Instagram,
    name: 'Instagram',
    color: 'from-pink-500 to-purple-600',
    maxLength: 2200
  },
  FACEBOOK: {
    icon: Facebook,
    name: 'Facebook',
    color: 'from-blue-500 to-blue-700',
    maxLength: 63206
  },
  TELEGRAM: {
    icon: Send,
    name: 'Telegram',
    color: 'from-blue-400 to-blue-600',
    maxLength: 4096
  }
} as const;

function PlatformPreview({ platform, content }: { platform: Platform; content: Partial<Content> }) {
  const config = platformPreviews[platform];
  const Icon = config.icon;
  const bodyLength = content.body?.length || 0;
  const isOverLimit = bodyLength > config.maxLength;
  
  console.log('Renderizando preview para plataforma:', platform);
  console.log('Conteúdo para preview:', content);

  // Interface personalizada para o Telegram
  if (platform === 'TELEGRAM') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Platform header */}
        <div className={`p-3 bg-gradient-to-r ${config.color} text-white`}>
          <div className="flex items-center space-x-2">
            <Icon size={20} />
            <span className="font-medium">{config.name}</span>
            <span className="text-xs opacity-75">Preview</span>
          </div>
        </div>

        {/* Content preview */}
        <div className="p-4">
          {/* Channel name */}
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full flex items-center justify-center">
              <Icon size={16} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">Canal Meta Fácil</div>
              <div className="text-xs text-gray-500">há 2 min</div>
            </div>
          </div>

          {/* Message content */}
          <div className="mb-3">
            {content.title && (
              <h3 className="font-medium text-gray-900 mb-2 text-sm"><strong>{content.title}</strong></h3>
            )}
            {content.body && (
              <div>
                <p className={`text-sm text-gray-800 whitespace-pre-wrap ${isOverLimit ? 'text-red-600' : ''}`}>
                  {content.body.length > 200 ? content.body.substring(0, 200) + '...' : content.body}
                </p>
                {isOverLimit && (
                  <p className="text-xs text-red-500 mt-1">
                    ⚠️ Conteúdo excede o limite de {config.maxLength.toLocaleString()} caracteres
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Imagem real ou placeholder */}
          {content.mediaFiles && content.mediaFiles.length > 0 ? (
            <div className="w-full mb-3 rounded-lg overflow-hidden">
              <img 
                src={content.mediaFiles[0].url.startsWith('http') ? content.mediaFiles[0].url : `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}${content.mediaFiles[0].url}`}
                alt="Imagem anexada" 
                className="w-full h-auto max-h-64 object-contain"
                onError={(e) => {
                  console.error('Erro ao carregar imagem:', content.mediaFiles?.[0]?.url);
                  // Fallback para placeholder se a imagem não carregar
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.style.display = 'none';
                  // Mostrar placeholder
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                        <div class="text-center text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          <p class="text-xs">Imagem da mensagem</p>
                        </div>
                      </div>
                    `;
                  }
                }}
              />
            </div>
          ) : (
            <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Eye size={24} className="mx-auto mb-1" />
                <p className="text-xs">Imagem da mensagem</p>
              </div>
            </div>
          )}

          {/* Views count */}
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <div className="flex items-center space-x-1">
              <Eye size={12} />
              <span>132 visualizações</span>
            </div>
            <div className="text-gray-400">
              {bodyLength}/{config.maxLength.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Interface padrão para Instagram/Facebook
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Platform header */}
      <div className={`p-3 bg-gradient-to-r ${config.color} text-white`}>
        <div className="flex items-center space-x-2">
          <Icon size={20} />
          <span className="font-medium">{config.name}</span>
          <span className="text-xs opacity-75">Preview</span>
        </div>
      </div>

      {/* Content preview */}
      <div className="p-4">
        {/* Profile mock */}
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full"></div>
          <div>
            <div className="text-sm font-medium text-gray-900">Seu Perfil</div>
            <div className="text-xs text-gray-500">há 2 min</div>
          </div>
        </div>

        {/* Title */}
        {content.title && (
          <h3 className="font-medium text-gray-900 mb-2 text-sm">{content.title}</h3>
        )}

        {/* Body */}
        {content.body && (
          <div className="mb-3">
            <p className={`text-sm text-gray-800 whitespace-pre-wrap ${isOverLimit ? 'text-red-600' : ''}`}>
              {content.body.length > 200 ? content.body.substring(0, 200) + '...' : content.body}
            </p>
            {isOverLimit && (
              <p className="text-xs text-red-500 mt-1">
                ⚠️ Conteúdo excede o limite de {config.maxLength.toLocaleString()} caracteres
              </p>
            )}
          </div>
        )}

        {/* Imagem real ou placeholder */}
        {content.mediaFiles && content.mediaFiles.length > 0 ? (
          <div className="w-full mb-3 rounded-lg overflow-hidden">
            <img 
              src={content.mediaFiles[0].url.startsWith('http') ? content.mediaFiles[0].url : `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}${content.mediaFiles[0].url}`}
              alt="Imagem anexada" 
              className="w-full h-auto max-h-64 object-contain"
              onError={(e) => {
                console.error('Erro ao carregar imagem:', content.mediaFiles?.[0]?.url);
                // Fallback para placeholder se a imagem não carregar
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.style.display = 'none';
                // Mostrar placeholder
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                      <div class="text-center text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        <p class="text-xs">Imagem do post</p>
                      </div>
                    </div>
                  `;
                }
              }}
            />
          </div>
        ) : (
          <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Eye size={24} className="mx-auto mb-1" />
              <p className="text-xs">Imagem do post</p>
            </div>
          </div>
        )}

        {/* Engagement mock */}
        <div className="flex items-center justify-between text-gray-500 text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Heart size={12} />
              <span>47</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle size={12} />
              <span>5</span>
            </div>
            <div className="flex items-center space-x-1">
              <Share size={12} />
              <span>2</span>
            </div>
          </div>
          <div className="text-gray-400">
            {bodyLength}/{config.maxLength.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContentPreview({ content, platforms }: ContentPreviewProps) {
  // Forçar o uso da plataforma TELEGRAM quando disponível
  const initialPlatform = platforms.includes('TELEGRAM') ? 'TELEGRAM' : (platforms.length > 0 ? platforms[0] : 'INSTAGRAM');
  
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(initialPlatform);
  
  // Atualizar a plataforma selecionada quando as plataformas do usuário mudarem
  useEffect(() => {
    // Se TELEGRAM estiver entre as plataformas, selecione-o
    if (platforms.includes('TELEGRAM')) {
      setSelectedPlatform('TELEGRAM');
    } else if (platforms.length > 0) {
      setSelectedPlatform(platforms[0]);
    }
    console.log('ContentPreview - Plataformas atualizadas:', platforms, 'Selecionada:', platforms.includes('TELEGRAM') ? 'TELEGRAM' : (platforms.length > 0 ? platforms[0] : 'INSTAGRAM'));
  }, [platforms]);

  if (platforms.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
        <div className="text-center py-8">
          <Eye size={32} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">Selecione uma plataforma para ver o preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>

      {/* Platform selector tabs */}
      {platforms.length > 1 && (
        <div className="flex space-x-1 mb-4 bg-gray-100 rounded-lg p-1">
          {platforms.map((platform) => {
            const config = platformPreviews[platform];
            const Icon = config.icon;
            
            return (
              <button
                key={platform}
                onClick={() => setSelectedPlatform(platform)}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${selectedPlatform === platform
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                <Icon size={14} />
                <span>{config.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Preview content */}
      <div className="space-y-4">
        <PlatformPreview platform={selectedPlatform} content={content} />

        {/* Content stats */}
        {content.body && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {content.body.length}
              </div>
              <div className="text-xs text-gray-600">Caracteres</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {(content.body.match(/#\w+/g) || []).length}
              </div>
              <div className="text-xs text-gray-600">Hashtags</div>
            </div>
          </div>
        )}

        {/* Optimization suggestions */}
        {content.body && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Sugestões de Otimização</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              {content.body.length < 100 && (
                <li>• Considere expandir o conteúdo para maior engajamento</li>
              )}
              {(content.body.match(/#\w+/g) || []).length === 0 && (
                <li>• Adicione hashtags relevantes para aumentar o alcance</li>
              )}
              {!content.body.includes('📊') && !content.body.includes('💡') && (
                <li>• Use emojis para tornar o conteúdo mais atrativo</li>
              )}
              {!content.body.toLowerCase().includes('curtir') && !content.body.toLowerCase().includes('comentar') && (
                <li>• Adicione um call-to-action para aumentar o engajamento</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}