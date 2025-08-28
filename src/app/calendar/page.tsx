'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CalendarView } from '@/components/calendar/CalendarView';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { ScheduleModal } from '@/components/calendar/ScheduleModal';
import { CalendarEvent, Content } from '@/types';
import { useSession } from 'next-auth/react';

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    // Carregar eventos reais do backend
    const fetchEvents = async () => {
      if (!session?.user?.id) return;
      
      setLoading(true);
      try {
        // Calcular o intervalo de datas para buscar eventos
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1); // 1 mês antes
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 2); // 2 meses depois

        const response = await fetch(`/api/calendar/events?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
        const data = await response.json();

        if (response.ok && data.success) {
          setEvents(data.events);
        } else {
          console.error('Erro ao buscar eventos:', data.error);
          // Fallback para eventos mock se houver erro
          setEvents([]);
        }
      } catch (error) {
        console.error('Erro ao buscar eventos:', error);
        // Fallback para eventos mock se houver erro
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [session?.user?.id]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleEventSelect = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowScheduleModal(true);
  };

  const handleNewEvent = (date?: Date) => {
    setSelectedEvent(null);
    setSelectedDate(date || new Date());
    setShowScheduleModal(true);
  };

  const handleSaveEvent = (eventData: Partial<CalendarEvent>) => {
    if (selectedEvent) {
      // Atualizar evento existente
      setEvents(prev => prev.map(event => 
        event.id === selectedEvent.id 
          ? { ...event, ...eventData } as CalendarEvent
          : event
      ));
    } else {
      // Criar novo evento
      const newEvent: CalendarEvent = {
        id: Math.random().toString(36).substr(2, 9),
        contentId: 'temp-content',
        userId: session?.user?.id || 'user1',
        title: eventData.title || 'Novo evento',
        description: eventData.description || '',
        scheduledFor: eventData.scheduledFor || selectedDate,
        platforms: eventData.platforms || ['INSTAGRAM'],
        status: 'SCHEDULED',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setEvents(prev => [...prev, newEvent]);
    }
    setShowScheduleModal(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
    setShowScheduleModal(false);
  };

  const handlePublishNow = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, status: 'PUBLISHED' as const }
        : event
    ));
    // Aqui integraria com as APIs das plataformas
    console.log('Publishing event:', eventId);
  };

  const eventsForSelectedDate = events.filter(event => {
    const eventDate = new Date(event.scheduledFor);
    return eventDate.toDateString() === selectedDate.toDateString();
  });

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <CalendarHeader
          selectedDate={selectedDate}
          viewMode={viewMode}
          onDateChange={setSelectedDate}
          onViewModeChange={setViewMode}
          onNewEvent={() => handleNewEvent()}
          eventsCount={events.length}
        />

        {/* Calendar View */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Calendar */}
          <div className="lg:col-span-3">
            <CalendarView
              events={events}
              selectedDate={selectedDate}
              viewMode={viewMode}
              loading={loading}
              onDateSelect={handleDateSelect}
              onEventSelect={handleEventSelect}
              onNewEvent={handleNewEvent}
            />
          </div>

          {/* Sidebar with events for selected date */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">
                Eventos para {selectedDate.toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long'
                })}
              </h3>

              {eventsForSelectedDate.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm mb-4">
                    Nenhum evento agendado
                  </p>
                  <button
                    onClick={() => handleNewEvent(selectedDate)}
                    className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Agendar Post
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {eventsForSelectedDate.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => handleEventSelect(event)}
                      className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition-colors"
                    >
                      <h4 className="font-medium text-sm text-gray-900 mb-1">
                        {event.title}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2">
                        {new Date(event.scheduledFor).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <div className="flex items-center space-x-1">
                        {event.platforms.map((platform) => (
                          <span
                            key={platform}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <button
                    onClick={() => handleNewEvent(selectedDate)}
                    className="w-full mt-4 px-4 py-2 border border-dashed border-gray-300 text-gray-600 text-sm rounded-lg hover:border-primary-400 hover:text-primary-600 transition-colors"
                  >
                    + Adicionar Evento
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Schedule Modal */}
        {showScheduleModal && (
          <ScheduleModal
            event={selectedEvent}
            selectedDate={selectedDate}
            onSave={handleSaveEvent}
            onDelete={selectedEvent ? () => handleDeleteEvent(selectedEvent.id) : undefined}
            onPublishNow={selectedEvent ? () => handlePublishNow(selectedEvent.id) : undefined}
            onClose={() => setShowScheduleModal(false)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}