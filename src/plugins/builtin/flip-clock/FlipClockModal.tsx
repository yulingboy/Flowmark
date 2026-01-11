import { useFlipClock } from './useFlipClock';
import './flip-clock.css';

export function FlipClockModal() {
  const { time, date, config } = useFlipClock();

  return (
    <div className="h-full flex flex-col items-center justify-center bg-neutral-900 text-white">
      {/* 时间显示 */}
      <div className="text-center">
        <div className="text-8xl font-mono tabular-nums tracking-wider">
          {time.hours}:{time.minutes}
          {config.showSeconds && <span className="text-6xl text-neutral-400">:{time.seconds}</span>}
          {!config.use24Hour && time.period && (
            <span className="text-3xl text-neutral-500 ml-4">{time.period}</span>
          )}
        </div>
        
        {config.showDate && (
          <div className="text-xl text-neutral-500 mt-6">
            {date.formatted}
          </div>
        )}
      </div>
    </div>
  );
}
