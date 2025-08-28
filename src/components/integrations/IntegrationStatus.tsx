'use client';

import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Facebook,
  Instagram,
  Send
} from 'lucide-react';
import { ConnectedAccount } from '@/types';

interface IntegrationStatusProps {
  connectedAccounts: ConnectedAccount[];
  loading: boolean;
}

export function IntegrationStatus({ connectedAccounts, loading }: IntegrationStatusProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const metaAccounts = connectedAccounts.filter(acc => acc.provider === 'META');
  const telegramAccounts = connectedAccounts.filter(acc => acc.provider === 'TELEGRAM');

  const getStatusCard = (title: string, icon: React.ReactNode, accounts: ConnectedAccount[], provider: string) => {
    const activeAccounts = accounts.filter(acc => acc.isActive);
    const hasActive = activeAccounts.length > 0;
    
    return (
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className={`p-2 rounded-lg ${hasActive ? 'bg-green-100' : 'bg-gray-100'}`}>
            {icon}
          </div>
          <h3 className="font-medium text-gray-900">{title}</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          {hasActive ? (
            <>
              <CheckCircle size={16} className="text-green-500" />
              <span className="text-sm text-green-700">
                {activeAccounts.length} conta{activeAccounts.length > 1 ? 's' : ''} ativa{activeAccounts.length > 1 ? 's' : ''}
              </span>
            </>
          ) : (
            <>
              <XCircle size={16} className="text-gray-400" />
              <span className="text-sm text-gray-500">Não conectado</span>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Status das Integrações</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {getStatusCard(
          'Meta (Facebook/Instagram)', 
          <Facebook size={20} className="text-blue-500" />, 
          metaAccounts, 
          'META'
        )}
        
        {getStatusCard(
          'Telegram', 
          <Send size={20} className="text-blue-500" />, 
          telegramAccounts, 
          'TELEGRAM'
        )}
        
        {getStatusCard(
          'Instagram', 
          <Instagram size={20} className="text-pink-500" />, 
          metaAccounts.filter(acc => acc.accountName?.includes('Instagram')), 
          'INSTAGRAM'
        )}
      </div>
      
      {connectedAccounts.length === 0 && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle size={16} className="text-yellow-500" />
            <span className="text-sm text-yellow-700">
              Nenhuma conta conectada. Conecte suas contas para começar a publicar.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}