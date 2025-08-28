'use client';

import { useState, useEffect } from 'react';
import { Content, ContentCategory, ContentStatus, Platform } from '@/types';

interface CreateContentData {
  title: string;
  body: string;
  category: ContentCategory;
  platforms: Platform[];
  hashtags: string[];
  scheduledFor?: Date;
}

interface UpdateContentData extends Partial<CreateContentData> {
  id: string;
  status?: ContentStatus;
}

interface ContentFilters {
  category?: ContentCategory;
  status?: ContentStatus;
  platform?: Platform;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export function useContent() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContents = async (filters?: ContentFilters) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      
      if (filters?.category) params.append('category', filters.category);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.platform) params.append('platform', filters.platform);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom.toISOString());
      if (filters?.dateTo) params.append('dateTo', filters.dateTo.toISOString());

      const response = await fetch(`/api/content?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar conteúdos');
      }

      const data = await response.json();
      setContents(data.contents || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Error fetching contents:', err);
    } finally {
      setLoading(false);
    }
  };

  const createContent = async (data: CreateContentData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar conteúdo');
      }

      const newContent = await response.json();
      setContents(prev => [newContent, ...prev]);
      
      return { success: true, content: newContent };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar conteúdo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (data: UpdateContentData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/content/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar conteúdo');
      }

      const updatedContent = await response.json();
      setContents(prev => 
        prev.map(content => 
          content.id === data.id ? updatedContent : content
        )
      );
      
      return { success: true, content: updatedContent };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar conteúdo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteContent = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/content/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar conteúdo');
      }

      setContents(prev => prev.filter(content => content.id !== id));
      
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar conteúdo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const publishContent = async (id: string, platforms: Platform[]) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/content/${id}/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ platforms }),
      });

      if (!response.ok) {
        throw new Error('Erro ao publicar conteúdo');
      }

      const result = await response.json();
      
      // Atualizar status do conteúdo
      setContents(prev => 
        prev.map(content => 
          content.id === id 
            ? { ...content, status: 'PUBLISHED' as ContentStatus, publishedAt: new Date() }
            : content
        )
      );
      
      return { success: true, result };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao publicar conteúdo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const scheduleContent = async (id: string, scheduledFor: Date, platforms: Platform[]) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/content/${id}/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scheduledFor, platforms }),
      });

      if (!response.ok) {
        throw new Error('Erro ao agendar conteúdo');
      }

      const result = await response.json();
      
      // Atualizar status do conteúdo
      setContents(prev => 
        prev.map(content => 
          content.id === id 
            ? { ...content, status: 'SCHEDULED' as ContentStatus, scheduledFor }
            : content
        )
      );
      
      return { success: true, result };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao agendar conteúdo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    contents,
    loading,
    error,
    fetchContents,
    createContent,
    updateContent,
    deleteContent,
    publishContent,
    scheduleContent,
    clearError: () => setError(null),
  };
}