import { RefreshCw, MapPin } from 'lucide-react';
import { useWeather } from './useWeather';
import { WeatherIcon } from './WeatherIcons';

export function WeatherModal() {
  const { weather, loading, refresh, error, cacheAge } = useWeather();

  if (!weather) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-[#4A90D9] to-[#357ABD]">
        {loading ? (
          <RefreshCw className="w-6 h-6 animate-spin text-white/70" />
        ) : (
          <div className="text-center text-white">
            <p className="text-sm text-white/70">{error || '暂无天气数据'}</p>
            <button 
              onClick={refresh}
              className="mt-2 text-white hover:text-white/80 text-sm"
            >
              点击加载
            </button>
          </div>
        )}
      </div>
    );
  }

  const { current, hourly, daily } = weather;
  const todayForecast = daily[0];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-[#4A90D9] to-[#357ABD] text-white overflow-hidden">
      {/* 顶部：当前天气 */}
      <div className="p-4">
        {/* 城市和刷新 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 text-white/80">
            <MapPin size={14} />
            <span className="text-sm">{current.city}</span>
          </div>
          <button 
            onClick={refresh}
            disabled={loading}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 text-white/60 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        {/* 温度和详情 */}
        <div className="flex items-start gap-4">
          <span className="text-6xl font-light tabular-nums leading-none">
            {current.temperature}°
          </span>
          <div className="flex-1 space-y-1 text-sm">
            <div className="flex items-center gap-2 text-white/90">
              <span>{current.condition}</span>
              {todayForecast && (
                <span className="tabular-nums">{todayForecast.maxTemp} ~ {todayForecast.minTemp}</span>
              )}
              <WeatherIcon code={current.icon} isDay={current.isDay} size={20} className="text-sky-200" />
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-white/70">
              <span>{current.windDir}: {current.wind}</span>
              <span>湿度: {current.humidity}%</span>
              <span>气压: {current.pressure}hPa</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 24小时预报 */}
      {hourly.length > 0 && (
        <div className="px-4 py-3 border-t border-white/10">
          <div className="text-xs text-white/60 mb-3">24小时预报</div>
          <div className="flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {hourly.map((hour, i) => (
              <div key={i} className="flex flex-col items-center min-w-[42px]">
                <WeatherIcon code={hour.icon} isDay={hour.isDay} size={24} className="text-sky-200" />
                <span className="text-sm font-medium mt-1 tabular-nums">{hour.temperature}°</span>
                <span className="text-xs text-white/60">{hour.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 未来7天天气 */}
      <div className="flex-1 px-4 py-3 border-t border-white/10 overflow-hidden">
        <div className="text-xs text-white/60 mb-3">未来7天天气</div>
        <div className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {daily.map((day, i) => (
            <div key={i} className="flex flex-col items-center min-w-[72px]">
              <WeatherIcon code={day.icon} isDay={true} size={32} className="text-sky-200" />
              <span className="text-sm mt-2 tabular-nums">
                {day.maxTemp}° ~ {day.minTemp}°
              </span>
              <span className="text-xs text-white/60 mt-1">
                {day.date.slice(5).replace('-', '月')}日
              </span>
              <span className="text-xs text-white/60">{day.weekday}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* 底部状态栏 */}
      <div className="px-4 py-2 bg-black/10 text-xs text-white/50 flex justify-between">
        <span>{cacheAge}</span>
        {error && <span className="text-orange-300">{error}</span>}
      </div>
    </div>
  );
}
