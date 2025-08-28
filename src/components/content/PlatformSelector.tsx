'use client';

import { Instagram, Facebook, Send, Check } from 'lucide-react';
import { Platform } from '@/types';
import { PLATFORMS } from '@/lib/constants';

interface PlatformSelectorProps {
  selectedPlatforms: Platform[] | string;
  onPlatformToggle: (platform: Platform) => void;
}

const platformConfig = {
  INSTAGRAM: {
    icon: Instagram,
    name: 'Instagram',
    color: 'bg-gradient-to-br from-pink-500 to-purple-600',
    textColor: 'text-pink-600',
    borderColor: 'border-pink-200',
    description: 'Posts, Stories e Reels'
  },
  FACEBOOK: {
    icon: Facebook,
    name: 'Facebook',
    color: 'bg-gradient-to-br from-blue-500 to-blue-700',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-200',
    description: 'Posts e anúncios'
  },
  TELEGRAM: {
    icon: Send,
    name: 'Telegram',
    color: 'bg-gradient-to-br from-blue-400 to-blue-600',
    textColor: 'text-blue-500',
    borderColor: 'border-blue-200',
    description: 'Canais e grupos'
  }
} as const;

export function PlatformSelector({ selectedPlatforms, onPlatformToggle }: PlatformSelectorProps) {
  // Converter para array se for string
  const platformsArray = typeof selectedPlatforms === 'string' 
    ? selectedPlatforms.split(',').filter(p => p.trim() !== '') as Platform[]
    : selectedPlatforms;

  console.log('PlatformSelector - Plataformas selecionadas:', platformsArray);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Selecionar Plataformas</h2>
        <p className="text-sm text-gray-600 mt-1">
          Escolha onde deseja publicar seu conteúdo
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(Object.keys(platformConfig) as Platform[]).map((platform) => {
          const config = platformConfig[platform];
          const Icon = config.icon;
          const isSelected = platformsArray.includes(platform);
          const platformData = PLATFORMS[platform];

          return (
            <button
              key={platform}
              onClick={() => onPlatformToggle(platform)}
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-200
                ${isSelected 
                  ? `${config.borderColor} bg-opacity-10 ${config.textColor.replace('text-', 'bg-').replace('600', '50')}` 
                  : 'border-gray-200 hover:border-gray-300'
                }
                hover:shadow-md
              `}
            >
              {/* Checkmark */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Check size={12} className="text-white" />
                </div>
              )}

              {/* Platform icon */}
              <div className={`
                w-12 h-12 rounded-lg ${config.color} flex items-center justify-center mb-3 mx-auto
              `}>
                <Icon size={24} className="text-white" />
              </div>

              {/* Platform info */}
              <div className="text-center">
                <h3 className="font-medium text-gray-900">{config.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{config.description}</p>
                
                {/* Platform limits */}
                <div className="mt-2 space-y-1">
                  <div className="text-xs text-gray-400">
                    Máx: {platformData.maxCharacters.toLocaleString()} caracteres
                  </div>
                  <div className="text-xs text-gray-400">
                    Hashtags: {platformData.maxHashtags}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Platform summary */}
      {platformsArray.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Plataformas selecionadas ({platformsArray.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {platformsArray.map((platform) => {
              const config = platformConfig[platform];
              const Icon = config.icon;
              
              return (
                <div 
                  key={platform}
                  className="flex items-center space-x-2 px-3 py-1 bg-white rounded-full border border-gray-200"
                >
                  <Icon size={14} className={config.textColor} />
                  <span className="text-sm text-gray-700">{config.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No platforms selected */}
      {platformsArray.length === 0 && (
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">
            ⚠️ Selecione pelo menos uma plataforma para continuar
          </p>
        </div>
      )}
    </div>
  );
}