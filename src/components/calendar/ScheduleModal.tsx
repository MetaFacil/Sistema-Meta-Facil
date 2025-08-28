'use client';

import { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Type, 
  FileText, 
  Instagram, 
  Facebook, 
  Send,
  Save,
  Trash2,
  Send as SendIcon,
  Eye
} from 'lucide-react';
import { CalendarEvent, Platform, ContentCategory, ContentType } from '@/types';
import { CONTENT_CATEGORIES } from '@/lib/constants';

interface ScheduleModalProps {
  event?: CalendarEvent | null;
  selectedDate: Date;
  onSave: (eventData: Partial<CalendarEvent>) => void;
  onDelete?: () => void;
  onPublishNow?: () => void;
  onClose: () => void;
}

const platformOptions = [
  { value: 'INSTAGRAM' as Platform, label: 'Instagram', icon: Instagram, color: 'text-pink-600' },
  { value: 'FACEBOOK' as Platform, label: 'Facebook', icon: Facebook, color: 'text-blue-600' },
  { value: 'TELEGRAM' as Platform, label: 'Telegram', icon: Send, color: 'text-blue-500' }
];

export function ScheduleModal({ 
  event, 
  selectedDate, 
  onSave, 
  onDelete, 
  onPublishNow, 
  onClose 
}: ScheduleModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduledFor: '',
    platforms: [] as Platform[],
    category: 'EDUCATIONAL' as ContentCategory,
    type: 'POST' as ContentType,
    content: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (event) {
      // Editing existing event
      setFormData({
        title: event.title,
        description: event.description || '',
        scheduledFor: new Date(event.scheduledFor).toISOString().slice(0, 16),
        platforms: event.platforms,
        category: 'EDUCATIONAL',
        type: 'POST',
        content: event.description || ''
      });
    } else {
      // Creating new event
      const defaultDateTime = new Date(selectedDate);
      defaultDateTime.setHours(9, 0, 0, 0); // Default to 9 AM
      
      setFormData({
        title: '',
        description: '',
        scheduledFor: defaultDateTime.toISOString().slice(0, 16),
        platforms: ['INSTAGRAM'],
        category: 'EDUCATIONAL',
        type: 'POST',
        content: ''
      });
    }
  }, [event, selectedDate]);

  const handlePlatformToggle = (platform: Platform) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    if (!formData.scheduledFor) {
      newErrors.scheduledFor = 'Data e hora são obrigatórias';
    } else {
      const scheduledDate = new Date(formData.scheduledFor);
      const now = new Date();
      if (scheduledDate <= now) {
        newErrors.scheduledFor = 'Data deve ser no futuro';
      }
    }

    if (formData.platforms.length === 0) {
      newErrors.platforms = 'Selecione pelo menos uma plataforma';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const eventData: Partial<CalendarEvent> = {
      title: formData.title,
      description: formData.description,
      scheduledFor: new Date(formData.scheduledFor),
      platforms: formData.platforms
    };

    onSave(eventData);
  };

  const handlePublishNow = () => {
    if (onPublishNow && event) {
      onPublishNow();
    }
  };

  const isEditing = !!event;
  const canPublishNow = isEditing && event?.status === 'SCHEDULED';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {isEditing ? 'Editar Agendamento' : 'Novo Agendamento'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Type size={16} className="inline mr-2" />
                Título do Post *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Análise Técnica - EUR/USD"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            {/* Date and Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-2" />
                Data e Hora *
              </label>
              <input
                type="datetime-local"
                value={formData.scheduledFor}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledFor: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.scheduledFor ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.scheduledFor && <p className="mt-1 text-sm text-red-600">{errors.scheduledFor}</p>}
            </div>

            {/* Platforms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Plataformas *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {platformOptions.map((platform) => {
                  const Icon = platform.icon;
                  const isSelected = formData.platforms.includes(platform.value);
                  
                  return (
                    <button
                      key={platform.value}
                      type="button"
                      onClick={() => handlePlatformToggle(platform.value)}
                      className={`
                        p-4 border-2 rounded-lg transition-all duration-200 flex flex-col items-center space-y-2
                        ${isSelected 
                          ? 'border-primary-300 bg-primary-50' 
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <Icon size={24} className={platform.color} />
                      <span className="text-sm font-medium text-gray-900">
                        {platform.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              {errors.platforms && <p className="mt-1 text-sm text-red-600">{errors.platforms}</p>}
            </div>

            {/* Category and Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as ContentCategory }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {Object.entries(CONTENT_CATEGORIES).map(([key, category]) => (
                    <option key={key} value={key}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as ContentType }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="POST">Post</option>
                  <option value="STORY">Story</option>
                  <option value="REEL">Reel</option>
                  <option value="TELEGRAM_MESSAGE">Mensagem Telegram</option>
                </select>
              </div>
            </div>

            {/* Description/Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText size={16} className="inline mr-2" />
                Descrição/Conteúdo
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva o conteúdo que será publicado..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>

            {/* Preview Section */}
            {formData.scheduledFor && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Preview do Agendamento</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <strong>Publicação:</strong> {new Date(formData.scheduledFor).toLocaleString('pt-BR')}
                  </p>
                  <p>
                    <strong>Plataformas:</strong> {formData.platforms.join(', ')}
                  </p>
                  <p>
                    <strong>Categoria:</strong> {CONTENT_CATEGORIES[formData.category]?.name}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <div className="flex gap-3">
              {isEditing && onDelete && (
                <button
                  onClick={onDelete}
                  className="flex items-center space-x-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={16} />
                  <span>Excluir</span>
                </button>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>

              {canPublishNow && (
                <button
                  onClick={handlePublishNow}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <SendIcon size={16} />
                  <span>Publicar Agora</span>
                </button>
              )}

              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Save size={16} />
                <span>{isEditing ? 'Atualizar' : 'Agendar'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}