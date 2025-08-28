'use client';

interface AudienceInsightsProps {
  data?: {
    demographics: {
      ageGroups: Array<{ range: string; percentage: number }>;
      gender: Array<{ type: string; percentage: number }>;
      locations: Array<{ country: string; percentage: number }>;
    };
    interests: Array<{ category: string; percentage: number }>;
    activeHours: Array<{ hour: number; engagement: number }>;
  };
  loading: boolean;
}

export function AudienceInsights({ data, loading }: AudienceInsightsProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights da Audiência</h3>
      
      <div className="space-y-6">
        {/* Age Groups */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Faixa Etária</h4>
          <div className="space-y-2">
            {data?.demographics.ageGroups.map((group) => (
              <div key={group.range} className="flex items-center">
                <span className="text-sm text-gray-600 w-16">{group.range}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2 ml-3">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${group.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 ml-3 w-12 text-right">
                  {group.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Gender */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Gênero</h4>
          <div className="flex space-x-4">
            {data?.demographics.gender.map((gender, index) => (
              <div key={gender.type} className="flex-1">
                <div className={`p-3 rounded-lg text-center ${
                  index === 0 ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'
                }`}>
                  <div className="text-lg font-bold">{gender.percentage}%</div>
                  <div className="text-xs">{gender.type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Locations */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Principais Localizações</h4>
          <div className="space-y-2">
            {data?.demographics.locations.slice(0, 3).map((location) => (
              <div key={location.country} className="flex items-center justify-between">
                <span className="text-sm text-gray-900">{location.country}</span>
                <span className="text-sm text-gray-600">{location.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Interests */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Principais Interesses</h4>
          <div className="flex flex-wrap gap-2">
            {data?.interests.slice(0, 5).map((interest) => (
              <span 
                key={interest.category}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
              >
                {interest.category} ({interest.percentage}%)
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}