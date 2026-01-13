import { memo } from 'react';
import { useImageLoader } from '@/hooks/useImageLoader';

export interface LazyImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  fallback?: string;
  className?: string;
  style?: React.CSSProperties;
  preload?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * 懒加载图片组件
 * 使用 Intersection Observer 实现懒加载，支持 placeholder、fallback 和 fade-in 动画
 */
export const LazyImage = memo(function LazyImage({
  src,
  alt,
  placeholder,
  fallback,
  className = '',
  style,
  preload = false,
  onLoad,
  onError,
}: LazyImageProps) {
  const { imageSrc, isLoading, isError, ref } = useImageLoader({
    src,
    placeholder,
    fallback,
    preload,
  });

  // 触发回调
  if (!isLoading && !isError && onLoad) {
    onLoad();
  }
  if (isError && onError) {
    onError();
  }

  return (
    <img
      ref={ref as React.RefObject<HTMLImageElement>}
      src={imageSrc}
      alt={alt}
      className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
      style={style}
    />
  );
});

/**
 * 懒加载背景图片组件
 * 用于需要背景图的容器
 */
export interface LazyBackgroundProps {
  src: string;
  placeholder?: string;
  fallback?: string;
  className?: string;
  style?: React.CSSProperties;
  preload?: boolean;
  children?: React.ReactNode;
}

export const LazyBackground = memo(function LazyBackground({
  src,
  placeholder,
  fallback,
  className = '',
  style,
  preload = false,
  children,
}: LazyBackgroundProps) {
  const { imageSrc, isLoading, ref } = useImageLoader({
    src,
    placeholder,
    fallback,
    preload,
  });

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
      style={{
        ...style,
        backgroundImage: `url(${imageSrc})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {children}
    </div>
  );
});
