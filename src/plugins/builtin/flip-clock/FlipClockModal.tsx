import { useFlipClock } from './useFlipClock';
import './flip-clock.css';

export function FlipClockModal() {
  const { time, date, config } = useFlipClock();

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-900 text-white">
      {/* 时间显示 */}
      <div className="text-center">
        <div className="text-8xl font-mono tabular-nums tracking-wider">
          {time.hours}:{time.minutes}
          {config.showSeconds && <span className="text-6xl text-gray-400">:{time.seconds}</span>}
          {!config.use24Hour && time.period && (
            <span className="text-3xl text-gray-500 ml-4">{time.period}</span>
          )}
        </div>
        
        {config.showDate && (
          <div className="text-xl text-gray-500 mt-6">
            {date.formatted}
          </div>
        )}
      </div>

      {/* 底部装饰 */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-gray-700"
            style={{ opacity: 0.3 + i * 0.15 }}
          />
        ))}
      </div>
    </div>
  );
}
