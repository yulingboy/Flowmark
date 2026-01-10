import { useClock } from '../../hooks/useClock';

interface ClockProps {
  className?: string;
}

export function Clock({ className = '' }: ClockProps) {
  const { time, date, weekday, lunar } = useClock();

  return (
    <div className={`flex flex-col items-center text-white ${className}`}>
      {/* 大字体时钟 */}
      <div className="text-6xl font-semibold tracking-wide tabular-nums drop-shadow-lg">
        {time}
      </div>
      {/* 日期信息 */}
      <div className="mt-2 text-sm opacity-90 flex items-center gap-3 drop-shadow">
        <span>{date}</span>
        <span>{weekday}</span>
        <span>{lunar}</span>
      </div>
    </div>
  );
}
