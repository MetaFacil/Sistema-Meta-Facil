'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ArrowLeft, Clock, Check, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PublishScheduledContentsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runPublisher = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/content/publish-scheduled');
      const data = await response.json();
      
      setResults(data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao executar publicação automática');
      }
    } catch (error) {
      console.error('Erro:', error);
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  // Executar automaticamente quando a página carregar
  useEffect(() => {
    runPublisher();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/content/library')}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2"
          >
            <ArrowLeft size={16} className="mr-1" />
            Voltar para Biblioteca
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Publicação Automática</h1>
          <p className="mt-2 text-gray-600">
            Verifica e publica conteúdos que foram agendados para datas passadas
          </p>
        </div>

        {/* Conteúdo */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mb-4"></div>
              <p className="text-gray-600">Verificando conteúdos agendados...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
              <div className="flex items-start">
                <AlertTriangle size={20} className="text-red-600 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-red-800 font-medium mb-1">Erro ao executar publicação automática</h3>
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {results?.success ? (
                <div className="space-y-6">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start">
                      <Check size={20} className="text-green-600 mr-3 mt-0.5" />
                      <div>
                        <h3 className="text-green-800 font-medium mb-1">Verificação concluída</h3>
                        <p className="text-green-600">
                          {results.published > 0 
                            ? `${results.published} conteúdos foram publicados automaticamente`
                            : 'Nenhum conteúdo pendente de publicação neste momento'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {results.published > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-4">Conteúdos publicados:</h3>
                      <div className="space-y-3">
                        {results.results.map((result: any, index: number) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-2">{result.title || `Conteúdo #${result.contentId}`}</h4>
                            
                            {result.platformResults ? (
                              <div className="space-y-2">
                                {result.platformResults.map((pr: any, i: number) => (
                                  <div key={i} className="flex items-center">
                                    <span className="inline-flex items-center mr-2 px-2 py-1 rounded-full text-xs font-medium bg-gray-100">
                                      {pr.platform}
                                    </span>
                                    <span className="text-sm text-gray-600">{pr.message}</span>
                                  </div>
                                ))}
                              </div>
                            ) : result.error ? (
                              <p className="text-red-600">Erro: {result.error}</p>
                            ) : (
                              <p className="text-gray-600">Publicado com sucesso</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                      <Clock size={14} className="inline mr-1" />
                      Executado em: {new Date().toLocaleString('pt-BR')}
                    </p>
                    <button
                      onClick={runPublisher}
                      disabled={isLoading}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Verificando...' : 'Verificar Novamente'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle size={20} className="text-yellow-600 mr-3 mt-0.5" />
                    <div>
                      <h3 className="text-yellow-800 font-medium mb-1">Resposta inválida</h3>
                      <p className="text-yellow-600">
                        A API de publicação automática retornou uma resposta inválida
                      </p>
                      <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                        {JSON.stringify(results, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}