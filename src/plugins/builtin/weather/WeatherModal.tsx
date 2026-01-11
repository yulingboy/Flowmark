import { useWeather } from './useWeather';

export function WeatherModal() {
  const { weather, loading, refresh, config } = useWeather();

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-500 text-sm">当前城市: {config.location}</span>
        <button 
          onClick={refresh}
          disabled={loading}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? '刷新中...' : '刷新'}
        </button>
      </div>
      
      {weather ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
            <span className="text-6xl">{weather.icon}</span>
            <div>
              <div className="text-4xl font-bold text-gray-700">
                {weather.temperature}°{config.unit === 'celsius' ? 'C' : 'F'}
              </div>
              <div className="text-lg text-gray-500">{weather.condition}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-400">体感温度</div>
              <div className="text-lg font-medium text-gray-700">{weather.feelsLike}°</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-400">湿度</div>
              <div className="text-lg font-medium text-gray-700">{weather.humidity}%</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-400">风速</div>
              <div className="text-lg font-medium text-gray-700">{weather.wind}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-400">城市</div>
              <div className="text-lg font-medium text-gray-700">{weather.city}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-400 py-8">暂无天气数据</div>
      )}
    </div>
  );
}
