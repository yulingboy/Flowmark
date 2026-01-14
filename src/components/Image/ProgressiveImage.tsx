import { useState, useEffect, memo } from 'react';
import type { CSSProperties, ReactNode } from 'react';

export interface ProgressiveImageProps {
  /** 图片源 URL */
  src: string;
  /** 图片 alt 文本 */
  alt?: string;
  /** 占位符图片（低分辨率或纯色） */
  placeholder?: string;
  /** 模糊程度（像素） */
  blurAmount?: number;
  /** 加载完成回调 */
  onLoad?: () => void;
  /** 加载失败回调 */
  onError?: () => void;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: CSSProperties;
}

export interface ProgressiveBackgroundProps {
  /** 图片源 URL */
  src: string;
  /** 占位符图片（低分辨率或纯色） */
  placeholder?: string;
  /** 模糊程度（像素） */
  blurAmount?: number;
  /** 叠加层透明度（0-100） */
  overlayOpacity?: number;
  /** 加载完成回调 */
  onLoad?: () => void;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: CSSProperties;
  /** 子元素 */
  children?: ReactNode;
}

/**
 * 渐进式加载图片组件
 * 支持模糊占位符，加载完成后平滑过渡
 */
export const ProgressiveImage = memo(function ProgressiveImage({
  src,
  alt = '',
  placeholder,
  blurAmount = 20,
  onLoad,
  onError,
  className = '',
  style,
}: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(placeholder || '');

  useEffect(() => {
    setIsLoaded(false);
    setCurrentSrc(placeholder || '');

    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
      onLoad?.();
    };
    
    img.onerror = () => {
      onError?.();
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, placeholder, onLoad, onError]);

  return (
    <img
      src={currentSrc || src}
      alt={alt}
      className={`transition-all duration-500 ${className}`}
      style={{
        ...style,
        filter: isLoaded ? 'blur(0)' : `blur(${blurAmount}px)`,
        transform: isLoaded ? 'scale(1)' : 'scale(1.1)',
      }}
    />
  );
});

/**
 * 渐进式加载背景图片组件
 * 支持模糊占位符和叠加层
 */
export const ProgressiveBackground = memo(function ProgressiveBackground({
  src,
  placeholder,
  blurAmount = 20,
  overlayOpacity = 0,
  onLoad,
  className = '',
  style,
  children,
}: ProgressiveBackgroundProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(placeholder || '');

  useEffect(() => {
    setIsLoaded(false);
    setCurrentSrc(placeholder || '');

    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
      onLoad?.();
    };

    return () => {
      img.onload = null;
    };
  }, [src, placeholder, onLoad]);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={style}
    >
      {/* 背景图层 */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: currentSrc ? `url(${currentSrc})` : undefined,
          filter: isLoaded ? 'blur(0)' : `blur(${blurAmount}px)`,
          transform: isLoaded ? 'scale(1)' : 'scale(1.1)',
        }}
      />
      
      {/* 叠加层 */}
      {overlayOpacity > 0 && (
        <div
          className="absolute inset-0 bg-black transition-opacity duration-500"
          style={{ opacity: overlayOpacity / 100 }}
        />
      )}
      
      {/* 内容层 */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
});
