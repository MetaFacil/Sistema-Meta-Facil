'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { IntegrationsHeader } from '@/components/integrations/IntegrationsHeader';
import { MetaIntegration } from '@/components/integrations/MetaIntegration';
import { TelegramIntegration } from '@/components/integrations/TelegramIntegration';
import { IntegrationStatus } from '@/components/integrations/IntegrationStatus';
import { ConnectedAccount } from '@/types';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export default function IntegrationsPage() {
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<'meta' | 'telegram' | null>(null);

  useEffect(() => {
    fetchConnectedAccounts();
  }, []);

  const fetchConnectedAccounts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/integrations/accounts');
      const result = await response.json();
      
      if (response.ok) {
        setConnectedAccounts(result.accounts);
      } else {
        console.error('Erro ao buscar contas conectadas:', result.error);
      }
    } catch (error) {
      console.error('Erro ao buscar contas conectadas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectMeta = async () => {
    setConnecting('meta');
    try {
      // Redirecionar para OAuth do Facebook
      const redirectUri = `${window.location.origin}/auth/meta/callback`;
      const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${process.env.NEXT_PUBLIC_META_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=pages_manage_posts,pages_read_engagement,pages_show_list,instagram_basic,instagram_content_publish&response_type=code&state=${Math.random().toString(36)}`;
      
      window.location.href = authUrl;
    } catch (error) {
      console.error('Erro ao conectar Meta:', error);
      setConnecting(null);
    }
  };

  const handleConnectTelegram = async (botToken: string) => {
    setConnecting('telegram');
    try {
      // Chamar a API para conectar o bot
      const response = await fetch('/api/integrations/telegram/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ botToken }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao conectar o bot');
      }

      // Atualizar a lista de contas após a conexão
      await fetchConnectedAccounts();
    } catch (error) {
      console.error('Erro ao conectar Telegram:', error);
      alert(`Erro ao conectar bot: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = async (accountId: string) => {
    try {
      const response = await fetch(`/api/integrations/accounts/${accountId}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (response.ok) {
        // Atualizar a lista de contas após a desconexão
        await fetchConnectedAccounts();
      } else {
        console.error('Erro ao desconectar conta:', result.error);
      }
    } catch (error) {
      console.error('Erro ao desconectar conta:', error);
    }
  };

  const handleUpdateBot = async (accountId: string, botToken: string) => {
    try {
      const response = await fetch(`/api/integrations/telegram/bot/${accountId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ botToken }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        // Atualizar a lista de contas após a atualização
        await fetchConnectedAccounts();
        alert('Bot atualizado com sucesso!');
      } else {
        console.error('Erro ao atualizar bot:', result.error);
        alert(`Erro ao atualizar bot: ${result.error}`);
      }
    } catch (error) {
      console.error('Erro ao atualizar bot:', error);
      alert(`Erro ao atualizar bot: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  const handleRefreshToken = async (accountId: string) => {
    try {
      // Implementar renovação de token se necessário
      await fetchConnectedAccounts();
    } catch (error) {
      console.error('Erro ao renovar token:', error);
    }
  };

  const metaAccounts = connectedAccounts.filter(account => account.provider === 'META');
  const telegramAccounts = connectedAccounts.filter(account => account.provider === 'TELEGRAM');

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <IntegrationsHeader
          connectedCount={connectedAccounts.length}
          onRefreshAll={fetchConnectedAccounts}
        />

        {/* Integration Status Overview */}
        <IntegrationStatus
          connectedAccounts={connectedAccounts}
          loading={loading}
        />

        {/* Meta Integration */}
        <MetaIntegration
          connectedAccounts={metaAccounts}
          onConnect={handleConnectMeta}
          onDisconnect={handleDisconnect}
          onRefreshToken={handleRefreshToken}
          connecting={connecting === 'meta'}
          loading={loading}
        />

        {/* Telegram Integration */}
        <TelegramIntegration
          connectedAccounts={telegramAccounts}
          onConnect={handleConnectTelegram}
          onDisconnect={handleDisconnect}
          onUpdateBot={handleUpdateBot}
          connecting={connecting === 'telegram'}
          loading={loading}
        />

        {/* Integration Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">💡 Dicas de Integração</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Meta (Facebook/Instagram)</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Certifique-se de ter uma página do Facebook</li>
                <li>• Conecte sua conta Instagram à página</li>
                <li>• Tokens expiram em 60 dias - renove regularmente</li>
                <li>• Verifique as permissões de publicação</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Telegram</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Crie um bot via @BotFather</li>
                <li>• Adicione o bot aos seus canais/grupos</li>
                <li>• Conceda permissões de administrador</li>
                <li>• Tokens não expiram, mas mantenha-os seguros</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}