interface WeatherIconProps {
  code?: number | string;
  isDay?: boolean;
  size?: number;
  className?: string;
}

/** 天气图标组件 */
export function WeatherIcon({ code, isDay = true, size = 24, className = '' }: WeatherIconProps) {
  const iconName = typeof code === 'number' ? getIconByCode(code, isDay) : getIconByCode(parseInt(code || '116'), isDay);
  
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
      {renderIcon(iconName)}
    </svg>
  );
}

/** 根据天气代码获取图标名称 */
function getIconByCode(code: number, isDay: boolean): string {
  const codeMap: Record<number, [string, string]> = {
    113: ['sunny', 'moon'],
    116: ['partly-cloudy', 'partly-cloudy-night'],
    119: ['cloudy', 'cloudy'],
    122: ['cloudy', 'cloudy'],
    143: ['fog', 'fog'],
    176: ['rain', 'rain'],
    179: ['snow', 'snow'],
    200: ['thunder', 'thunder'],
    227: ['snow', 'snow'],
    230: ['snow', 'snow'],
    248: ['fog', 'fog'],
    260: ['fog', 'fog'],
    263: ['rain', 'rain'],
    266: ['rain', 'rain'],
    293: ['rain', 'rain'],
    296: ['rain', 'rain'],
    299: ['rain', 'rain'],
    302: ['rain', 'rain'],
    305: ['rain', 'rain'],
    308: ['rain', 'rain'],
    323: ['snow', 'snow'],
    326: ['snow', 'snow'],
    329: ['snow', 'snow'],
    332: ['snow', 'snow'],
    335: ['snow', 'snow'],
    338: ['snow', 'snow'],
    353: ['rain', 'rain'],
    356: ['rain', 'rain'],
    359: ['rain', 'rain'],
    368: ['snow', 'snow'],
    371: ['snow', 'snow'],
    386: ['thunder', 'thunder'],
    389: ['thunder', 'thunder'],
    392: ['thunder', 'thunder'],
    395: ['thunder', 'thunder'],
  };
  const icons = codeMap[code];
  return icons ? (isDay ? icons[0] : icons[1]) : (isDay ? 'sunny' : 'moon');
}

/** 渲染图标 */
function renderIcon(name: string) {
  switch (name) {
    case 'sunny':
      return (
        <g>
          <circle cx="32" cy="32" r="12" fill="#FFD93D" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <line key={i} x1="32" y1="8" x2="32" y2="14" stroke="#FFD93D" strokeWidth="3" strokeLinecap="round" transform={`rotate(${angle} 32 32)`} />
          ))}
        </g>
      );
    case 'moon':
      return <path d="M32 12C22 12 14 20 14 30C14 40 22 48 32 48C36 48 40 47 43 45C38 43 34 38 34 32C34 26 38 21 43 19C40 17 36 12 32 12Z" fill="#5DADE2" />;
    case 'partly-cloudy':
      return (
        <g>
          <circle cx="24" cy="24" r="10" fill="#FFD93D" />
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <line key={i} x1="24" y1="8" x2="24" y2="12" stroke="#FFD93D" strokeWidth="2" strokeLinecap="round" transform={`rotate(${angle} 24 24)`} />
          ))}
          <path d="M20 52C14 52 10 48 10 42C10 36 14 32 20 32C20 26 26 22 32 22C40 22 46 28 46 36C50 36 54 40 54 44C54 48 50 52 46 52H20Z" fill="white" opacity="0.95" />
        </g>
      );
    case 'partly-cloudy-night':
      return (
        <g>
          <path d="M22 10C16 10 12 14 12 20C12 26 16 30 22 30C24 30 26 29 28 28C25 26 23 23 23 19C23 15 25 12 28 10C26 10 24 10 22 10Z" fill="#5DADE2" />
          <path d="M20 52C14 52 10 48 10 42C10 36 14 32 20 32C20 26 26 22 32 22C40 22 46 28 46 36C50 36 54 40 54 44C54 48 50 52 46 52H20Z" fill="white" opacity="0.95" />
        </g>
      );
    case 'cloudy':
      return <path d="M16 48C10 48 6 44 6 38C6 32 10 28 16 28C16 22 22 18 28 18C36 18 42 24 42 32C46 32 50 36 50 40C50 44 46 48 42 48H16Z" fill="white" opacity="0.95" />;
    case 'fog':
      return (
        <g>
          {[20, 28, 36, 44].map((y, i) => (
            <line key={i} x1="12" y1={y} x2="52" y2={y} stroke="#A0AEC0" strokeWidth="4" strokeLinecap="round" opacity={0.9 - i * 0.15} />
          ))}
        </g>
      );
    case 'rain':
      return (
        <g>
          <path d="M16 32C12 32 8 28 8 24C8 20 12 16 16 16C16 12 20 8 26 8C32 8 38 12 38 18C40 18 44 20 44 24C44 28 40 32 36 32H16Z" fill="white" opacity="0.95" />
          {[16, 24, 32, 40].map((x, i) => (
            <line key={i} x1={x} y1="38" x2={x - 4} y2="52" stroke="#5DADE2" strokeWidth="2.5" strokeLinecap="round" />
          ))}
        </g>
      );
    case 'thunder':
      return (
        <g>
          <path d="M16 28C12 28 8 24 8 20C8 16 12 12 16 12C16 8 20 4 26 4C32 4 38 8 38 14C40 14 44 16 44 20C44 24 40 28 36 28H16Z" fill="#718096" opacity="0.95" />
          <polygon points="30,32 24,44 28,44 22,56 36,42 30,42 36,32" fill="#FFD93D" />
        </g>
      );
    case 'snow':
      return (
        <g>
          <path d="M16 32C12 32 8 28 8 24C8 20 12 16 16 16C16 12 20 8 26 8C32 8 38 12 38 18C40 18 44 20 44 24C44 28 40 32 36 32H16Z" fill="white" opacity="0.95" />
          {[14, 24, 34, 44].map((x, i) => (
            <text key={i} x={x} y={42 + (i % 2) * 8} fontSize="12" fill="#5DADE2" textAnchor="middle">❄</text>
          ))}
        </g>
      );
    default:
      return <circle cx="32" cy="32" r="12" fill="#FFD93D" />;
  }
}
