import { RefreshCw, Droplets } from 'lucide-react';
import { useWeather } from './useWeather';
import { WeatherIcon, InfoIcon } from './WeatherIcons';
import { getWeatherColor } from './types';

export function WeatherModal() {
  const { weather, loading, refresh, config, cacheAge, error } = useWeather();

  if (!weather) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        {loading ? (
          <RefreshCw className="w-6 h-6 animate-spin" />
        ) : (
          <div className="text-center">
            <p className="text-sm">{error || '暂无天气数据'}</p>
            <button 
              onClick={refresh}
              className="mt-2 text-blue-500 hover:text-blue-600 text-sm"
            >
              点击加载
            </button>
          </div>
        )}
      </div>
    );
  }

  const { current, hourly, daily, astronomy } = weather;
  const iconColor = getWeatherColor(current.condition);
  const unitSymbol = config.unit === 'celsius' ? '°C' : '°F';

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* 顶部：当前天气 */}
      <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">{current.city}</span>
          <button 
            onClick={refresh}
            disabled={loading}
            className="p-1.5 rounded-full hover:bg-white/50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <WeatherIcon name={current.icon} size={64} style={{ color: iconColor }} />
          <div>
            <div className="flex items-baseline">
              <span className="text-5xl font-bold text-gray-800 tabular-nums">
                {current.temperature}
              </span>
              <span className="text-2xl text-gray-500 ml-1">{unitSymbol}</span>
            </div>
            <div className="text-gray-600">{current.condition}</div>
          </div>
        </div>
        
        {/* 详细指标 */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          <div className="bg-white/60 rounded-lg p-2 text-center">
            <InfoIcon type="temperature" size={16} className="mx-auto text-gray-400" />
            <div className="text-xs text-gray-500 mt-1">体感</div>
            <div className="font-medium text-gray-700">{current.feelsLike}°</div>
          </div>
          <div className="bg-white/60 rounded-lg p-2 text-center">
            <InfoIcon type="humidity" size={16} className="mx-auto text-gray-400" />
            <div className="text-xs text-gray-500 mt-1">湿度</div>
            <div className="font-medium text-gray-700">{current.humidity}%</div>
          </div>
          <div className="bg-white/60 rounded-lg p-2 text-center">
            <InfoIcon type="wind" size={16} className="mx-auto text-gray-400" />
            <div className="text-xs text-gray-500 mt-1">风速</div>
            <div className="font-medium text-gray-700 text-sm">{current.wind}</div>
          </div>
          <div className="bg-white/60 rounded-lg p-2 text-center">
            <InfoIcon type="pressure" size={16} className="mx-auto text-gray-400" />
            <div className="text-xs text-gray-500 mt-1">气压</div>
            <div className="font-medium text-gray-700">{current.pressure}</div>
          </div>
        </div>
      </div>
      
      {/* 中部：小时预报 */}
      {hourly.length > 0 && (
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="text-sm font-medium text-gray-700 mb-2">24小时预报</div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {hourly.slice(0, 12).map((hour, i) => (
              <div key={i} className="flex flex-col items-center min-w-[48px]">
                <span className="text-xs text-gray-400">{hour.time}</span>
                <WeatherIcon name={hour.icon} size={20} className="my-1 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{hour.temperature}°</span>
                {hour.chanceOfRain > 0 && (
                  <span className="text-[10px] text-blue-400 flex items-center gap-0.5">
                    <Droplets size={8} />
                    {hour.chanceOfRain}%
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 底部：多日预报 */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="text-sm font-medium text-gray-700 mb-2">7日预报</div>
        <div className="space-y-2">
          {daily.map((day, i) => (
            <div 
              key={i} 
              className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
            >
              <span className="w-12 text-sm text-gray-600">{day.weekday}</span>
              <WeatherIcon name={day.icon} size={20} className="text-gray-500" />
              <span className="flex-1 text-xs text-gray-400 truncate">{day.condition}</span>
              {day.chanceOfRain > 0 && (
                <span className="text-xs text-blue-400 flex items-center gap-0.5">
                  <Droplets size={10} />
                  {day.chanceOfRain}%
                </span>
              )}
              <div className="flex items-center gap-1 tabular-nums">
                <span className="text-sm text-gray-400">{day.minTemp}°</span>
                <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-300 to-orange-300 rounded-full"
                    style={{ 
                      width: `${((day.maxTemp - day.minTemp) / 30) * 100}%`,
                      marginLeft: `${((day.minTemp + 10) / 50) * 100}%`
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">{day.maxTemp}°</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* 日出日落 */}
        {astronomy.sunrise && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="text-sm font-medium text-gray-700 mb-2">日出日落</div>
            <div className="flex justify-around">
              <div className="flex items-center gap-2">
                <InfoIcon type="sunrise" size={20} className="text-orange-400" />
                <div>
                  <div className="text-xs text-gray-400">日出</div>
                  <div className="text-sm font-medium text-gray-700">{astronomy.sunrise}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <InfoIcon type="sunset" size={20} className="text-orange-500" />
                <div>
                  <div className="text-xs text-gray-400">日落</div>
                  <div className="text-sm font-medium text-gray-700">{astronomy.sunset}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <InfoIcon type="moon" size={20} className="text-gray-400" />
                <div>
                  <div className="text-xs text-gray-400">月相</div>
                  <div className="text-sm font-medium text-gray-700">{astronomy.moonPhase}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* 底部状态栏 */}
      <div className="px-4 py-2 bg-gray-50 text-xs text-gray-400 flex justify-between">
        <span>{cacheAge}</span>
        {error && <span className="text-orange-400">{error}</span>}
      </div>
    </div>
  );
}
