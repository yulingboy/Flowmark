import { Button, Card, Empty } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useWeather } from './useWeather';

export function WeatherModal() {
  const { weather, loading, refresh, config } = useWeather();

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-500 text-sm">当前城市: {config.location}</span>
        <Button 
          type="primary"
          icon={<ReloadOutlined />}
          onClick={refresh}
          loading={loading}
        >
          {loading ? '刷新中...' : '刷新'}
        </Button>
      </div>
      
      {weather ? (
        <div className="space-y-4">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="flex items-center gap-4">
              <span className="text-6xl">{weather.icon}</span>
              <div>
                <div className="text-4xl font-bold text-gray-700">
                  {weather.temperature}°{config.unit === 'celsius' ? 'C' : 'F'}
                </div>
                <div className="text-lg text-gray-500">{weather.condition}</div>
              </div>
            </div>
          </Card>
          
          <div className="grid grid-cols-2 gap-3">
            <Card size="small">
              <div className="text-xs text-gray-400">体感温度</div>
              <div className="text-lg font-medium text-gray-700">{weather.feelsLike}°</div>
            </Card>
            <Card size="small">
              <div className="text-xs text-gray-400">湿度</div>
              <div className="text-lg font-medium text-gray-700">{weather.humidity}%</div>
            </Card>
            <Card size="small">
              <div className="text-xs text-gray-400">风速</div>
              <div className="text-lg font-medium text-gray-700">{weather.wind}</div>
            </Card>
            <Card size="small">
              <div className="text-xs text-gray-400">城市</div>
              <div className="text-lg font-medium text-gray-700">{weather.city}</div>
            </Card>
          </div>
        </div>
      ) : (
        <Empty description="暂无天气数据" />
      )}
    </div>
  );
}
