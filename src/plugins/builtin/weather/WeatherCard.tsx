import type { PluginSize } from '../../types';
import { useWeather } from './useWeather';

export function WeatherCard({ size }: { size: PluginSize }) {
  const { weather, loading, error, refresh, config, cacheAge } = useWeather();

  if (loading && !weather) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        <span className="animate-pulse text-sm">加载中...</span>
      </div>
    );
  }

  if (error && !weather) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
        <span className="text-sm text-center px-2">{error}</span>
        <button onClick={refresh} className="text-xs text-blue-400 mt-1 hover:text-blue-500">重试</button>
      </div>
    );
  }

  if (!weather) return null;

  if (size === '1x1') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-2">
        <span className="text-2xl">{weather.icon}</span>
        <span className="text-lg font-bold text-gray-700">{weather.temperature}°</span>
      </div>
    );
  }

  if (size === '2x2') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-3 gap-1">
        <span className="text-4xl">{weather.icon}</span>
        <span className="text-2xl font-bold text-gray-700">
          {weather.temperature}°{config.unit === 'celsius' ? 'C' : 'F'}
        </span>
        <span className="text-sm text-gray-500">{weather.city}</span>
        <span className="text-xs text-gray-400">{weather.condition}</span>
        {cacheAge && <span className="text-xs text-gray-300">{cacheAge}</span>}
        {error && <span className="text-xs text-orange-400">{error}</span>}
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col p-4">
      <div className="flex items-center gap-3">
        <span className="text-5xl">{weather.icon}</span>
        <div>
          <div className="text-3xl font-bold text-gray-700">
            {weather.temperature}°{config.unit === 'celsius' ? 'C' : 'F'}
          </div>
          <div className="text-sm text-gray-500">{weather.city}</div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
        <div>体感: {weather.feelsLike}°</div>
        <div>湿度: {weather.humidity}%</div>
        <div>风速: {weather.wind}</div>
        <div>{weather.condition}</div>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
        {cacheAge && <span>{cacheAge}</span>}
        {error && <span className="text-orange-400">{error}</span>}
        <button 
          onClick={refresh} 
          className="text-blue-400 hover:text-blue-500"
          disabled={loading}
        >
          {loading ? '更新中...' : '刷新'}
        </button>
      </div>
    </div>
  );
}
