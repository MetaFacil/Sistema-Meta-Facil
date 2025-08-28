'use client';

import { 
  Download, 
  FileText, 
  File, 
  Image,
  Calendar,
  Mail,
  Share2
} from 'lucide-react';

interface ExportReportsProps {
  dateRange: '7d' | '30d' | '90d' | '1y';
  selectedPlatform: 'all' | 'instagram' | 'facebook' | 'telegram';
}

export function ExportReports({ dateRange, selectedPlatform }: ExportReportsProps) {
  const handleExport = (format: 'pdf' | 'excel' | 'image') => {
    // Implementar exportação
    console.log(`Exportando relatório em ${format}...`);
  };

  const handleScheduleReport = () => {
    // Implementar agendamento de relatórios
    console.log('Agendando relatório...');
  };

  const handleShareReport = () => {
    // Implementar compartilhamento
    console.log('Compartilhando relatório...');
  };

  const dateRangeLabels = {
    '7d': 'Últimos 7 dias',
    '30d': 'Últimos 30 dias',
    '90d': 'Últimos 90 dias',
    '1y': 'Último ano'
  };

  const platformLabels = {
    'all': 'Todas as plataformas',
    'instagram': 'Instagram',
    'facebook': 'Facebook',
    'telegram': 'Telegram'
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Exportar Relatórios</h3>
      
      <div className="space-y-6">
        {/* Current Settings */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Configurações Atuais</h4>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              📅 {dateRangeLabels[dateRange]}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              🌐 {platformLabels[selectedPlatform]}
            </span>
          </div>
        </div>

        {/* Export Options */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Formatos de Exportação</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-red-100 rounded-lg">
                <FileText size={20} className="text-red-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">PDF</div>
                <div className="text-xs text-gray-600">Relatório completo</div>
              </div>
            </button>

            <button
              onClick={() => handleExport('excel')}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-green-100 rounded-lg">
                <File size={20} className="text-green-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Excel</div>
                <div className="text-xs text-gray-600">Dados em planilha</div>
              </div>
            </button>

            <button
              onClick={() => handleExport('image')}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-blue-100 rounded-lg">
                <Image size={20} className="text-blue-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Imagem</div>
                <div className="text-xs text-gray-600">Gráficos em PNG</div>
              </div>
            </button>
          </div>
        </div>

        {/* Additional Actions */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Ações Adicionais</h4>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleScheduleReport}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Calendar size={16} />
              <span>Agendar Relatório</span>
            </button>

            <button
              onClick={handleShareReport}
              className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Share2 size={16} />
              <span>Compartilhar</span>
            </button>

            <button className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Mail size={16} />
              <span>Enviar por Email</span>
            </button>
          </div>
        </div>

        {/* Report Preview */}
        <div className="p-4 border border-dashed border-gray-300 rounded-lg">
          <div className="text-center">
            <Download size={24} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              Os relatórios incluem todas as métricas de performance, análises de audiência e insights de conteúdo
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Dados atualizados até: {new Date().toLocaleString('pt-BR')}
            </p>
          </div>
        </div>

        {/* Scheduled Reports Info */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h5 className="text-sm font-medium text-blue-900 mb-2">💡 Dica: Relatórios Automáticos</h5>
          <p className="text-sm text-blue-800">
            Configure relatórios automáticos para receber insights semanais ou mensais por email.
            Mantenha-se sempre atualizado sobre o desempenho das suas campanhas!
          </p>
        </div>
      </div>
    </div>
  );
}