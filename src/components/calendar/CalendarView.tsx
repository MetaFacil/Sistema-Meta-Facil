'use client';

import { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock,
  Instagram,
  Facebook,
  Send,
  Plus
} from 'lucide-react';
import { CalendarEvent } from '@/types';

interface CalendarViewProps {
  events: CalendarEvent[];
  selectedDate: Date;
  viewMode: 'month' | 'week' | 'day';
  loading: boolean;
  onDateSelect: (date: Date) => void;
  onEventSelect: (event: CalendarEvent) => void;
  onNewEvent: (date: Date) => void;
}

const platformIcons = {
  INSTAGRAM: Instagram,
  FACEBOOK: Facebook,
  TELEGRAM: Send
};

const platformColors = {
  INSTAGRAM: 'bg-pink-100 text-pink-600',
  FACEBOOK: 'bg-blue-100 text-blue-600',
  TELEGRAM: 'bg-blue-50 text-blue-500'
};

function EventItem({ event, onClick }: { event: CalendarEvent; onClick: () => void }) {
  const time = new Date(event.scheduledFor).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div
      onClick={onClick}
      className="p-2 mb-1 bg-primary-50 border border-primary-200 rounded text-xs cursor-pointer hover:bg-primary-100 transition-colors"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium text-primary-800 truncate">
          {event.title}
        </span>
        <span className="text-primary-600 text-xs">{time}</span>
      </div>
      <div className="flex items-center space-x-1">
        {event.platforms.slice(0, 3).map((platform) => {
          const Icon = platformIcons[platform];
          return (
            <div key={platform} className={`p-1 rounded ${platformColors[platform]}`}>
              <Icon size={10} />
            </div>
          );
        })}
        {event.platforms.length > 3 && (
          <span className="text-xs text-gray-500">+{event.platforms.length - 3}</span>
        )}
      </div>
    </div>
  );
}

function MonthView({ 
  events, 
  selectedDate, 
  onDateSelect, 
  onEventSelect, 
  onNewEvent 
}: Omit<CalendarViewProps, 'viewMode' | 'loading'>) {
  const today = new Date();
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();
  
  // Get first day of month and calculate calendar grid
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayOfCalendar = new Date(firstDayOfMonth);
  firstDayOfCalendar.setDate(firstDayOfCalendar.getDate() - firstDayOfCalendar.getDay());
  
  const days = [];
  const currentDate = new Date(firstDayOfCalendar);
  
  // Generate 42 days (6 weeks)
  for (let i = 0; i < 42; i++) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.scheduledFor);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Week headers */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
          <div key={day} className="p-4 text-center text-sm font-medium text-gray-700 bg-gray-50">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {days.map((date) => {
          const isCurrentMonth = date.getMonth() === currentMonth;
          const isToday = date.toDateString() === today.toDateString();
          const isSelected = date.toDateString() === selectedDate.toDateString();
          const dayEvents = getEventsForDate(date);

          return (
            <div
              key={date.toISOString()}
              className={`
                min-h-[120px] p-2 border-r border-b border-gray-200 cursor-pointer
                ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'hover:bg-gray-50'}
                ${isSelected ? 'bg-primary-50' : ''}
              `}
              onClick={() => onDateSelect(date)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`
                  text-sm font-medium
                  ${isToday ? 'w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center' : ''}
                  ${isSelected && !isToday ? 'text-primary-600' : ''}
                `}>
                  {date.getDate()}
                </span>
                
                {isCurrentMonth && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNewEvent(date);
                    }}
                    className="opacity-0 hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
                  >
                    <Plus size={12} className="text-gray-600" />
                  </button>
                )}
              </div>

              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <EventItem
                    key={event.id}
                    event={event}
                    onClick={() => onEventSelect(event)}
                  />
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-500 pl-2">
                    +{dayEvents.length - 3} mais
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeekView({ 
  events, 
  selectedDate, 
  onDateSelect, 
  onEventSelect, 
  onNewEvent 
}: Omit<CalendarViewProps, 'viewMode' | 'loading'>) {
  const startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
  
  const weekDays: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    weekDays.push(day);
  }

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const today = new Date();

  const getEventsForDateTime = (date: Date, hour: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.scheduledFor);
      return eventDate.toDateString() === date.toDateString() && 
             eventDate.getHours() === hour;
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Week header */}
      <div className="grid grid-cols-8 border-b border-gray-200">
        <div className="p-4 text-center text-sm font-medium text-gray-700 bg-gray-50">
          Hora
        </div>
        {weekDays.map((day) => {
          const isToday = day.toDateString() === today.toDateString();
          const isSelected = day.toDateString() === selectedDate.toDateString();
          
          return (
            <div
              key={day.toISOString()}
              onClick={() => onDateSelect(day)}
              className={`
                p-4 text-center cursor-pointer transition-colors
                ${isToday ? 'bg-primary-100' : 'bg-gray-50'}
                ${isSelected ? 'bg-primary-200' : 'hover:bg-gray-100'}
              `}
            >
              <div className="text-xs text-gray-600">
                {day.toLocaleDateString('pt-BR', { weekday: 'short' })}
              </div>
              <div className={`text-sm font-medium ${isToday ? 'text-primary-600' : 'text-gray-900'}`}>
                {day.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <div className="max-h-[600px] overflow-y-auto">
        {hours.map((hour) => (
          <div key={hour} className="grid grid-cols-8 border-b border-gray-100">
            <div className="p-3 text-xs text-gray-600 bg-gray-50 text-center">
              {hour.toString().padStart(2, '0')}:00
            </div>
            {weekDays.map((day) => {
              const dayEvents = getEventsForDateTime(day, hour);
              
              return (
                <div
                  key={`${day.toISOString()}-${hour}`}
                  className="p-2 border-r border-gray-100 min-h-[60px] hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    const newDate = new Date(day);
                    newDate.setHours(hour, 0, 0, 0);
                    onNewEvent(newDate);
                  }}
                >
                  {dayEvents.map((event) => (
                    <EventItem
                      key={event.id}
                      event={event}
                      onClick={() => onEventSelect(event)}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function DayView({ 
  events, 
  selectedDate, 
  onEventSelect, 
  onNewEvent 
}: Omit<CalendarViewProps, 'viewMode' | 'loading' | 'onDateSelect'>) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  const getEventsForHour = (hour: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.scheduledFor);
      return eventDate.toDateString() === selectedDate.toDateString() && 
             eventDate.getHours() === hour;
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-medium text-gray-900">
          {selectedDate.toLocaleDateString('pt-BR', { 
            weekday: 'long',
            day: '2-digit', 
            month: 'long' 
          })}
        </h3>
      </div>

      <div className="max-h-[600px] overflow-y-auto">
        {hours.map((hour) => {
          const hourEvents = getEventsForHour(hour);
          
          return (
            <div key={hour} className="flex border-b border-gray-100">
              <div className="w-20 p-3 text-xs text-gray-600 bg-gray-50 text-center">
                {hour.toString().padStart(2, '0')}:00
              </div>
              <div
                className="flex-1 p-3 min-h-[80px] hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setHours(hour, 0, 0, 0);
                  onNewEvent(newDate);
                }}
              >
                {hourEvents.length === 0 ? (
                  <div className="text-xs text-gray-400">Clique para agendar</div>
                ) : (
                  <div className="space-y-2">
                    {hourEvents.map((event) => (
                      <div
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventSelect(event);
                        }}
                        className="p-3 bg-primary-50 border border-primary-200 rounded-lg cursor-pointer hover:bg-primary-100 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-primary-800">{event.title}</h4>
                          <span className="text-xs text-primary-600">
                            {new Date(event.scheduledFor).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        {event.description && (
                          <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                        )}
                        <div className="flex items-center space-x-2">
                          {event.platforms.map((platform) => {
                            const Icon = platformIcons[platform];
                            return (
                              <div key={platform} className={`p-1 rounded ${platformColors[platform]}`}>
                                <Icon size={12} />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LoadingSkeleton({ viewMode }: { viewMode: 'month' | 'week' | 'day' }) {
  if (viewMode === 'month') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-7 border-b border-gray-200">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="p-4 bg-gray-50">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="min-h-[120px] p-2 border-r border-b border-gray-200">
              <div className="h-4 w-6 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="space-y-1">
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CalendarView(props: CalendarViewProps) {
  if (props.loading) {
    return <LoadingSkeleton viewMode={props.viewMode} />;
  }

  switch (props.viewMode) {
    case 'month':
      return <MonthView {...props} />;
    case 'week':
      return <WeekView {...props} />;
    case 'day':
      return <DayView {...props} />;
    default:
      return <MonthView {...props} />;
  }
}