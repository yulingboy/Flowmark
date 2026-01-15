import type { PluginSize } from '@/types';
import { useFlipClock } from './useFlipClock';

export function FlipClockCard({ size }: { size: PluginSize }) {
  const { time, date, config } = useFlipClock();

  // 1x1 尺寸：简化显示
  if (size === '1x1') {
    return (
      <div className="w-full h-full flex items-center justify-center bg-neutral-900/90 backdrop-blur-sm rounded-xl">
        <span className="text-2xl font-mono text-white tabular-nums">
          {time.hours}:{time.minutes}
        </span>
      </div>
    );
  }

  // 2x2 尺寸：静态显示
  if (size === '2x2') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900/90 backdrop-blur-sm rounded-xl p-2">
        <div className="text-4xl font-mono text-white tabular-nums tracking-wider">
          {time.hours}:{time.minutes}
          {config.showSeconds && (
            <span className="text-2xl text-white/60">:{time.seconds}</span>
          )}
        </div>
        {!config.use24Hour && time.period && (
          <span className="text-xs text-white/50 mt-1">{time.period}</span>
        )}
        {config.showDate && (
          <span className="text-xs text-white/40 mt-2">{date.formatted}</span>
        )}
      </div>
    );
  }

  // 2x4 尺寸：静态显示（更大字体）
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900/90 backdrop-blur-sm rounded-xl p-4">
      <div className="text-6xl font-mono text-white tabular-nums tracking-wider">
        {time.hours}:{time.minutes}
        {config.showSeconds && (
          <span className="text-4xl text-white/60">:{time.seconds}</span>
        )}
        {!config.use24Hour && time.period && (
          <span className="text-xl text-white/50 ml-2">{time.period}</span>
        )}
      </div>
      {config.showDate && (
        <span className="text-sm text-white/40 mt-4">{date.formatted}</span>
      )}
    </div>
  );
}
