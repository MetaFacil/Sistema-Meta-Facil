'use client';

import { 
  PenTool, 
  Calendar, 
  Image, 
  BarChart3, 
  Bot, 
  MessageSquare,
  ArrowRight 
} from 'lucide-react';
import Link from 'next/link';

const quickActionItems = [
  {
    title: 'Post com IA',
    description: 'Criar conteúdo usando inteligência artificial',
    icon: Bot,
    href: '/ai-marketing',
    color: 'bg-purple-500',
    hoverColor: 'hover:bg-purple-600'
  },
  {
    title: 'Agendar Posts',
    description: 'Programar publicações no calendário',
    icon: Calendar,
    href: '/calendar',
    color: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600'
  },
  {
    title: 'Biblioteca',
    description: 'Acessar conteúdos salvos',
    icon: Image,
    href: '/content/library',
    color: 'bg-green-500',
    hoverColor: 'hover:bg-green-600'
  },
  {
    title: 'Relatórios',
    description: 'Ver análises detalhadas de performance',
    icon: BarChart3,
    href: '/analytics',
    color: 'bg-orange-500',
    hoverColor: 'hover:bg-orange-600'
  }
];

export function QuickActions() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Ações Rápidas</h2>
        <p className="text-sm text-gray-600">Acesse as funções mais utilizadas</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActionItems.map((action) => {
          const Icon = action.icon;
          
          return (
            <Link
              key={action.title}
              href={action.href as any}
              className="group relative p-4 rounded-lg border border-gray-200 hover:border-transparent hover:shadow-md transition-all duration-200"
            >
              <div className={`
                absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200
                bg-gradient-to-br ${action.color} ${action.hoverColor}
              `} />
              
              <div className="relative z-10">
                <div className={`
                  inline-flex p-3 rounded-lg transition-colors duration-200
                  ${action.color} group-hover:bg-white group-hover:bg-opacity-20
                `}>
                  <Icon size={24} className="text-white" />
                </div>
                
                <h3 className="mt-3 text-sm font-medium text-gray-900 group-hover:text-white transition-colors duration-200">
                  {action.title}
                </h3>
                
                <p className="mt-1 text-xs text-gray-600 group-hover:text-white group-hover:text-opacity-90 transition-colors duration-200">
                  {action.description}
                </p>
                
                <div className="mt-3 flex items-center text-xs font-medium text-gray-500 group-hover:text-white transition-colors duration-200">
                  <span>Acessar</span>
                  <ArrowRight size={12} className="ml-1 transform group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      
      {/* Additional AI Assistant Banner */}
      <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg border border-primary-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-600 rounded-lg">
              <MessageSquare size={20} className="text-white" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-primary-900">Marketing Manager IA</h4>
              <p className="text-xs text-primary-700">Seu assistente especializado em opções binárias</p>
            </div>
          </div>
          <Link 
            href={'/marketing-manager' as any}
            className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            Conversar
          </Link>
        </div>
      </div>
    </div>
  );
}