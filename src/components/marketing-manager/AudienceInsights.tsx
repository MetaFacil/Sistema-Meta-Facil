'use client';

import { useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  MapPin, 
  Clock, 
  Heart,
  MessageSquare,
  Share2,
  Target,
  Calendar,
  Filter
} from 'lucide-react';

interface AudienceData {
  totalFollowers: number;
  growth: {
    value: number;
    percentage: number;
    trend: 'up' | 'down';
  };
  demographics: {
    ageGroups: Array<{
      range: string;
      percentage: number;
      count: number;
    }>;
    gender: {
      male: number;
      female: number;
      other: number;
    };
    locations: Array<{
      city: string;
      country: string;
      percentage: number;
      count: number;
    }>;
  };
  activity: {
    bestTimes: Array<{
      day: string;
      hour: number;
      engagement: number;
    }>;
    peakDays: Array<{
      day: string;
      percentage: number;
    }>;
  };
  interests: Array<{
    category: string;
    percentage: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  engagement: {
    averageLikes: number;
    averageComments: number;
    averageShares: number;
    engagementRate: number;
  };
}

interface AudienceInsightsProps {
  platformMetrics?: any[];
  overallMetrics?: any | null;
  loading?: boolean;
  data?: AudienceData;
  timeRange?: '7d' | '30d' | '90d';
  onTimeRangeChange?: (range: '7d' | '30d' | '90d') => void;
}

// Mock data para demonstração
const mockData: AudienceData = {
  totalFollowers: 12547,
  growth: {
    value: 324,
    percentage: 2.6,
    trend: 'up'
  },
  demographics: {
    ageGroups: [
      { range: '18-24', percentage: 28.5, count: 3576 },
      { range: '25-34', percentage: 35.2, count: 4416 },
      { range: '35-44', percentage: 22.1, count: 2773 },
      { range: '45-54', percentage: 10.8, count: 1355 },
      { range: '55+', percentage: 3.4, count: 427 }
    ],
    gender: {
      male: 67.8,
      female: 30.5,
      other: 1.7
    },
    locations: [
      { city: 'São Paulo', country: 'Brasil', percentage: 18.2, count: 2283 },
      { city: 'Rio de Janeiro', country: 'Brasil', percentage: 12.4, count: 1556 },
      { city: 'Belo Horizonte', country: 'Brasil', percentage: 8.7, count: 1092 },
      { city: 'Brasília', country: 'Brasil', percentage: 6.3, count: 790 },
      { city: 'Porto Alegre', country: 'Brasil', percentage: 4.8, count: 602 }
    ]
  },
  activity: {
    bestTimes: [
      { day: 'Segunda', hour: 18, engagement: 8.7 },
      { day: 'Terça', hour: 19, engagement: 9.2 },
      { day: 'Quarta', hour: 18, engagement: 8.9 },
      { day: 'Quinta', hour: 20, engagement: 9.5 },
      { day: 'Sexta', hour: 19, engagement: 8.3 }
    ],
    peakDays: [
      { day: 'Segunda', percentage: 16.2 },
      { day: 'Terça', percentage: 18.7 },
      { day: 'Quarta', percentage: 17.5 },
      { day: 'Quinta', percentage: 19.3 },
      { day: 'Sexta', percentage: 15.8 },
      { day: 'Sábado', percentage: 8.9 },
      { day: 'Domingo', percentage: 3.6 }
    ]
  },
  interests: [
    { category: 'Trading & Investimentos', percentage: 89.3, trend: 'up' },
    { category: 'Finanças Pessoais', percentage: 67.8, trend: 'up' },
    { category: 'Criptomoedas', percentage: 54.2, trend: 'stable' },
    { category: 'Empreendedorismo', percentage: 43.7, trend: 'up' },
    { category: 'Tecnologia', percentage: 38.9, trend: 'down' },
    { category: 'Economia', percentage: 32.1, trend: 'stable' }
  ],
  engagement: {
    averageLikes: 156,
    averageComments: 23,
    averageShares: 12,
    engagementRate: 4.7
  }
};

export function AudienceInsights({
  platformMetrics,
  overallMetrics,
  loading = false,
  data = mockData,
  timeRange = '30d',
  onTimeRangeChange = () => {}
}: AudienceInsightsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('demographics');

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case '7d':
        return 'Últimos 7 dias';
      case '30d':
        return 'Últimos 30 dias';
      case '90d':
        return 'Últimos 90 dias';
      default:
        return range;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={14} className="text-green-500" />;
      case 'down':
        return <TrendingDown size={14} className="text-red-500" />;
      default:
        return <div className="w-3.5 h-3.5 bg-gray-400 rounded-full"></div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Insights da Audiência</h2>
          <p className="text-gray-600">Analise o perfil e comportamento dos seus seguidores</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter size={16} className="text-gray-500" />
          <select
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value as '7d' | '30d' | '90d')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="7d">{getTimeRangeLabel('7d')}</option>
            <option value="30d">{getTimeRangeLabel('30d')}</option>
            <option value="90d">{getTimeRangeLabel('90d')}</option>
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {data.totalFollowers.toLocaleString('pt-BR')}
              </div>
              <div className="text-sm text-gray-600">Total de Seguidores</div>
              <div className="flex items-center mt-2 space-x-1">
                {getTrendIcon(data.growth.trend)}
                <span className={`text-sm font-medium ${
                  data.growth.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  +{data.growth.value} ({data.growth.percentage}%)
                </span>
              </div>
            </div>
            <Users className="text-blue-600" size={32} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {data.engagement.engagementRate}%
              </div>
              <div className="text-sm text-gray-600">Taxa de Engajamento</div>
              <div className="text-xs text-gray-500 mt-2">
                Média da indústria: 3.2%
              </div>
            </div>
            <Heart className="text-purple-600" size={32} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {data.engagement.averageLikes}
              </div>
              <div className="text-sm text-gray-600">Curtidas Médias</div>
              <div className="text-xs text-gray-500 mt-2">
                Por post publicado
              </div>
            </div>
            <Heart className="text-green-600" size={32} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {data.engagement.averageComments}
              </div>
              <div className="text-sm text-gray-600">Comentários Médios</div>
              <div className="text-xs text-gray-500 mt-2">
                Interação ativa
              </div>
            </div>
            <MessageSquare className="text-orange-600" size={32} />
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'demographics', label: 'Demografia', icon: Users },
            { id: 'activity', label: 'Atividade', icon: Clock },
            { id: 'interests', label: 'Interesses', icon: Target },
            { id: 'locations', label: 'Localização', icon: MapPin }
          ].map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                  selectedCategory === category.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon size={16} />
                <span>{category.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content based on selected category */}
      {selectedCategory === 'demographics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Age Groups */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Faixa Etária</h3>
            <div className="space-y-3">
              {data.demographics.ageGroups.map((group) => (
                <div key={group.range} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{group.range} anos</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${group.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">
                      {group.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gender Distribution */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Gênero</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Masculino</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${data.demographics.gender.male}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">
                    {data.demographics.gender.male}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Feminino</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-pink-600 h-2 rounded-full"
                      style={{ width: `${data.demographics.gender.female}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">
                    {data.demographics.gender.female}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Outro</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${data.demographics.gender.other}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">
                    {data.demographics.gender.other}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedCategory === 'activity' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Best Times */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Melhores Horários</h3>
            <div className="space-y-3">
              {data.activity.bestTimes.map((time) => (
                <div key={`${time.day}-${time.hour}`} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{time.day} - {time.hour}:00</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(time.engagement / 10) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">
                      {time.engagement}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Peak Days */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dias com Maior Atividade</h3>
            <div className="space-y-3">
              {data.activity.peakDays.map((day) => (
                <div key={day.day} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{day.day}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${day.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">
                      {day.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedCategory === 'interests' && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Principais Interesses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.interests.map((interest) => (
              <div key={interest.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-900">{interest.category}</span>
                  {getTrendIcon(interest.trend)}
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {interest.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedCategory === 'locations' && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Principais Localizações</h3>
          <div className="space-y-3">
            {data.demographics.locations.map((location) => (
              <div key={`${location.city}-${location.country}`} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-900">{location.city}, {location.country}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full"
                      style={{ width: `${location.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-16 text-right">
                    {location.percentage}% ({location.count})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}