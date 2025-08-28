'use client';

interface EngagementTrendsProps {
  data?: Array<{
    date: string;
    instagram: number;
    facebook: number;
    telegram: number;
  }>;
  loading: boolean;
}

export function EngagementTrends({ data, loading }: EngagementTrendsProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendências de Engajamento</h3>
      
      {/* Simplified chart representation */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Últimos 7 dias</span>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-pink-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Instagram</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Facebook</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
              <span className="text-gray-600">Telegram</span>
            </div>
          </div>
        </div>
        
        <div className="h-48 flex items-end space-x-2">
          {data?.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center space-y-1">
              <div className="flex flex-col space-y-1 w-full">
                <div 
                  className="bg-pink-500 rounded-t"
                  style={{ height: `${(item.instagram / 15) * 100}px` }}
                ></div>
                <div 
                  className="bg-blue-500"
                  style={{ height: `${(item.facebook / 15) * 100}px` }}
                ></div>
                <div 
                  className="bg-blue-400 rounded-b"
                  style={{ height: `${(item.telegram / 15) * 100}px` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(item.date).getDate()}
              </span>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-lg font-bold text-pink-600">
              {data ? data[data.length - 1]?.instagram.toFixed(1) : '0.0'}%
            </div>
            <div className="text-xs text-gray-600">Instagram</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {data ? data[data.length - 1]?.facebook.toFixed(1) : '0.0'}%
            </div>
            <div className="text-xs text-gray-600">Facebook</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-400">
              {data ? data[data.length - 1]?.telegram.toFixed(1) : '0.0'}%
            </div>
            <div className="text-xs text-gray-600">Telegram</div>
          </div>
        </div>
      </div>
    </div>
  );
}