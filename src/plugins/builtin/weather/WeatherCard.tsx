import { RefreshCw } from 'lucide-react';
import type { PluginSize } from '../../types';
import { useWeather } from './useWeather';
import { WeatherIcon, InfoIcon } from './WeatherIcons';
import { getWeatherColor } from './types';

export function WeatherCard({ size }: { size: PluginSize }) {
  const { weather, loading, error, refresh, config, cacheAge } = useWeather();

  // 加载状态
  if (loading && !weather) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        <RefreshCw className="w-5 h-5 animate-spin" />
      </div>
    );
  }

  // 错误状态
  if (error && !weather) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-2">
        <span className="text-xs text-center">{error}</span>
        <button 
          onClick={refresh} 
          className="text-xs text-blue-400 mt-2 hover:text-blue-500 flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" /> 重试
        </button>
      </div>
    );
  }

  if (!weather) return null;

  const { current, hourly, daily } = weather;
  const iconColor = getWeatherColor(current.condition);
  const unitSymbol = config.unit === 'celsius' ? '°C' : '°F';

  // 1x1 尺寸：极简显示
  if (size === '1x1') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-1">
        <WeatherIcon name={current.icon} size={28} style={{ color: iconColor }} />
        <span className="text-lg font-bold text-gray-700 tabular-nums mt-1">
          {current.temperature}°
        </span>
      </div>
    );
  }

  // 2x2 尺寸：基本信息
  if (size === '2x2') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-3 gap-1">
        <WeatherIcon name={current.icon} size={40} style={{ color: iconColor }} />
        <span className="text-2xl font-bold text-gray-700 tabular-nums">
          {current.temperature}{unitSymbol}
        </span>
        <span className="text-sm text-gray-500">{current.city}</span>
        <span className="text-xs text-gray-400">{current.condition}</span>
        
        {/* 简要信息 */}
        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <InfoIcon type="humidity" size={12} />
            {current.humidity}%
          </span>
          <span className="flex items-center gap-1">
            <InfoIcon type="wind" size={12} />
            {current.wind}
          </span>
        </div>
        
        {/* 缓存时间和错误 */}
        <div className="text-[10px] text-gray-300 mt-1">
          {error ? <span className="text-orange-400">{error}</span> : cacheAge}
        </div>
      </div>
    );
  }

  // 2x4 尺寸：完整信息
  return (
    <div className="w-full h-full flex flex-col p-3 overflow-hidden">
      {/* 顶部：当前天气 */}
      <div className="flex items-start gap-3">
        <WeatherIcon name={current.icon} size={48} style={{ color: iconColor }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-gray-700 tabular-nums">
              {current.temperature}
            </span>
            <span className="text-lg text-gray-500">{unitSymbol}</span>
          </div>
          <div className="text-sm text-gray-500 truncate">{current.city}</div>
          <div className="text-xs text-gray-400">{current.condition}</div>
        </div>
        <button 
          onClick={refresh}
          disabled={loading}
          className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          title="刷新"
        >
          <RefreshCw className={`w-4 h-4 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      {/* 详细信息 */}
      <div className="grid grid-cols-4 gap-2 mt-3 text-xs">
        <div className="flex flex-col items-center">
          <InfoIcon type="temperature" size={14} className="text-gray-400" />
          <span className="text-gray-500 mt-0.5">体感</span>
          <span className="font-medium text-gray-700">{current.feelsLike}°</span>
        </div>
        <div className="flex flex-col items-center">
          <InfoIcon type="humidity" size={14} className="text-gray-400" />
          <span className="text-gray-500 mt-0.5">湿度</span>
          <span className="font-medium text-gray-700">{current.humidity}%</span>
        </div>
        <div className="flex flex-col items-center">
          <InfoIcon type="wind" size={14} className="text-gray-400" />
          <span className="text-gray-500 mt-0.5">风速</span>
          <span className="font-medium text-gray-700 text-[10px]">{current.wind}</span>
        </div>
        <div className="flex flex-col items-center">
          <InfoIcon type="visibility" size={14} className="text-gray-400" />
          <span className="text-gray-500 mt-0.5">能见度</span>
          <span className="font-medium text-gray-700">{current.visibility}km</span>
        </div>
      </div>
      
      {/* 小时预报 */}
      {hourly.length > 0 && (
        <div className="mt-3 flex-1 min-h-0">
          <div className="text-xs text-gray-400 mb-1">小时预报</div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {hourly.slice(0, 6).map((hour, i) => (
              <div key={i} className="flex flex-col items-center min-w-[40px]">
                <span className="text-[10px] text-gray-400">{hour.time}</span>
                <WeatherIcon name={hour.icon} size={16} className="my-0.5 text-gray-500" />
                <span className="text-xs font-medium text-gray-700">{hour.temperature}°</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 底部：缓存时间 */}
      <div className="text-[10px] text-gray-300 mt-auto pt-1 flex justify-between">
        <span>{error ? <span className="text-orange-400">{error}</span> : cacheAge}</span>
        {daily.length > 0 && (
          <span className="text-gray-400">
            {daily[0].minTemp}° / {daily[0].maxTemp}°
          </span>
        )}
      </div>
    </div>
  );
}
