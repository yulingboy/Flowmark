import type { CSSProperties } from 'react';

interface WeatherIconProps {
  /** 天气代码或图标名称 */
  code?: number | string;
  /** 是否是白天 */
  isDay?: boolean;
  size?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * 天气图标组件
 * 使用 SVG 绘制，支持白天/夜晚不同图标
 */
export function WeatherIcon({ 
  code, 
  isDay = true, 
  size = 24, 
  className = '',
  style 
}: WeatherIconProps) {
  const iconName = typeof code === 'number' ? getIconByCode(code, isDay) : (code || 'sunny');
  
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 64 64" 
      className={className}
      style={style}
    >
      {renderIcon(iconName, size)}
    </svg>
  );
}

/** 根据天气代码获取图标名称 */
function getIconByCode(code: number, isDay: boolean): string {
  // wttr.in 天气代码映射
  const codeMap: Record<number, [string, string]> = {
    113: ['sunny', 'clear-night'],      // Clear/Sunny
    116: ['partly-cloudy', 'partly-cloudy-night'], // Partly Cloudy
    119: ['cloudy', 'cloudy'],          // Cloudy
    122: ['overcast', 'overcast'],      // Overcast
    143: ['mist', 'mist'],              // Mist
    176: ['light-rain', 'light-rain'],  // Patchy rain
    179: ['light-snow', 'light-snow'],  // Patchy snow
    182: ['sleet', 'sleet'],            // Patchy sleet
    185: ['sleet', 'sleet'],            // Patchy freezing drizzle
    200: ['thunderstorm', 'thunderstorm'], // Thundery outbreaks
    227: ['snow', 'snow'],              // Blowing snow
    230: ['snow', 'snow'],              // Blizzard
    248: ['fog', 'fog'],                // Fog
    260: ['fog', 'fog'],                // Freezing fog
    263: ['drizzle', 'drizzle'],        // Patchy light drizzle
    266: ['drizzle', 'drizzle'],        // Light drizzle
    281: ['sleet', 'sleet'],            // Freezing drizzle
    284: ['sleet', 'sleet'],            // Heavy freezing drizzle
    293: ['light-rain', 'light-rain'],  // Patchy light rain
    296: ['light-rain', 'light-rain'],  // Light rain
    299: ['rain', 'rain'],              // Moderate rain at times
    302: ['rain', 'rain'],              // Moderate rain
    305: ['heavy-rain', 'heavy-rain'],  // Heavy rain at times
    308: ['heavy-rain', 'heavy-rain'],  // Heavy rain
    311: ['sleet', 'sleet'],            // Light freezing rain
    314: ['sleet', 'sleet'],            // Moderate or Heavy freezing rain
    317: ['sleet', 'sleet'],            // Light sleet
    320: ['sleet', 'sleet'],            // Moderate or heavy sleet
    323: ['light-snow', 'light-snow'],  // Patchy light snow
    326: ['light-snow', 'light-snow'],  // Light snow
    329: ['snow', 'snow'],              // Patchy moderate snow
    332: ['snow', 'snow'],              // Moderate snow
    335: ['heavy-snow', 'heavy-snow'],  // Patchy heavy snow
    338: ['heavy-snow', 'heavy-snow'],  // Heavy snow
    350: ['sleet', 'sleet'],            // Ice pellets
    353: ['light-rain', 'light-rain'],  // Light rain shower
    356: ['rain', 'rain'],              // Moderate or heavy rain shower
    359: ['heavy-rain', 'heavy-rain'],  // Torrential rain shower
    362: ['sleet', 'sleet'],            // Light sleet showers
    365: ['sleet', 'sleet'],            // Moderate or heavy sleet showers
    368: ['light-snow', 'light-snow'],  // Light snow showers
    371: ['snow', 'snow'],              // Moderate or heavy snow showers
    374: ['sleet', 'sleet'],            // Light showers of ice pellets
    377: ['sleet', 'sleet'],            // Moderate or heavy showers of ice pellets
    386: ['thunderstorm', 'thunderstorm'], // Patchy light rain in area with thunder
    389: ['thunderstorm', 'thunderstorm'], // Moderate or heavy rain in area with thunder
    392: ['thunderstorm', 'thunderstorm'], // Patchy light snow in area with thunder
    395: ['thunderstorm', 'thunderstorm'], // Moderate or heavy snow in area with thunder
  };
  
  const icons = codeMap[code];
  if (icons) {
    return isDay ? icons[0] : icons[1];
  }
  return isDay ? 'sunny' : 'clear-night';
}

/** 渲染具体图标 */
function renderIcon(name: string, _size: number) {
  switch (name) {
    case 'sunny':
      return (
        <g>
          <circle cx="32" cy="32" r="12" fill="#FFD93D" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <line
              key={i}
              x1="32"
              y1="8"
              x2="32"
              y2="14"
              stroke="#FFD93D"
              strokeWidth="3"
              strokeLinecap="round"
              transform={`rotate(${angle} 32 32)`}
            />
          ))}
        </g>
      );
    
    case 'clear-night':
      return (
        <path
          d="M32 12C22 12 14 20 14 30C14 40 22 48 32 48C36 48 40 47 43 45C38 43 34 38 34 32C34 26 38 21 43 19C40 17 36 12 32 12Z"
          fill="#5DADE2"
        />
      );
    
    case 'partly-cloudy':
      return (
        <g>
          <circle cx="24" cy="24" r="10" fill="#FFD93D" />
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <line
              key={i}
              x1="24"
              y1="8"
              x2="24"
              y2="12"
              stroke="#FFD93D"
              strokeWidth="2"
              strokeLinecap="round"
              transform={`rotate(${angle} 24 24)`}
            />
          ))}
          <path
            d="M20 52C14 52 10 48 10 42C10 36 14 32 20 32C20 26 26 22 32 22C40 22 46 28 46 36C46 36 46 36 46 36C50 36 54 40 54 44C54 48 50 52 46 52H20Z"
            fill="white"
            opacity="0.95"
          />
        </g>
      );
    
    case 'partly-cloudy-night':
      return (
        <g>
          <path
            d="M22 10C16 10 12 14 12 20C12 26 16 30 22 30C24 30 26 29 28 28C25 26 23 23 23 19C23 15 25 12 28 10C26 10 24 10 22 10Z"
            fill="#5DADE2"
          />
          <path
            d="M20 52C14 52 10 48 10 42C10 36 14 32 20 32C20 26 26 22 32 22C40 22 46 28 46 36C46 36 46 36 46 36C50 36 54 40 54 44C54 48 50 52 46 52H20Z"
            fill="white"
            opacity="0.95"
          />
        </g>
      );
    
    case 'cloudy':
    case 'overcast':
      return (
        <path
          d="M16 48C10 48 6 44 6 38C6 32 10 28 16 28C16 22 22 18 28 18C36 18 42 24 42 32C42 32 42 32 42 32C46 32 50 36 50 40C50 44 46 48 42 48H16Z"
          fill={name === 'overcast' ? '#A0AEC0' : 'white'}
          opacity="0.95"
        />
      );
    
    case 'mist':
    case 'fog':
      return (
        <g>
          {[20, 28, 36, 44].map((y, i) => (
            <line
              key={i}
              x1="12"
              y1={y}
              x2="52"
              y2={y}
              stroke="#A0AEC0"
              strokeWidth="4"
              strokeLinecap="round"
              opacity={0.9 - i * 0.15}
            />
          ))}
        </g>
      );
    
    case 'drizzle':
    case 'light-rain':
      return (
        <g>
          <path
            d="M16 36C12 36 8 32 8 28C8 24 12 20 16 20C16 16 20 12 26 12C32 12 38 16 38 22C40 22 44 24 44 28C44 32 40 36 36 36H16Z"
            fill="white"
            opacity="0.95"
          />
          {[20, 28, 36].map((x, i) => (
            <line
              key={i}
              x1={x}
              y1="42"
              x2={x - 2}
              y2="50"
              stroke="#5DADE2"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ))}
        </g>
      );
    
    case 'rain':
      return (
        <g>
          <path
            d="M16 32C12 32 8 28 8 24C8 20 12 16 16 16C16 12 20 8 26 8C32 8 38 12 38 18C40 18 44 20 44 24C44 28 40 32 36 32H16Z"
            fill="white"
            opacity="0.95"
          />
          {[16, 24, 32, 40].map((x, i) => (
            <line
              key={i}
              x1={x}
              y1="38"
              x2={x - 4}
              y2="52"
              stroke="#5DADE2"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          ))}
        </g>
      );
    
    case 'heavy-rain':
      return (
        <g>
          <path
            d="M16 28C12 28 8 24 8 20C8 16 12 12 16 12C16 8 20 4 26 4C32 4 38 8 38 14C40 14 44 16 44 20C44 24 40 28 36 28H16Z"
            fill="#718096"
            opacity="0.95"
          />
          {[14, 22, 30, 38, 46].map((x, i) => (
            <line
              key={i}
              x1={x}
              y1="34"
              x2={x - 6}
              y2="54"
              stroke="#2B6CB0"
              strokeWidth="3"
              strokeLinecap="round"
            />
          ))}
        </g>
      );
    
    case 'thunderstorm':
      return (
        <g>
          <path
            d="M16 28C12 28 8 24 8 20C8 16 12 12 16 12C16 8 20 4 26 4C32 4 38 8 38 14C40 14 44 16 44 20C44 24 40 28 36 28H16Z"
            fill="#718096"
            opacity="0.95"
          />
          <polygon
            points="30,32 24,44 28,44 22,56 36,42 30,42 36,32"
            fill="#FFD93D"
          />
        </g>
      );
    
    case 'light-snow':
      return (
        <g>
          <path
            d="M16 36C12 36 8 32 8 28C8 24 12 20 16 20C16 16 20 12 26 12C32 12 38 16 38 22C40 22 44 24 44 28C44 32 40 36 36 36H16Z"
            fill="white"
            opacity="0.95"
          />
          {[18, 28, 38].map((x, i) => (
            <text
              key={i}
              x={x}
              y={48 + (i % 2) * 6}
              fontSize="10"
              fill="#5DADE2"
              textAnchor="middle"
            >
              ❄
            </text>
          ))}
        </g>
      );
    
    case 'snow':
    case 'heavy-snow':
      return (
        <g>
          <path
            d="M16 32C12 32 8 28 8 24C8 20 12 16 16 16C16 12 20 8 26 8C32 8 38 12 38 18C40 18 44 20 44 24C44 28 40 32 36 32H16Z"
            fill={name === 'heavy-snow' ? '#718096' : 'white'}
            opacity="0.95"
          />
          {[14, 24, 34, 44].map((x, i) => (
            <text
              key={i}
              x={x}
              y={42 + (i % 2) * 8}
              fontSize="12"
              fill="#5DADE2"
              textAnchor="middle"
            >
              ❄
            </text>
          ))}
        </g>
      );
    
    case 'sleet':
      return (
        <g>
          <path
            d="M16 32C12 32 8 28 8 24C8 20 12 16 16 16C16 12 20 8 26 8C32 8 38 12 38 18C40 18 44 20 44 24C44 28 40 32 36 32H16Z"
            fill="white"
            opacity="0.95"
          />
          <line x1="18" y1="38" x2="16" y2="48" stroke="#5DADE2" strokeWidth="2" strokeLinecap="round" />
          <text x="28" y="48" fontSize="10" fill="#5DADE2" textAnchor="middle">❄</text>
          <line x1="38" y1="38" x2="36" y2="48" stroke="#5DADE2" strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    
    default:
      return (
        <circle cx="32" cy="32" r="12" fill="#FFD93D" />
      );
  }
}

/** 信息图标组件（保持不变） */
export function InfoIcon({ type, size = 16, className = '' }: { type: string; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      {type === 'wind' && (
        <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" strokeLinecap="round" strokeLinejoin="round" />
      )}
      {type === 'humidity' && (
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" strokeLinecap="round" strokeLinejoin="round" />
      )}
      {type === 'temperature' && (
        <>
          <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
        </>
      )}
      {type === 'pressure' && (
        <>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" strokeLinecap="round" />
        </>
      )}
      {type === 'visibility' && (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );
}
