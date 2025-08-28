'use client';

import { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Clock,
  Instagram,
  Facebook,
  Send,
  Image,
  Video,
  FileText
} from 'lucide-react';

import { Content } from '@/types';

interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: 'image' | 'video' | 'text' | 'carousel';
  platforms: ('INSTAGRAM' | 'FACEBOOK' | 'TELEGRAM')[];
  scheduledTime: Date;
  status: 'scheduled' | 'published' | 'draft' | 'failed';
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
  };
}

interface ContentCalendarProps {
  contents?: Content[];
  loading?: boolean;
  content?: ContentItem[];
  onCreateContent?: () => void;
  onEditContent?: (contentId: string) => void;
  onDeleteContent?: (contentId: string) => void;
}

// Conteúdo real será carregado da API
// Lista vazia para remover dados fictícios
const realContent: ContentItem[] = [];

export function ContentCalendar({
  contents,
  loading = false,
  content = realContent,
  onCreateContent = () => {},
  onEditContent = () => {},
  onDeleteContent = () => {}
}: ContentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedView, setSelectedView] = useState<'month' | 'week'>('week');

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getContentForDate = (date: Date) => {
    const dateStr = date.toDateString();
    return content.filter(item => 
      item.scheduledTime.toDateString() === dateStr
    );
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image size={12} className="text-blue-600" />;
      case 'video':
        return <Video size={12} className="text-red-600" />;
      case 'text':
        return <FileText size={12} className="text-green-600" />;
      case 'carousel':
        return <Image size={12} className="text-purple-600" />;
      default:
        return <FileText size={12} className="text-gray-600" />;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'INSTAGRAM':
        return <Instagram size={10} className="text-pink-600" />;
      case 'FACEBOOK':
        return <Facebook size={10} className="text-blue-600" />;
      case 'TELEGRAM':
        return <Send size={10} className="text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const days = selectedView === 'month' ? getDaysInMonth(currentDate) : getWeekDays(currentDate);
  const isCurrentMonth = (date: Date) => date.getMonth() === currentDate.getMonth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Calendário de Conteúdo</h2>
          <p className="text-gray-600">Planeje e agende seus posts</p>
        </div>
        <button
          onClick={onCreateContent}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Criar Conteúdo</span>
        </button>
      </div>

      {/* Calendar Controls */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => selectedView === 'month' ? navigateMonth(-1) : navigateWeek(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft size={20} />
            </button>
            <h3 className="text-lg font-semibold text-gray-900">
              {currentDate.toLocaleDateString('pt-BR', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </h3>
            <button
              onClick={() => selectedView === 'month' ? navigateMonth(1) : navigateWeek(1)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedView('week')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                selectedView === 'week'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => setSelectedView('month')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                selectedView === 'month'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Mês
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-700">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className={`grid grid-cols-7 ${selectedView === 'month' ? 'grid-rows-6' : 'grid-rows-1'}`}>
          {days.map((day, index) => {
            const dayContent = getContentForDate(day);
            const isToday = day.toDateString() === new Date().toDateString();
            const isCurrentMonthDay = selectedView === 'week' || isCurrentMonth(day);

            return (
              <div
                key={index}
                className={`border-r border-b border-gray-200 ${
                  selectedView === 'month' ? 'h-32' : 'h-48'
                } ${isCurrentMonthDay ? 'bg-white' : 'bg-gray-50'}`}
              >
                <div className={`p-2 ${isToday ? 'bg-primary-50' : ''}`}>
                  <div className={`text-sm font-medium ${
                    isToday 
                      ? 'text-primary-600' 
                      : isCurrentMonthDay 
                        ? 'text-gray-900' 
                        : 'text-gray-400'
                  }`}>
                    {day.getDate()}
                  </div>
                  
                  <div className="mt-1 space-y-1">
                    {dayContent.slice(0, selectedView === 'month' ? 2 : 6).map((item) => (
                      <div
                        key={item.id}
                        onClick={() => onEditContent(item.id)}
                        className={`text-xs p-1 rounded border cursor-pointer hover:shadow-sm ${getStatusColor(item.status)}`}
                      >
                        <div className="flex items-center space-x-1 mb-1">
                          {getTypeIcon(item.type)}
                          <span className="font-medium truncate">{item.title}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <Clock size={8} />
                            <span>{item.scheduledTime.toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {item.platforms.slice(0, 2).map((platform) => (
                              <span key={platform}>
                                {getPlatformIcon(platform)}
                              </span>
                            ))}
                            {item.platforms.length > 2 && (
                              <span className="text-xs text-gray-500">
                                +{item.platforms.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {dayContent.length > (selectedView === 'month' ? 2 : 6) && (
                      <div className="text-xs text-gray-500 text-center">
                        +{dayContent.length - (selectedView === 'month' ? 2 : 6)} mais
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{content.length}</div>
          <div className="text-sm text-gray-600">Total de Posts</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {content.filter(c => c.status === 'scheduled').length}
          </div>
          <div className="text-sm text-gray-600">Agendados</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {content.filter(c => c.status === 'published').length}
          </div>
          <div className="text-sm text-gray-600">Publicados</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="text-2xl font-bold text-gray-600">
            {content.filter(c => c.status === 'draft').length}
          </div>
          <div className="text-sm text-gray-600">Rascunhos</div>
        </div>
      </div>
    </div>
  );
}