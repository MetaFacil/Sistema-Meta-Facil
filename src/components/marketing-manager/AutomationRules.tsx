'use client';

import { useState } from 'react';
import { 
  Play, 
  Pause, 
  Plus, 
  Edit, 
  Trash2, 
  Clock, 
  Target, 
  TrendingUp,
  Users,
  MessageSquare
} from 'lucide-react';

interface AutomationRule {
  id: string;
  name: string;
  type: 'schedule' | 'trigger' | 'response';
  status: 'active' | 'paused' | 'draft';
  trigger: string;
  action: string;
  createdAt: Date;
  lastRun?: Date;
  executionCount: number;
  successRate: number;
}

interface AutomationRulesProps {
  rules: AutomationRule[];
  onCreateRule: () => void;
  onEditRule: (ruleId: string) => void;
  onDeleteRule: (ruleId: string) => void;
  onToggleRule: (ruleId: string) => void;
}

// Mock data para demonstração
const mockRules: AutomationRule[] = [
  {
    id: '1',
    name: 'Auto-resposta Novos Seguidores',
    type: 'trigger',
    status: 'active',
    trigger: 'Novo seguidor no Instagram',
    action: 'Enviar mensagem de boas-vindas',
    createdAt: new Date('2024-01-15'),
    lastRun: new Date('2024-01-20T10:30:00'),
    executionCount: 247,
    successRate: 94.5
  },
  {
    id: '2',
    name: 'Post Diário 18h',
    type: 'schedule',
    status: 'active',
    trigger: 'Todos os dias às 18:00',
    action: 'Publicar análise técnica do dia',
    createdAt: new Date('2024-01-10'),
    lastRun: new Date('2024-01-20T18:00:00'),
    executionCount: 15,
    successRate: 100
  },
  {
    id: '3',
    name: 'Resposta Comentários Trading',
    type: 'response',
    status: 'paused',
    trigger: 'Comentário contém "trading"',
    action: 'Responder com dicas básicas',
    createdAt: new Date('2024-01-12'),
    lastRun: new Date('2024-01-19T14:22:00'),
    executionCount: 89,
    successRate: 87.6
  },
  {
    id: '4',
    name: 'Relatório Semanal',
    type: 'schedule',
    status: 'draft',
    trigger: 'Toda segunda-feira às 9:00',
    action: 'Enviar relatório de performance',
    createdAt: new Date('2024-01-18'),
    executionCount: 0,
    successRate: 0
  }
];

export function AutomationRules({
  rules = mockRules,
  onCreateRule,
  onEditRule,
  onDeleteRule,
  onToggleRule
}: AutomationRulesProps) {
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredRules = selectedType === 'all' 
    ? rules 
    : rules.filter(rule => rule.type === selectedType);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'schedule':
        return <Clock size={16} className="text-blue-600" />;
      case 'trigger':
        return <Target size={16} className="text-green-600" />;
      case 'response':
        return <MessageSquare size={16} className="text-purple-600" />;
      default:
        return <Play size={16} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'schedule':
        return 'Agendamento';
      case 'trigger':
        return 'Gatilho';
      case 'response':
        return 'Resposta';
      default:
        return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativa';
      case 'paused':
        return 'Pausada';
      case 'draft':
        return 'Rascunho';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Regras de Automação</h2>
          <p className="text-gray-600">Gerencie automações para seu marketing</p>
        </div>
        <button
          onClick={onCreateRule}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Nova Regra</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{rules.length}</div>
              <div className="text-sm text-gray-600">Total de Regras</div>
            </div>
            <Target className="text-blue-600" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {rules.filter(r => r.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Regras Ativas</div>
            </div>
            <Play className="text-green-600" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {rules.reduce((sum, rule) => sum + rule.executionCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Execuções</div>
            </div>
            <TrendingUp className="text-blue-600" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {(rules.reduce((sum, rule) => sum + rule.successRate, 0) / rules.length).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Taxa de Sucesso</div>
            </div>
            <Users className="text-purple-600" size={24} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedType === 'all'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todas ({rules.length})
          </button>
          <button
            onClick={() => setSelectedType('schedule')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedType === 'schedule'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Agendamentos ({rules.filter(r => r.type === 'schedule').length})
          </button>
          <button
            onClick={() => setSelectedType('trigger')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedType === 'trigger'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Gatilhos ({rules.filter(r => r.type === 'trigger').length})
          </button>
          <button
            onClick={() => setSelectedType('response')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedType === 'response'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Respostas ({rules.filter(r => r.type === 'response').length})
          </button>
        </div>
      </div>

      {/* Rules List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Regra
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Execuções
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taxa Sucesso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Execução
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRules.map((rule) => (
                <tr key={rule.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-gray-900">{rule.name}</div>
                      <div className="text-sm text-gray-500">
                        {rule.trigger} → {rule.action}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(rule.type)}
                      <span className="text-sm text-gray-900">{getTypeLabel(rule.type)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(rule.status)}`}>
                      {getStatusLabel(rule.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {rule.executionCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {rule.successRate.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {rule.lastRun ? rule.lastRun.toLocaleString('pt-BR') : 'Nunca'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onToggleRule(rule.id)}
                        className={`p-1 rounded hover:bg-gray-100 ${
                          rule.status === 'active' ? 'text-yellow-600' : 'text-green-600'
                        }`}
                        title={rule.status === 'active' ? 'Pausar' : 'Ativar'}
                      >
                        {rule.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                      </button>
                      <button
                        onClick={() => onEditRule(rule.id)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onDeleteRule(rule.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredRules.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-2">Nenhuma regra encontrada</div>
          <button
            onClick={onCreateRule}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Criar primeira regra
          </button>
        </div>
      )}
    </div>
  );
}