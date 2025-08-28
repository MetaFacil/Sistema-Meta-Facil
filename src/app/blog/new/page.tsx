'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
  Save,
  Eye,
  ArrowLeft,
  ImageIcon,
  Hash,
  Globe,
  Search,
  BarChart,
  Wand2,
  Upload,
  X,
  Plus
} from 'lucide-react';
import Link from 'next/link';

interface BlogPostData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: 'DRAFT' | 'PUBLISHED';
  seoTitle: string;
  seoDescription: string;
  tags: string[];
  featuredImage?: string;
  publishedAt?: Date;
}

export default function NewBlogPostPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<BlogPostData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    status: 'DRAFT',
    seoTitle: '',
    seoDescription: '',
    tags: []
  });
  
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'preview'>('content');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim(),
      seoTitle: title || prev.seoTitle
    }));
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSave = async (status: 'DRAFT' | 'PUBLISHED' = 'DRAFT') => {
    if (!formData.title.trim()) {
      setError('Título é obrigatório');
      return;
    }

    if (!formData.content.trim()) {
      setError('Conteúdo é obrigatório');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // In real app, this would be an API call
      const postData = {
        ...formData,
        status,
        publishedAt: status === 'PUBLISHED' ? new Date() : undefined
      };

      console.log('Saving post:', postData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      router.push('/blog');
    } catch (err) {
      setError('Erro ao salvar o post. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const generateExcerpt = () => {
    if (formData.content) {
      const excerpt = formData.content
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .substring(0, 160) + '...';
      
      setFormData(prev => ({ ...prev, excerpt }));
    }
  };

  const generateAIContent = async () => {
    if (!formData.title) {
      setError('Informe o título primeiro para gerar conteúdo com IA');
      return;
    }

    setLoading(true);
    try {
      // Mock AI content generation
      const aiContent = `# ${formData.title}

## Introdução

Este é um exemplo de conteúdo gerado por IA baseado no título "${formData.title}". 

## Principais Pontos

1. **Conceitos Fundamentais**: Explicação dos conceitos básicos relacionados ao tema.
2. **Estratégias Práticas**: Aplicação prática dos conhecimentos apresentados.
3. **Dicas Importantes**: Considerações essenciais para o sucesso.

## Conclusão

Resumo dos pontos principais e próximos passos recomendados.

*Este conteúdo foi gerado com auxílio de IA e deve ser revisado e personalizado conforme necessário.*`;

      setFormData(prev => ({ ...prev, content: aiContent }));
    } catch (err) {
      setError('Erro ao gerar conteúdo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/blog"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={20} />
              <span>Voltar ao Blog</span>
            </Link>
            <div className="w-px h-6 bg-gray-300" />
            <h1 className="text-xl font-semibold text-gray-900">Novo Post</h1>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAIAssistant(!showAIAssistant)}
              className="flex items-center space-x-2 px-4 py-2 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50"
            >
              <Wand2 size={16} />
              <span>IA Assistant</span>
            </button>
            
            <button
              onClick={() => handleSave('DRAFT')}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <Save size={16} />
              <span>Salvar Rascunho</span>
            </button>
            
            <button
              onClick={() => handleSave('PUBLISHED')}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              <Globe size={16} />
              <span>Publicar</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {/* Tabs */}
              <div className="border-b border-gray-200 px-6">
                <nav className="flex space-x-8">
                  {[
                    { id: 'content', label: 'Conteúdo', icon: ImageIcon },
                    { id: 'seo', label: 'SEO', icon: Search },
                    { id: 'preview', label: 'Preview', icon: Eye }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab.id
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon size={16} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'content' && (
                  <div className="space-y-6">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="Digite o título do seu post..."
                        className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    {/* Slug */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL (Slug)
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                          metafacil.com/blog/
                        </span>
                        <input
                          type="text"
                          value={formData.slug}
                          onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>

                    {/* AI Content Generation */}
                    {formData.title && !formData.content && (
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <Wand2 className="w-5 h-5 text-purple-600 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-purple-900">
                              Gerar Conteúdo com IA
                            </h4>
                            <p className="text-sm text-purple-700 mt-1">
                              Quer que a IA crie um rascunho inicial baseado no título?
                            </p>
                            <button
                              onClick={generateAIContent}
                              disabled={loading}
                              className="mt-2 px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 disabled:opacity-50"
                            >
                              {loading ? 'Gerando...' : 'Gerar Conteúdo'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Content Editor */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Conteúdo *
                      </label>
                      <textarea
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Escreva o conteúdo do seu post aqui... Você pode usar Markdown!"
                        rows={20}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none font-mono text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Suporte a Markdown. Caracteres: {formData.content.length}
                      </p>
                    </div>

                    {/* Excerpt */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Resumo/Excerpt
                        </label>
                        <button
                          onClick={generateExcerpt}
                          className="text-sm text-primary-600 hover:text-primary-700"
                        >
                          Gerar automaticamente
                        </button>
                      </div>
                      <textarea
                        value={formData.excerpt}
                        onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                        placeholder="Breve descrição do post que aparecerá na listagem..."
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Recomendado: 120-160 caracteres. Atual: {formData.excerpt.length}
                      </p>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags
                      </label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                          >
                            <Hash size={12} className="mr-1" />
                            {tag}
                            <button
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-2 text-primary-600 hover:text-primary-800"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex">
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Digite uma tag e pressione Enter"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <button
                          onClick={handleAddTag}
                          className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'seo' && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <BarChart className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-blue-900">
                            Otimização SEO
                          </h4>
                          <p className="text-sm text-blue-700 mt-1">
                            Configure títulos e descrições para melhorar o ranking nos buscadores.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título SEO
                      </label>
                      <input
                        type="text"
                        value={formData.seoTitle}
                        onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                        placeholder="Título otimizado para SEO (máx. 60 caracteres)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Caracteres: {formData.seoTitle.length}/60
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Descrição
                      </label>
                      <textarea
                        value={formData.seoDescription}
                        onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                        placeholder="Descrição que aparecerá nos resultados de busca (máx. 160 caracteres)"
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Caracteres: {formData.seoDescription.length}/160
                      </p>
                    </div>

                    {/* SEO Preview */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Preview do Google</h4>
                      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                          {formData.seoTitle || formData.title || 'Título do Post'}
                        </div>
                        <div className="text-green-700 text-sm mt-1">
                          metafacil.com/blog/{formData.slug || 'post-slug'}
                        </div>
                        <div className="text-gray-600 text-sm mt-2">
                          {formData.seoDescription || formData.excerpt || 'Descrição do post aparecerá aqui...'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'preview' && (
                  <div className="space-y-6">
                    <div className="prose max-w-none">
                      <h1>{formData.title || 'Título do Post'}</h1>
                      
                      {formData.excerpt && (
                        <div className="bg-gray-50 border-l-4 border-primary-500 p-4 my-4">
                          <p className="text-gray-700 italic">{formData.excerpt}</p>
                        </div>
                      )}

                      {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {formData.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2 py-1 bg-gray-200 text-gray-700 text-sm rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="whitespace-pre-wrap">
                        {formData.content || 'O conteúdo aparecerá aqui...'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status de Publicação</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="status"
                      value="DRAFT"
                      checked={formData.status === 'DRAFT'}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Rascunho</span>
                  </label>
                  <p className="text-xs text-gray-500 ml-6">Salvar como rascunho para editar depois</p>
                </div>
                
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="status"
                      value="PUBLISHED"
                      checked={formData.status === 'PUBLISHED'}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Publicado</span>
                  </label>
                  <p className="text-xs text-gray-500 ml-6">Tornar visível publicamente</p>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Imagem Destacada</h3>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Clique para fazer upload ou arraste uma imagem</p>
                <p className="text-xs text-gray-500">PNG, JPG até 2MB</p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    // Handle file upload
                    console.log('File selected:', e.target.files?.[0]);
                  }}
                />
                <button className="mt-3 px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200">
                  Selecionar Arquivo
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Palavras:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formData.content.split(/\s+/).filter(w => w.length > 0).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Caracteres:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formData.content.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tempo de leitura:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {Math.ceil(formData.content.split(/\s+/).length / 200)} min
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tags:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formData.tags.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}