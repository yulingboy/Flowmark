import { 
  Sun, 
  Cloud, 
  CloudSun, 
  CloudRain, 
  CloudDrizzle, 
  CloudLightning, 
  CloudSnow, 
  CloudFog,
  Snowflake,
  Wind,
  Droplets,
  Thermometer,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  Moon,
} from 'lucide-react';
import type { CSSProperties } from 'react';

interface WeatherIconProps {
  name: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
}

/** 天气图标组件 */
export function WeatherIcon({ name, size = 24, className = '', style }: WeatherIconProps) {
  const props = { size, className, style };
  
  switch (name) {
    case 'sun':
      return <Sun {...props} />;
    case 'cloud':
      return <Cloud {...props} />;
    case 'cloud-sun':
      return <CloudSun {...props} />;
    case 'cloud-rain':
    case 'cloud-rain-wind':
      return <CloudRain {...props} />;
    case 'cloud-drizzle':
      return <CloudDrizzle {...props} />;
    case 'cloud-lightning':
      return <CloudLightning {...props} />;
    case 'cloud-snow':
      return <CloudSnow {...props} />;
    case 'cloud-fog':
      return <CloudFog {...props} />;
    case 'snowflake':
      return <Snowflake {...props} />;
    case 'cloud-hail':
      return <CloudSnow {...props} />;
    default:
      return <CloudSun {...props} />;
  }
}

/** 信息图标组件 */
export function InfoIcon({ type, size = 16, className = '' }: { type: string; size?: number; className?: string }) {
  const props = { size, className };
  
  switch (type) {
    case 'wind':
      return <Wind {...props} />;
    case 'humidity':
      return <Droplets {...props} />;
    case 'temperature':
      return <Thermometer {...props} />;
    case 'visibility':
      return <Eye {...props} />;
    case 'pressure':
      return <Gauge {...props} />;
    case 'sunrise':
      return <Sunrise {...props} />;
    case 'sunset':
      return <Sunset {...props} />;
    case 'moon':
      return <Moon {...props} />;
    default:
      return null;
  }
}
