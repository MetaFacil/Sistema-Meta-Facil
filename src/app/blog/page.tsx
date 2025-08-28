'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  Plus, 
  Search, 
  Filter,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  Tag,
  FileText,
  BarChart,
  Settings,
  Globe,
  Clock
} from 'lucide-react';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: 'DRAFT' | 'PUBLISHED';
  seoTitle?: string;
  seoDescription?: string;
  tags: string[];
  featuredImage?: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  views?: number;
  shares?: number;
}

export default function BlogPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'DRAFT' | 'PUBLISHED'>('ALL');
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockPosts: BlogPost[] = [
      {
        id: '1',
        title: 'Guia Completo de Opções Binárias para Iniciantes',
        slug: 'guia-completo-opcoes-binarias-iniciantes',
        excerpt: 'Aprenda os fundamentos das opções binárias de forma simples e prática. Este guia aborda desde conceitos básicos até estratégias avançadas.',
        content: 'Conteúdo completo do post...',
        status: 'PUBLISHED',
        seoTitle: 'Opções Binárias para Iniciantes - Guia Completo 2024',
        seoDescription: 'Descubra como começar no mundo das opções binárias com nosso guia completo para iniciantes. Estratégias, dicas e muito mais.',
        tags: ['opções binárias', 'iniciantes', 'trading', 'educação'],
        featuredImage: '/images/blog/opcoes-binarias-guia.jpg',
        publishedAt: new Date('2024-01-15'),
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-15'),
        views: 1250,
        shares: 45
      },
      {
        id: '2',
        title: 'As 5 Melhores Estratégias de Trading para 2024',
        slug: 'melhores-estrategias-trading-2024',
        excerpt: 'Descubra as estratégias de trading mais eficazes para maximizar seus lucros no mercado atual.',
        content: 'Conteúdo completo do post...',
        status: 'DRAFT',
        tags: ['estratégias', 'trading', '2024', 'lucro'],
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-22'),
        views: 0,
        shares: 0
      },
      {
        id: '3',
        title: 'Análise Técnica: Dominando os Padrões Gráficos',
        slug: 'analise-tecnica-padroes-graficos',
        excerpt: 'Aprenda a identificar e interpretar os principais padrões gráficos utilizados na análise técnica.',
        content: 'Conteúdo completo do post...',
        status: 'PUBLISHED',
        seoTitle: 'Padrões Gráficos na Análise Técnica - Guia Prático',
        seoDescription: 'Domine os padrões gráficos mais importantes para sua análise técnica. Guia prático com exemplos reais.',
        tags: ['análise técnica', 'padrões gráficos', 'trading'],
        featuredImage: '/images/blog/padroes-graficos.jpg',
        publishedAt: new Date('2024-01-18'),
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-18'),
        views: 890,
        shares: 32
      }
    ];

    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterStatus === 'ALL' || post.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleSelectPost = (postId: string) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(filteredPosts.map(post => post.id));
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Tem certeza que deseja excluir ${selectedPosts.length} post(s)?`)) {
      setPosts(prev => prev.filter(post => !selectedPosts.includes(post.id)));
      setSelectedPosts([]);
    }
  };

  const getStatusBadge = (status: BlogPost['status']) => {
    const styles = {
      DRAFT: 'bg-yellow-100 text-yellow-800',
      PUBLISHED: 'bg-green-100 text-green-800'
    };

    const labels = {
      DRAFT: 'Rascunho',
      PUBLISHED: 'Publicado'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Manager</h1>
          <p className="text-gray-600 mt-2">Gerencie seus artigos e conteúdo educacional</p>
        </div>
        
        <div className="flex space-x-3">
          <Link
            href={"/blog/analytics" as any}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <BarChart size={16} />
            <span>Analytics</span>
          </Link>
          
          <Link
            href={"/blog/settings" as any}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <Settings size={16} />
            <span>Configurações</span>
          </Link>
          
          <Link
            href="/blog/new"
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus size={16} />
            <span>Novo Post</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Posts</p>
              <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Publicados</p>
              <p className="text-2xl font-bold text-gray-900">
                {posts.filter(p => p.status === 'PUBLISHED').length}
              </p>
            </div>
            <Globe className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rascunhos</p>
              <p className="text-2xl font-bold text-gray-900">
                {posts.filter(p => p.status === 'DRAFT').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Visualizações</p>
              <p className="text-2xl font-bold text-gray-900">
                {posts.reduce((acc, post) => acc + (post.views || 0), 0)}
              </p>
            </div>
            <Eye className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar posts por título, conteúdo ou tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="ALL">Todos os Status</option>
              <option value="PUBLISHED">Publicados</option>
              <option value="DRAFT">Rascunhos</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedPosts.length > 0 && (
          <div className="mt-4 flex items-center justify-between bg-blue-50 p-3 rounded-lg">
            <span className="text-sm text-blue-800">
              {selectedPosts.length} post(s) selecionado(s)
            </span>
            <button
              onClick={handleBulkDelete}
              className="flex items-center space-x-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            >
              <Trash2 size={14} />
              <span>Excluir Selecionados</span>
            </button>
          </div>
        )}
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum post encontrado</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Tente ajustar sua busca.' : 'Comece criando seu primeiro post.'}
            </p>
            <Link
              href="/blog/new"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <Plus size={16} />
              <span>Criar Primeiro Post</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-8 p-4">
                    <input
                      type="checkbox"
                      checked={selectedPosts.length === filteredPosts.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900">Título</th>
                  <th className="text-left p-4 font-medium text-gray-900">Status</th>
                  <th className="text-left p-4 font-medium text-gray-900">Data</th>
                  <th className="text-left p-4 font-medium text-gray-900">Visualizações</th>
                  <th className="text-left p-4 font-medium text-gray-900">Tags</th>
                  <th className="text-right p-4 font-medium text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedPosts.includes(post.id)}
                        onChange={() => handleSelectPost(post.id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="p-4">
                      <div>
                        <h4 className="font-medium text-gray-900 hover:text-primary-600">
                          <Link href={`/blog/${post.slug}` as any}>{post.title}</Link>
                        </h4>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{post.excerpt}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(post.status)}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>
                          {post.status === 'PUBLISHED' && post.publishedAt
                            ? post.publishedAt.toLocaleDateString('pt-BR')
                            : post.updatedAt.toLocaleDateString('pt-BR')
                          }
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Eye size={14} />
                        <span>{post.views || 0}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            +{post.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/blog/${post.slug}` as any}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                          title="Visualizar"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          href={`/blog/edit/${post.id}` as any}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button
                          onClick={() => {
                            if (window.confirm('Tem certeza que deseja excluir este post?')) {
                              setPosts(prev => prev.filter(p => p.id !== post.id));
                            }
                          }}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}