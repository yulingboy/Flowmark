import { RefreshCw } from 'lucide-react';
import type { PluginSize } from '../../types';
import { useWeather } from './useWeather';
import { WeatherIcon } from './WeatherIcons';

export function WeatherCard({ size }: { size: PluginSize }) {
  const { weather, loading, error, refresh } = useWeather();

  // 加载状态
  if (loading && !weather) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#4A90D9] to-[#357ABD] rounded-xl">
        <RefreshCw className="w-5 h-5 animate-spin text-white/70" />
      </div>
    );
  }

  // 错误状态
  if (error && !weather) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#4A90D9] to-[#357ABD] rounded-xl p-2">
        <span className="text-xs text-white/70 text-center">{error}</span>
        <button 
          onClick={refresh} 
          className="text-xs text-white mt-2 hover:text-white/80 flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" /> 重试
        </button>
      </div>
    );
  }

  if (!weather) return null;

  const { current, daily } = weather;
  const todayForecast = daily[0];

  // 1x1 尺寸：极简显示
  if (size === '1x1') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#4A90D9] to-[#357ABD] rounded-xl p-2">
        <span className="text-2xl font-light text-white tabular-nums">
          {current.temperature}°
        </span>
        <WeatherIcon name={current.icon} size={24} className="text-white/90 mt-1" />
      </div>
    );
  }

  // 2x2 尺寸：参考图片第一张的布局
  if (size === '2x2') {
    return (
      <div className="w-full h-full flex flex-col bg-gradient-to-br from-[#4A90D9] to-[#357ABD] rounded-xl p-3 text-white">
        {/* 顶部：温度和图标 */}
        <div className="flex items-start justify-between">
          <span className="text-4xl font-light tabular-nums leading-none">
            {current.temperature}°
          </span>
          <WeatherIcon name={current.icon} size={36} className="text-sky-200" />
        </div>
        
        {/* 中部：城市、天气、温度范围 */}
        <div className="flex items-center justify-between mt-2 text-sm">
          <span className="text-white/90">
            {current.city} {current.condition}
          </span>
          {todayForecast && (
            <span className="text-white/80 tabular-nums">
              {todayForecast.maxTemp}° ~ {todayForecast.minTemp}°
            </span>
          )}
        </div>
        
        {/* 底部：风力和湿度 */}
        <div className="mt-auto pt-2 grid grid-cols-2 gap-2 text-sm bg-white/10 rounded-lg p-2 -mx-1">
          <div className="flex items-center justify-between">
            <span className="text-white/70">风力</span>
            <span className="text-white">{current.windDir}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/70">湿度</span>
            <span className="text-white">{current.humidity}%</span>
          </div>
        </div>
      </div>
    );
  }

  // 2x4 尺寸：完整信息，参考图片第二张
  const { hourly } = weather;
  
  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-[#4A90D9] to-[#357ABD] rounded-xl p-3 text-white overflow-hidden">
      {/* 顶部：当前天气 */}
      <div className="flex items-start gap-4">
        <span className="text-4xl font-light tabular-nums leading-none">
          {current.temperature}°
        </span>
        <div className="flex-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/80">
          <span className="flex items-center gap-1">
            {current.condition} {todayForecast && `${todayForecast.maxTemp}~${todayForecast.minTemp}`}
            <WeatherIcon name={current.icon} size={16} className="text-sky-200" />
          </span>
          <span>{current.windDir}: {current.wind}</span>
          <span>湿度: {current.humidity}%</span>
          <span>气压: {current.pressure}hPa</span>
        </div>
        <button 
          onClick={refresh}
          disabled={loading}
          className="p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 text-white/60 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      {/* 24小时预报 */}
      {hourly.length > 0 && (
        <div className="mt-3">
          <div className="text-xs text-white/60 mb-2">24小时预报</div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {hourly.slice(0, 10).map((hour, i) => (
              <div key={i} className="flex flex-col items-center min-w-[44px]">
                <WeatherIcon name={hour.icon} size={24} className="text-sky-200" />
                <span className="text-sm font-medium mt-1 tabular-nums">{hour.temperature}°</span>
                <span className="text-xs text-white/60">{hour.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 未来7天天气 */}
      {daily.length > 0 && (
        <div className="mt-3 flex-1 min-h-0">
          <div className="text-xs text-white/60 mb-2">未来7天天气</div>
          <div className="flex gap-2 overflow-x-auto">
            {daily.slice(0, 7).map((day, i) => (
              <div key={i} className="flex flex-col items-center min-w-[56px]">
                <WeatherIcon name={day.icon} size={28} className="text-sky-200" />
                <span className="text-sm mt-1 tabular-nums">
                  {day.maxTemp}° ~ {day.minTemp}°
                </span>
                <span className="text-xs text-white/60">{day.weekday}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
