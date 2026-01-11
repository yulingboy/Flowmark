import { useState, useEffect } from 'react';
import type { PluginSize } from '../../types';
import { useFlipClock } from './useFlipClock';
import './flip-clock.css';

/** 单个翻页数字 */
function FlipDigit({ digit, prevDigit }: { digit: string; prevDigit: string }) {
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (digit !== prevDigit) {
      setFlipping(true);
      const timer = setTimeout(() => setFlipping(false), 600);
      return () => clearTimeout(timer);
    }
     
  }, [digit, prevDigit]);

  return (
    <div className="flip-digit">
      <div className="flip-digit-inner">
        {/* 上半部分 */}
        <div className="flip-digit-top">
          <span>{digit}</span>
        </div>
        {/* 下半部分 */}
        <div className="flip-digit-bottom">
          <span>{prevDigit}</span>
        </div>
        {/* 翻页动画 */}
        {flipping && (
          <>
            <div className="flip-digit-flip-top">
              <span>{prevDigit}</span>
            </div>
            <div className="flip-digit-flip-bottom">
              <span>{digit}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/** 两位数字组 */
function FlipGroup({ value, prevValue, size }: { value: string; prevValue: string; size: 'sm' | 'md' | 'lg' }) {
  const sizeClass = {
    sm: 'flip-group-sm',
    md: 'flip-group-md',
    lg: 'flip-group-lg',
  }[size];

  return (
    <div className={`flip-group ${sizeClass}`}>
      <FlipDigit digit={value[0]} prevDigit={prevValue[0]} />
      <FlipDigit digit={value[1]} prevDigit={prevValue[1]} />
    </div>
  );
}

/** 分隔符 - 两个点 */
function Separator({ size }: { size: 'sm' | 'md' | 'lg' }) {
  const sizeClass = `flip-separator-${size}`;

  return (
    <div className={`flip-separator ${sizeClass}`}>
      <div className="flip-separator-dot" />
      <div className="flip-separator-dot" />
    </div>
  );
}

export function FlipClockCard({ size }: { size: PluginSize }) {
  const { time, prevTime, date, config } = useFlipClock();

  // 1x1 尺寸：简化显示
  if (size === '1x1') {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-xl">
        <span className="text-2xl font-mono text-white tabular-nums">
          {time.hours}:{time.minutes}
        </span>
      </div>
    );
  }

  // 2x2 尺寸
  if (size === '2x2') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 rounded-xl p-2">
        <div className="flex items-center gap-1">
          <FlipGroup value={time.hours} prevValue={prevTime.hours} size="md" />
          <Separator size="md" />
          <FlipGroup value={time.minutes} prevValue={prevTime.minutes} size="md" />
          {config.showSeconds && (
            <>
              <Separator size="md" />
              <FlipGroup value={time.seconds} prevValue={prevTime.seconds} size="md" />
            </>
          )}
        </div>
        {!config.use24Hour && time.period && (
          <span className="text-xs text-gray-400 mt-1">{time.period}</span>
        )}
        {config.showDate && (
          <span className="text-xs text-gray-500 mt-2">{date.formatted}</span>
        )}
      </div>
    );
  }

  // 2x4 尺寸：完整显示
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 rounded-xl p-4">
      <div className="flex items-center gap-2">
        <FlipGroup value={time.hours} prevValue={prevTime.hours} size="lg" />
        <Separator size="lg" />
        <FlipGroup value={time.minutes} prevValue={prevTime.minutes} size="lg" />
        {config.showSeconds && (
          <>
            <Separator size="lg" />
            <FlipGroup value={time.seconds} prevValue={prevTime.seconds} size="lg" />
          </>
        )}
        {!config.use24Hour && time.period && (
          <span className="text-xl text-gray-400 ml-2">{time.period}</span>
        )}
      </div>
      {config.showDate && (
        <span className="text-sm text-gray-500 mt-4">{date.formatted}</span>
      )}
    </div>
  );
}
