import { useState, useEffect, useRef } from 'react';
import { useFlipClock } from './useFlipClock';
import './flip-clock.css';

/** 单个翻页数字 */
function FlipDigit({ digit, prevDigit }: { digit: string; prevDigit: string }) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [currentDigit, setCurrentDigit] = useState(digit);

  useEffect(() => {
    if (digit !== prevDigit && prevDigit !== undefined) {
      setIsFlipping(true);
      // 动画完成后更新当前数字并停止动画
      const timer = setTimeout(() => {
        setCurrentDigit(digit);
        setIsFlipping(false);
      }, 600);
      return () => clearTimeout(timer);
    } else {
      setCurrentDigit(digit);
    }
  }, [digit, prevDigit]);

  return (
    <div className="flip-digit">
      <div className="flip-digit-inner">
        {/* 静态上半部分 - 显示当前数字 */}
        <div className="flip-digit-top">
          <span>{currentDigit}</span>
        </div>
        {/* 静态下半部分 - 显示当前数字 */}
        <div className="flip-digit-bottom">
          <span>{currentDigit}</span>
        </div>
        
        {/* 翻页动画层 */}
        {isFlipping && (
          <>
            {/* 上半部分翻下 - 显示旧数字 */}
            <div className="flip-digit-flip-top">
              <span>{prevDigit}</span>
            </div>
            {/* 下半部分翻上 - 显示新数字 */}
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
  const sizeClass = size === 'sm' ? 'flip-group-sm' : size === 'md' ? 'flip-group-md' : 'flip-group-lg';
  
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

export function FlipClockModal() {
  const { time, prevTime, date, config } = useFlipClock();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        // 如果宽度大于 600 或高度大于 400，认为是全屏或大窗口
        const newIsFullscreen = width > 600 || height > 400;
        setIsFullscreen(newIsFullscreen);
      }
    };

    checkSize();

    // 使用 ResizeObserver 监听容器尺寸变化
    const resizeObserver = new ResizeObserver(() => {
      checkSize();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // 根据是否全屏选择尺寸
  const clockSize = isFullscreen ? 'lg' : 'sm';
  const gapClass = isFullscreen ? 'gap-3' : 'gap-1.5';
  const periodClass = isFullscreen ? 'text-3xl ml-4' : 'text-lg ml-2';
  const dateClass = isFullscreen ? 'text-xl mt-8' : 'text-sm mt-3';

  return (
    <div ref={containerRef} className="h-full flex flex-col items-center justify-center bg-neutral-900 text-white">
      {/* 翻页时钟 */}
      <div className={`flex items-center ${gapClass}`}>
        <FlipGroup value={time.hours} prevValue={prevTime.hours} size={clockSize} />
        <Separator size={clockSize} />
        <FlipGroup value={time.minutes} prevValue={prevTime.minutes} size={clockSize} />
        {config.showSeconds && (
          <>
            <Separator size={clockSize} />
            <FlipGroup value={time.seconds} prevValue={prevTime.seconds} size={clockSize} />
          </>
        )}
        {!config.use24Hour && time.period && (
          <span className={`${periodClass} text-neutral-500`}>
            {time.period}
          </span>
        )}
      </div>
      
      {config.showDate && (
        <div className={`${dateClass} text-neutral-500`}>
          {date.formatted}
        </div>
      )}
    </div>
  );
}
