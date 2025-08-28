'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ContentGrid } from '@/components/content/ContentGrid';
import { ContentFilters } from '@/components/content/ContentFilters';
import { ContentSearch } from '@/components/content/ContentSearch';
import { Content, ContentCategory, ContentStatus, Platform } from '@/types';

export default function ContentLibraryPage() {
  const [contents, setContents] = useState<Content[]>([]);
  const [filteredContents, setFilteredContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'ALL' as ContentCategory | 'ALL',
    status: 'ALL' as ContentStatus | 'ALL',
    platform: 'ALL' as Platform | 'ALL',
    dateRange: 'ALL' as 'ALL' | 'TODAY' | 'WEEK' | 'MONTH'
  });

  useEffect(() => {
    // Buscar dados reais da API
    const fetchContents = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/content');
        const data = await response.json();

        if (response.ok) {
          console.log('Conteúdos carregados:', data.contents);
          
          // Converter strings em arrays para platforms e hashtags
          const processedContents = data.contents.map((content: any) => ({
            ...content,
            platforms: typeof content.platforms === 'string' 
              ? content.platforms.split(',').filter((p: string) => p.trim() !== '')
              : content.platforms || [],
            hashtags: typeof content.hashtags === 'string'
              ? content.hashtags.split(',').filter((h: string) => h.trim() !== '')
              : content.hashtags || []
          }));
          
          setContents(processedContents);
          setFilteredContents(processedContents);
        } else {
          console.error('Erro ao carregar conteúdos:', data.error);
          alert('Erro ao carregar conteúdos: ' + (data.error || 'Erro desconhecido'));
        }
      } catch (error) {
        console.error('Erro ao buscar conteúdos:', error);
        alert('Erro ao buscar conteúdos: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, []);

  useEffect(() => {
    // Aplicar filtros
    let filtered = contents;

    // Filtro de busca
    if (searchTerm) {
      filtered = filtered.filter(content =>
        content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        content.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
        // Hashtags podem ser string ou array, trate ambos os casos
        (typeof content.hashtags === 'string' ?
          content.hashtags.toLowerCase().includes(searchTerm.toLowerCase()) :
          content.hashtags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    // Filtro de categoria
    if (filters.category !== 'ALL') {
      filtered = filtered.filter(content => content.category === filters.category);
    }

    // Filtro de status
    if (filters.status !== 'ALL') {
      filtered = filtered.filter(content => content.status === filters.status);
    }

    // Filtro de plataforma
    if (filters.platform !== 'ALL') {
      filtered = filtered.filter(content => {
        // Verificar se platforms é string ou array
        if (typeof content.platforms === 'string') {
          return content.platforms.split(',').includes(filters.platform as Platform);
        } else if (Array.isArray(content.platforms)) {
          return content.platforms.includes(filters.platform as Platform);
        }
        return false;
      });
    }

    // Filtro de data
    if (filters.dateRange !== 'ALL') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters.dateRange) {
        case 'TODAY':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'WEEK':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'MONTH':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }

      filtered = filtered.filter(content => 
        content.createdAt >= filterDate
      );
    }

    setFilteredContents(filtered);
  }, [searchTerm, filters, contents]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleDeleteContent = async (contentId: string) => {
    if (!confirm('Tem certeza que deseja excluir este conteúdo? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      const response = await fetch(`/api/content/${contentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setContents(prev => prev.filter(content => content.id !== contentId));
        alert('Conteúdo excluído com sucesso!');
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Erro desconhecido');
      }
    } catch (error) {
      console.error('Erro ao excluir conteúdo:', error);
      alert('Erro ao excluir conteúdo: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  const handleDuplicateContent = async (contentId: string) => {
    try {
      const contentToDuplicate = contents.find(content => content.id === contentId);
      if (!contentToDuplicate) return;

      // Preparar dados para duplicação
      const contentData = {
        title: `${contentToDuplicate.title} (Cópia)`,
        body: contentToDuplicate.body,
        type: contentToDuplicate.type,
        category: contentToDuplicate.category,
        status: 'DRAFT',
        platforms: typeof contentToDuplicate.platforms === 'string' 
          ? contentToDuplicate.platforms 
          : contentToDuplicate.platforms.join(','),
        hashtags: typeof contentToDuplicate.hashtags === 'string'
          ? contentToDuplicate.hashtags
          : contentToDuplicate.hashtags?.join(',')
      };

      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contentData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao duplicar conteúdo');
      }

      alert('Conteúdo duplicado com sucesso!');
      
      // Atualizar a lista de conteúdos
      const updatedContents = [result.content, ...contents];
      setContents(updatedContents);
      setFilteredContents(updatedContents);
    } catch (error) {
      console.error('Erro ao duplicar conteúdo:', error);
      alert('Erro ao duplicar conteúdo: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Biblioteca de Conteúdos</h1>
          <p className="mt-2 text-gray-600">
            Gerencie todos os seus conteúdos de marketing para opções binárias
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <ContentSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          
          <ContentFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            contentCount={filteredContents.length}
            totalCount={contents.length}
          />
        </div>

        {/* Content Grid */}
        <ContentGrid
          contents={filteredContents}
          loading={loading}
          onDelete={handleDeleteContent}
          onDuplicate={handleDuplicateContent}
        />
      </div>
    </DashboardLayout>
  );
}