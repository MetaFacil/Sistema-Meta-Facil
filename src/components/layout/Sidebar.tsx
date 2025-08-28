'use client';

import { 
  BarChart3,
  Calendar,
  FileText,
  Home,
  Image,
  PenTool,
  Settings,
  Target,
  TrendingUp,
  X,
  Bot,
  MessageSquare,
  Zap,
  Clock
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems = [
  {
    title: 'CRIAÇÃO DE CONTEÚDO',
    items: [
      { name: 'Dashboard', href: '/', icon: Home },
      { name: 'Criar Conteúdo', href: '/content/create', icon: PenTool },
      { name: 'Biblioteca', href: '/content/library', icon: Image },
      { name: 'Calendário', href: '/calendar', icon: Calendar },
      { name: 'Análises', href: '/analytics', icon: BarChart3 },
    ]
  },
  {
    title: 'MARKETING ESTRATÉGICO',
    items: [
      { name: 'Blog Manager', href: '/blog', icon: FileText },
      { name: 'Campanhas', href: '/campaigns', icon: Target },
      { name: 'Integração Meta & Telegram', href: '/integrations', icon: Settings },
    ]
  },
  {
    title: 'FERRAMENTAS ADMIN',
    items: [
      { name: 'Publicação Automática', href: '/admin/tools/publish-scheduled', icon: Clock },
    ]
  }
];

const quickActions = [
  { name: 'IA Marketing', href: '/ai-marketing', icon: Bot, color: 'text-purple-600' },
  { name: 'Marketing Manager', href: '/marketing-manager', icon: MessageSquare, color: 'text-blue-600' },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo and close button */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                <TrendingUp size={20} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Meta Fácil</h1>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-md text-gray-600 hover:text-gray-900"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <div className="space-y-8">
              {navigationItems.map((section) => (
                <div key={section.title}>
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    {section.title}
                  </h3>
                  <ul className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      
                      return (
                        <li key={item.name}>
                          <Link
                            href={item.href as any}
                            className={`
                              flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                              ${isActive 
                                ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-700' 
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                              }
                            `}
                            onClick={() => {
                              // Close mobile sidebar when navigating
                              if (window.innerWidth < 1024) {
                                onClose();
                              }
                            }}
                          >
                            <Icon size={18} className="mr-3" />
                            {item.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </nav>

          {/* Quick Actions */}
          <div className="p-4 border-t border-gray-200">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              AÇÕES RÁPIDAS
            </h3>
            <div className="space-y-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                
                return (
                  <Link
                    key={action.name}
                    href={action.href as any}
                    className="flex items-center px-3 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-gray-100 hover:to-gray-200 transition-all duration-200 group"
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        onClose();
                      }
                    }}
                  >
                    <div className={`
                      p-2 rounded-lg bg-white shadow-sm group-hover:shadow-md transition-shadow
                      ${action.color}
                    `}>
                      <Icon size={16} />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{action.name}</p>
                      <p className="text-xs text-gray-500">
                        {action.name === 'IA Marketing' ? 'Gerador de Conteúdo' : 'Assistente Virtual'}
                      </p>
                    </div>
                    <Zap size={14} className="ml-auto text-yellow-500" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}