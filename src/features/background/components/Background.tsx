import { useState } from 'react';
import { useBackgroundStore } from '../store/backgroundStore';

interface BackgroundProps {
  imageUrl: string;
  className?: string;
}

export function Background({ imageUrl, className = '' }: BackgroundProps) {
  const [hasError, setHasError] = useState(false);
  const { backgroundBlur, backgroundOverlay } = useBackgroundStore();

  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      {!hasError ? (
        <img
          src={imageUrl}
          alt="background"
          className="w-full h-full object-cover"
          style={{ filter: `blur(${backgroundBlur / 10}px)` }}
          onError={() => setHasError(true)}
        />
      ) : (
        // 降级方案：渐变背景
        <div className="w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900" />
      )}
      {/* 叠加层，增强文字可读性 */}
      <div 
        className="absolute inset-0" 
        style={{ backgroundColor: `rgba(0, 0, 0, ${backgroundOverlay / 100})` }}
      />
    </div>
  );
}
