import { useState, useEffect } from 'react';
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
function FlipGroup({ value, prevValue }: { value: string; prevValue: string }) {
  return (
    <div className="flip-group flip-group-xl">
      <FlipDigit digit={value[0]} prevDigit={prevValue[0]} />
      <FlipDigit digit={value[1]} prevDigit={prevValue[1]} />
    </div>
  );
}

/** 分隔符 - 两个点 */
function Separator() {
  return (
    <div className="flip-separator flip-separator-xl">
      <div className="flip-separator-dot" />
      <div className="flip-separator-dot" />
    </div>
  );
}

export function FlipClockModal() {
  const { time, prevTime, date, config } = useFlipClock();

  return (
    <div className="h-full flex flex-col items-center justify-center bg-neutral-900 text-white">
      {/* 翻页时钟 */}
      <div className="flex items-center gap-3">
        <FlipGroup value={time.hours} prevValue={prevTime.hours} />
        <Separator />
        <FlipGroup value={time.minutes} prevValue={prevTime.minutes} />
        {config.showSeconds && (
          <>
            <Separator />
            <FlipGroup value={time.seconds} prevValue={prevTime.seconds} />
          </>
        )}
        {!config.use24Hour && time.period && (
          <span className="text-3xl text-neutral-500 ml-4">{time.period}</span>
        )}
      </div>
      
      {config.showDate && (
        <div className="text-xl text-neutral-500 mt-8">
          {date.formatted}
        </div>
      )}
    </div>
  );
}
