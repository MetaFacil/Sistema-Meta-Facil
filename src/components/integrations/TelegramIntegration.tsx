'use client';

import { useState } from 'react';
import { 
  Send, 
  Plus, 
  Trash2, 
  CheckCircle, 
  AlertTriangle,
  ExternalLink,
  Bot,
  X,
  RefreshCw
} from 'lucide-react';
import { ConnectedAccount } from '@/types';
import { formatRelativeTime } from '@/utils';

interface TelegramIntegrationProps {
  connectedAccounts: ConnectedAccount[];
  onConnect: (botToken: string) => void;
  onDisconnect: (accountId: string) => void;
  onUpdateBot: (accountId: string, botToken: string) => void;
  connecting: boolean;
  loading: boolean;
}

export function TelegramIntegration({
  connectedAccounts,
  onConnect,
  onDisconnect,
  onUpdateBot,
  connecting,
  loading
}: TelegramIntegrationProps) {
  const [showAddBotModal, setShowAddBotModal] = useState(false);
  const [showUpdateBotModal, setShowUpdateBotModal] = useState(false);
  const [selectedBot, setSelectedBot] = useState<ConnectedAccount | null>(null);
  const [botToken, setBotToken] = useState('');
  const [expandedAccount, setExpandedAccount] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  const handleAddBot = async () => {
    if (!botToken.trim()) {
      setError('Por favor, insira o token do bot');
      return;
    }

    try {
      setError('');
      // Chamar a API real para conectar o bot
      const response = await fetch('/api/integrations/telegram/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ botToken: botToken.trim() }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao conectar o bot');
      }

      // Chamar a função de callback para atualizar a UI
      onConnect(botToken.trim());
      setBotToken('');
      setShowAddBotModal(false);
    } catch (error) {
      console.error('Erro ao conectar bot:', error);
      setError(error instanceof Error ? error.message : 'Erro ao conectar o bot');
    }
  };

  const handleUpdateBot = async () => {
    if (!selectedBot) return;
    if (!botToken.trim()) {
      setError('Por favor, insira o token do bot');
      return;
    }

    try {
      setError('');
      setUpdating(true);
      
      // Chamar a função de callback para atualizar o bot
      await onUpdateBot(selectedBot.id, botToken.trim());
      
      // Limpar e fechar o modal
      setBotToken('');
      setSelectedBot(null);
      setShowUpdateBotModal(false);
    } catch (error) {
      console.error('Erro ao atualizar bot:', error);
      setError(error instanceof Error ? error.message : 'Erro ao atualizar o bot');
    } finally {
      setUpdating(false);
    }
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
            <Send size={24} className="text-blue-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Telegram</h2>
            <p className="text-sm text-gray-600">Configure bots para seus canais e grupos do Telegram</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddBotModal(true)}
          disabled={connecting}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {connecting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Conectando...</span>
            </>
          ) : (
            <>
              <Plus size={16} />
              <span>Adicionar Bot</span>
            </>
          )}
        </button>
      </div>

      {connectedAccounts.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <Bot size={32} className="mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum bot do Telegram configurado</h3>
          <p className="text-gray-600 mb-4">
            Configure um bot do Telegram para enviar mensagens automaticamente para seus canais e grupos
          </p>
          <button
            onClick={() => setShowAddBotModal(true)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Configurar Bot
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {connectedAccounts.map((account) => {
            const isExpanded = expandedAccount === account.id;

            return (
              <div key={account.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Send size={20} className="text-blue-500" />
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900">{account.accountName}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>Token: {account.accessToken.substring(0, 10)}...</span>
                        <span>•</span>
                        <span>Configurado {formatRelativeTime(account.createdAt)}</span>
                      </div>
                      {account.defaultChannelId && (
                        <div className="text-sm text-blue-600 font-medium">
                          Canal padrão: {account.defaultChannelName || account.defaultChannelId}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Status Indicator */}
                    {account.isActive ? (
                      <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        <CheckCircle size={12} />
                        <span>Ativo</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                        <AlertTriangle size={12} />
                        <span>Inativo</span>
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
                    {/* Bot Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Informações do Bot</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className={account.isActive ? 'text-green-600' : 'text-red-600'}>
                              {account.isActive ? 'Ativo' : 'Inativo'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Token:</span>
                            <div className="flex items-center">
                              <input 
                                type="text" 
                                value={account.accessToken} 
                                readOnly 
                                className="text-gray-900 font-mono text-xs bg-gray-100 p-1 rounded w-64 mr-2" 
                                onClick={(e) => (e.target as HTMLInputElement).select()}
                              />
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(account.accessToken);
                                  alert('Token copiado para a área de transferência!');
                                }}
                                className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                              >
                                Copiar
                              </button>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Configurado em:</span>
                            <span className="text-gray-900">
                              {new Date(account.createdAt).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-600">ID do Canal:</span>
                            <div className="flex items-center">
                              <input 
                                type="text" 
                                value={account.defaultChannelId || '-1002290954703'} 
                                readOnly 
                                className="text-gray-900 font-mono text-xs bg-gray-100 p-1 rounded w-40 mr-2" 
                                onClick={(e) => (e.target as HTMLInputElement).select()}
                              />
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(account.defaultChannelId || '-1002290954703');
                                  alert('ID do canal copiado para a área de transferência!');
                                }}
                                className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                              >
                                Copiar
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Recursos Disponíveis</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center space-x-2">
                            <CheckCircle size={12} className="text-green-600" />
                            <span className="text-gray-600">Enviar mensagens</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle size={12} className="text-green-600" />
                            <span className="text-gray-600">Enviar imagens/vídeos</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle size={12} className="text-green-600" />
                            <span className="text-gray-600">Formatação de texto</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle size={12} className="text-green-600" />
                            <span className="text-gray-600">Agendamento</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3 pt-2">
                      <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        <Send size={14} />
                        <span>Testar Bot</span>
                      </button>

                      <button 
                        onClick={() => {
                          setSelectedBot(account);
                          setBotToken('');
                          setError('');
                          setShowUpdateBotModal(true);
                        }}
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <RefreshCw size={14} />
                        <span>Atualizar Bot</span>
                      </button>

                      <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <ExternalLink size={14} />
                        <span>Ver no Telegram</span>
                      </button>

                      <button
                        onClick={() => onDisconnect(account.id)}
                        className="flex items-center space-x-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={14} />
                        <span>Remover Bot</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Add Another Bot */}
          <button
            onClick={() => setShowAddBotModal(true)}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
          >
            + Adicionar outro bot
          </button>
        </div>
      )}

      {/* Add Bot Modal */}
      {showAddBotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Adicionar Bot do Telegram</h3>
                <button
                  onClick={() => {
                    setShowAddBotModal(false);
                    setError('');
                    setBotToken('');
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Token do Bot
                  </label>
                  <input
                    type="text"
                    value={botToken}
                    onChange={(e) => setBotToken(e.target.value)}
                    placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-500">
                      Obtenha seu token bot conversando com @BotFather no Telegram
                    </p>
                    <p className="text-xs text-gray-500">
                      1. Envie /newbot para @BotFather
                    </p>
                    <p className="text-xs text-gray-500">
                      2. Siga as instruções para criar um novo bot
                    </p>
                    <p className="text-xs text-gray-500">
                      3. Copie o token fornecido pelo BotFather (ex: 1234567890:ABCdefGHIjklMNOpqrsTUVwxyz)
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle size={16} />
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowAddBotModal(false);
                      setError('');
                      setBotToken('');
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddBot}
                    disabled={!botToken.trim() || connecting}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  >
                    {connecting ? 'Conectando...' : 'Adicionar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Bot Modal */}
      {showUpdateBotModal && selectedBot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Atualizar Bot {selectedBot.accountName}</h3>
                <button
                  onClick={() => {
                    setShowUpdateBotModal(false);
                    setError('');
                    setBotToken('');
                    setSelectedBot(null);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Novo Token do Bot
                  </label>
                  <input
                    type="text"
                    value={botToken}
                    onChange={(e) => setBotToken(e.target.value)}
                    placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-500">
                      ID Atual do Bot: <span className="font-semibold">{selectedBot.accountId}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Token Atual (parcial): <span className="font-mono">{selectedBot.accessToken.substring(0, 10)}...</span>
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle size={16} />
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowUpdateBotModal(false);
                      setError('');
                      setBotToken('');
                      setSelectedBot(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleUpdateBot}
                    disabled={!botToken.trim() || updating}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  >
                    {updating ? 'Atualizando...' : 'Atualizar Bot'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Setup Instructions */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Como configurar um bot:</h4>
        <ol className="text-sm text-blue-800 space-y-1">
          <li>1. Abra o Telegram e procure por @BotFather</li>
          <li>2. Digite /newbot e siga as instruções</li>
          <li>3. Copie o token fornecido pelo BotFather</li>
          <li>4. Cole o token aqui e adicione o bot aos seus canais/grupos</li>
          <li>5. Conceda permissões de administrador ao bot</li>
        </ol>
      </div>
    </div>
  );
}