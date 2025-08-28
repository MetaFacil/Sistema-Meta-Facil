'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Activity, RefreshCw } from 'lucide-react';

interface MarketAnalysisPanelProps {
  selectedPair: string;
  selectedTimeframe: string;
  onAnalyze: (pair: string, timeframe: string) => Promise<{ success: boolean; analysis?: string; error?: string }>;
  loading: boolean;
}

interface TechnicalIndicator {
  name: string;
  value: number;
  status: 'bullish' | 'bearish' | 'neutral';
  description: string;
}

export function MarketAnalysisPanel({
  selectedPair,
  selectedTimeframe,
  onAnalyze,
  loading
}: MarketAnalysisPanelProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Indicadores técnicos reais serão obtidos da API
  // Lista vazia para remover dados fictícios
  const technicalIndicators: TechnicalIndicator[] = [];

  const handleAnalyze = async () => {
    const result = await onAnalyze(selectedPair, selectedTimeframe);
    if (result.success && result.analysis) {
      setAnalysis(result.analysis);
      setLastUpdate(new Date());
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'bullish':
        return 'text-green-600 bg-green-100';
      case 'bearish':
        return 'text-red-600 bg-red-100';
      case 'neutral':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'bullish':
        return <TrendingUp size={14} />;
      case 'bearish':
        return <TrendingDown size={14} />;
      case 'neutral':
        return <Activity size={14} />;
      default:
        return <Activity size={14} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Analysis Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 size={24} className="text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Análise de Mercado</h2>
              <p className="text-gray-600">{selectedPair} - {selectedTimeframe}</p>
            </div>
          </div>
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center space-x-2"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Analisar</span>
          </button>
        </div>

        {lastUpdate && (
          <div className="text-sm text-gray-500 mb-4">
            Última análise: {lastUpdate.toLocaleString('pt-BR')}
          </div>
        )}
      </div>

      {/* Technical Indicators */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Indicadores Técnicos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {technicalIndicators.map((indicator) => (
            <div key={indicator.name} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{indicator.name}</span>
                <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(indicator.status)}`}>
                  {getStatusIcon(indicator.status)}
                  <span className="capitalize">{indicator.status}</span>
                </div>
              </div>
              <div className="text-lg font-bold text-gray-900 mb-1">
                {indicator.value.toFixed(4)}
              </div>
              <div className="text-sm text-gray-600">
                {indicator.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Analysis Result */}
      {analysis && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Análise IA</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans">
              {analysis}
            </pre>
          </div>
        </div>
      )}

      {/* Market Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Mercado</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">75%</div>
            <div className="text-sm text-green-600">Sinais de Alta</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">15%</div>
            <div className="text-sm text-red-600">Sinais de Baixa</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">10%</div>
            <div className="text-sm text-yellow-600">Sinais Neutros</div>
          </div>
        </div>
      </div>

      {/* Trading Suggestions */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Sugestões de Trading</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <ul className="space-y-2">
            <li className="flex items-start space-x-2">
              <span className="text-blue-600">•</span>
              <span>Aguardar confirmação de rompimento da resistência em 1.0950</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600">•</span>
              <span>Stop loss sugerido: 1.0820</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600">•</span>
              <span>Take profit: 1.0980</span>
            </li>
          </ul>
          <ul className="space-y-2">
            <li className="flex items-start space-x-2">
              <span className="text-blue-600">•</span>
              <span>Atenção ao suporte em 1.0850</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600">•</span>
              <span>Volume está aumentando</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600">•</span>
              <span>Recomendação: COMPRA (60 segundos)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}