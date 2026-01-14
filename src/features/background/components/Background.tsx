import { useState, useEffect } from 'react';
import { useBackgroundStore } from '../store';

interface BackgroundProps {
  imageUrl: string;
  className?: string;
}

export function Background({ imageUrl, className = '' }: BackgroundProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState('');
  const { backgroundBlur, backgroundOverlay } = useBackgroundStore();

  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);

    const img = new Image();
    img.src = imageUrl;
    
    img.onload = () => {
      setCurrentSrc(imageUrl);
      setIsLoaded(true);
    };
    
    img.onerror = () => {
      setHasError(true);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl]);

  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${className}`}>
      {!hasError ? (
        <>
          {/* 模糊占位层 - 在图片加载前显示 */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 transition-opacity duration-700"
            style={{ opacity: isLoaded ? 0 : 1 }}
          />
          {/* 主图片层 */}
          <img
            src={currentSrc || imageUrl}
            alt="background"
            className="w-full h-full object-cover transition-all duration-700"
            style={{ 
              filter: `blur(${backgroundBlur / 10}px)`,
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'scale(1)' : 'scale(1.05)',
            }}
            onError={() => setHasError(true)}
          />
        </>
      ) : (
        // 降级方案：渐变背景
        <div className="w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900" />
      )}
      {/* 叠加层，增强文字可读性 */}
      <div 
        className="absolute inset-0 transition-opacity duration-500" 
        style={{ backgroundColor: `rgba(0, 0, 0, ${backgroundOverlay / 100})` }}
      />
    </div>
  );
}
