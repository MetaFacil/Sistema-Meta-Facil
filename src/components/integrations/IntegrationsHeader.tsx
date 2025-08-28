'use client';

import { RefreshCw, Settings, Shield, AlertCircle } from 'lucide-react';

interface IntegrationsHeaderProps {
  connectedCount: number;
  onRefreshAll: () => void;
}

export function IntegrationsHeader({ connectedCount, onRefreshAll }: IntegrationsHeaderProps) {
  return (
    <div>
      {/* Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Settings size={28} className="mr-3 text-primary-600" />
            Integração Meta & Telegram
          </h1>
          <p className="mt-2 text-gray-600">
            Conecte suas contas das redes sociais para automatizar suas publicações de opções binárias
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
            <Shield size={16} />
            <span className="text-sm font-medium">{connectedCount} conta(s) conectada(s)</span>
          </div>
          
          <button
            onClick={onRefreshAll}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={16} />
            <span>Atualizar</span>
          </button>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <AlertCircle size={20} className="text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800 mb-1">
              Importante: Segurança das Integrações
            </h3>
            <p className="text-sm text-yellow-700">
              Suas credenciais são criptografadas e armazenadas com segurança. Nunca compartilhe seus tokens de acesso. 
              Recomendamos revisar e renovar suas conexões periodicamente para manter a segurança da conta.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}