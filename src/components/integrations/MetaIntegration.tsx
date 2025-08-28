'use client';

import { useState } from 'react';
import { 
  Facebook, 
  Instagram, 
  Plus, 
  RefreshCw, 
  Trash2, 
  CheckCircle, 
  AlertTriangle,
  ExternalLink,
  Calendar
} from 'lucide-react';
import { ConnectedAccount } from '@/types';
import { formatRelativeTime } from '@/utils';

interface MetaIntegrationProps {
  connectedAccounts: ConnectedAccount[];
  onConnect: () => void;
  onDisconnect: (accountId: string) => void;
  onRefreshToken: (accountId: string) => void;
  connecting: boolean;
  loading: boolean;
}

export function MetaIntegration({
  connectedAccounts,
  onConnect,
  onDisconnect,
  onRefreshToken,
  connecting,
  loading
}: MetaIntegrationProps) {
  const [expandedAccount, setExpandedAccount] = useState<string | null>(null);

  const isTokenExpiring = (expiresAt?: Date | null) => {
    if (!expiresAt) return false;
    const daysUntilExpiry = Math.ceil((new Date(expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7;
  };

  const isTokenExpired = (expiresAt?: Date | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gray-200 rounded mr-3"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          </div>
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg mr-4">
            <Facebook size={24} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Meta (Facebook & Instagram)</h2>
            <p className="text-sm text-gray-600">Conecte suas páginas do Facebook e contas do Instagram</p>
          </div>
        </div>

        <button
          onClick={onConnect}
          disabled={connecting}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {connecting ? (
            <RefreshCw size={16} className="animate-spin" />
          ) : (
            <Plus size={16} />
          )}
          <span>{connecting ? 'Conectando...' : 'Conectar Conta'}</span>
        </button>
      </div>

      {connectedAccounts.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <Facebook size={32} className="mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma conta Meta conectada</h3>
          <p className="text-gray-600 mb-4">
            Conecte sua página do Facebook e conta do Instagram para começar a publicar automaticamente
          </p>
          <button
            onClick={onConnect}
            disabled={connecting}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            Conectar Facebook
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {connectedAccounts.map((account) => {
            const expired = isTokenExpired(account.expiresAt);
            const expiring = isTokenExpiring(account.expiresAt);
            const isExpanded = expandedAccount === account.id;

            return (
              <div key={account.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="p-1 bg-blue-100 rounded">
                        <Facebook size={16} className="text-blue-600" />
                      </div>
                      <div className="p-1 bg-pink-100 rounded">
                        <Instagram size={16} className="text-pink-600" />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900">{account.accountName}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>ID: {account.accountId}</span>
                        <span>•</span>
                        <span>Conectado {formatRelativeTime(account.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Status Indicator */}
                    {expired ? (
                      <div className="flex items-center space-x-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                        <AlertTriangle size={12} />
                        <span>Expirado</span>
                      </div>
                    ) : expiring ? (
                      <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                        <AlertTriangle size={12} />
                        <span>Expira em breve</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        <CheckCircle size={12} />
                        <span>Ativo</span>
                      </div>
                    )}

                    {/* Actions */}
                    <button
                      onClick={() => setExpandedAccount(isExpanded ? null : account.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                    {/* Token Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Informações do Token</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className={expired ? 'text-red-600' : expiring ? 'text-yellow-600' : 'text-green-600'}>
                              {expired ? 'Expirado' : expiring ? 'Expirando' : 'Válido'}
                            </span>
                          </div>
                          {account.expiresAt && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Expira em:</span>
                              <span className="text-gray-900">
                                {new Date(account.expiresAt).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-600">Última atualização:</span>
                            <span className="text-gray-900">
                              {formatRelativeTime(account.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Permissões</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center space-x-2">
                            <CheckCircle size={12} className="text-green-600" />
                            <span className="text-gray-600">Publicar posts</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle size={12} className="text-green-600" />
                            <span className="text-gray-600">Ler engajamento</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle size={12} className="text-green-600" />
                            <span className="text-gray-600">Gerenciar páginas</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3 pt-2">
                      <button
                        onClick={() => onRefreshToken(account.id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <RefreshCw size={14} />
                        <span>Renovar Token</span>
                      </button>

                      <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <ExternalLink size={14} />
                        <span>Testar Conexão</span>
                      </button>

                      <button
                        onClick={() => onDisconnect(account.id)}
                        className="flex items-center space-x-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={14} />
                        <span>Desconectar</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Add Another Account */}
          <button
            onClick={onConnect}
            disabled={connecting}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors disabled:opacity-50"
          >
            + Adicionar outra conta Meta
          </button>
        </div>
      )}

      {/* Setup Instructions */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Como configurar:</h4>
        <ol className="text-sm text-blue-800 space-y-1">
          <li>1. Clique em "Conectar Facebook" e faça login na sua conta</li>
          <li>2. Selecione as páginas que deseja conectar</li>
          <li>3. Conceda as permissões necessárias</li>
          <li>4. Configure sua conta do Instagram Business (opcional)</li>
        </ol>
      </div>
    </div>
  );
}