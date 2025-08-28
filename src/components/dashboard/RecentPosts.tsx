'use client';

import { 
  Calendar, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share, 
  MoreHorizontal,
  Instagram,
  Facebook,
  Send
} from 'lucide-react';
import { useState } from 'react';

interface Post {
  id: string;
  title: string;
  category: string;
  status: 'published' | 'scheduled' | 'draft';
  publishedAt: string;
  platforms: ('instagram' | 'facebook' | 'telegram')[];
  metrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
}

const recentPosts: Post[] = [];

function StatusBadge({ status }: { status: Post['status'] }) {
  const configs = {
    published: { color: 'bg-green-100 text-green-800', label: 'Publicado' },
    scheduled: { color: 'bg-blue-100 text-blue-800', label: 'Agendado' },
    draft: { color: 'bg-gray-100 text-gray-800', label: 'Rascunho' }
  };

  const config = configs[status];

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const colors = {
    'Análise': 'bg-purple-100 text-purple-800',
    'Educativo': 'bg-blue-100 text-blue-800',
    'Sinal': 'bg-yellow-100 text-yellow-800',
    'Promocional': 'bg-red-100 text-red-800'
  };

  const color = colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}>
      {category}
    </span>
  );
}

function PlatformIcons({ platforms }: { platforms: Post['platforms'] }) {
  const iconMap = {
    instagram: { icon: Instagram, color: 'text-pink-600' },
    facebook: { icon: Facebook, color: 'text-blue-600' },
    telegram: { icon: Send, color: 'text-blue-500' }
  };

  return (
    <div className="flex items-center space-x-1">
      {platforms.map((platform) => {
        const { icon: Icon, color } = iconMap[platform];
        return (
          <div key={platform} className={`p-1 rounded ${color}`}>
            <Icon size={14} />
          </div>
        );
      })}
    </div>
  );
}

export function RecentPosts() {
  const [showAll, setShowAll] = useState(false);
  const displayedPosts = showAll ? recentPosts : recentPosts.slice(0, 3);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Posts Recentes</h2>
          <button 
            onClick={() => setShowAll(!showAll)}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            {showAll ? 'Ver menos' : 'Ver todos'}
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {displayedPosts.map((post) => (
          <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {post.title}
                  </h3>
                  <CategoryBadge category={post.category} />
                  <StatusBadge status={post.status} />
                </div>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                  <div className="flex items-center space-x-1">
                    <Calendar size={12} />
                    <span>
                      {new Date(post.publishedAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <PlatformIcons platforms={post.platforms} />
                </div>

                {post.status === 'published' && (
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Eye size={12} />
                      <span>{post.metrics.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart size={12} />
                      <span>{post.metrics.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle size={12} />
                      <span>{post.metrics.comments}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Share size={12} />
                      <span>{post.metrics.shares}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="ml-4">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {recentPosts.length === 0 && (
        <div className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Calendar size={48} className="mx-auto" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Nenhum post ainda</h3>
          <p className="text-sm text-gray-600 mb-4">
            Comece criando seu primeiro conteúdo para opções binárias
          </p>
          <button className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
            Criar Primeiro Post
          </button>
        </div>
      )}
    </div>
  );
}