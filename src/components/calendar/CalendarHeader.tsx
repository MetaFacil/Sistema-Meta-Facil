'use client';

import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Plus,
  Filter,
  Download
} from 'lucide-react';

interface CalendarHeaderProps {
  selectedDate: Date;
  viewMode: 'month' | 'week' | 'day';
  onDateChange: (date: Date) => void;
  onViewModeChange: (mode: 'month' | 'week' | 'day') => void;
  onNewEvent: () => void;
  eventsCount: number;
}

export function CalendarHeader({ 
  selectedDate, 
  viewMode, 
  onDateChange, 
  onViewModeChange, 
  onNewEvent,
  eventsCount 
}: CalendarHeaderProps) {
  
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    
    switch (viewMode) {
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'day':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
    }
    
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const formatDateHeader = () => {
    switch (viewMode) {
      case 'month':
        return selectedDate.toLocaleDateString('pt-BR', { 
          month: 'long', 
          year: 'numeric' 
        });
      case 'week':
        const startOfWeek = new Date(selectedDate);
        startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        return `${startOfWeek.toLocaleDateString('pt-BR', { 
          day: '2-digit', 
          month: 'short' 
        })} - ${endOfWeek.toLocaleDateString('pt-BR', { 
          day: '2-digit', 
          month: 'short' 
        })}`;
      case 'day':
        return selectedDate.toLocaleDateString('pt-BR', { 
          weekday: 'long',
          day: '2-digit', 
          month: 'long',
          year: 'numeric'
        });
    }
  };

  return (
    <div className="mb-6">
      {/* Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendário</h1>
          <p className="mt-2 text-gray-600">
            Gerencie e agende suas publicações para todas as plataformas
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button
            onClick={onNewEvent}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus size={16} />
            <span>Novo Agendamento</span>
          </button>
          
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={16} />
            <span className="hidden sm:inline">Exportar</span>
          </button>
        </div>
      </div>

      {/* Navigation and View Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Date Navigation */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateDate('prev')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              
              <h2 className="text-lg font-semibold text-gray-900 min-w-[200px] text-center">
                {formatDateHeader()}
              </h2>
              
              <button
                onClick={() => navigateDate('next')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            
            <button
              onClick={goToToday}
              className="px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hoje
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Events Count */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <CalendarIcon size={16} />
                <span>{eventsCount} eventos agendados</span>
              </div>

              {/* Filter button */}
              <button className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter size={14} />
                <span>Filtros</span>
              </button>
            </div>

            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1 ml-4">
              {(['month', 'week', 'day'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => onViewModeChange(mode)}
                  className={`
                    px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${viewMode === mode
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                    }
                  `}
                >
                  {mode === 'month' ? 'Mês' : mode === 'week' ? 'Semana' : 'Dia'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}