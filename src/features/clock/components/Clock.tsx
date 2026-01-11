import { useClock } from '../hooks/useClock';

interface ClockProps {
  className?: string;
}

const fontSizeMap = {
  small: 'text-5xl',
  medium: 'text-6xl',
  large: 'text-7xl',
};

export function Clock({ className = '' }: ClockProps) {
  const { 
    time, 
    date, 
    year,
    weekday, 
    lunar, 
    showLunar, 
    showDate, 
    showWeekday, 
    showYear,
    clockColor,
    clockFontSize,
  } = useClock();

  const dateItems = [];
  if (showYear) dateItems.push(year);
  if (showDate) dateItems.push(date);
  if (showWeekday) dateItems.push(weekday);
  if (showLunar) dateItems.push(lunar);

  return (
    <div className={`flex flex-col items-center ${className}`} style={{ color: clockColor }}>
      {/* 大字体时钟 */}
      <div className={`${fontSizeMap[clockFontSize]} font-semibold tracking-wide tabular-nums drop-shadow-lg`}>
        {time}
      </div>
      {/* 日期信息 */}
      {dateItems.length > 0 && (
        <div className="mt-3 text-base opacity-90 flex items-center gap-4 drop-shadow">
          {dateItems.map((item, index) => (
            <span key={index}>{item}</span>
          ))}
        </div>
      )}
    </div>
  );
}
