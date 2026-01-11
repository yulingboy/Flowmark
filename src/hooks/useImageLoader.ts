import { useState, useEffect, useRef } from 'react';

export interface UseImageLoaderOptions {
  src: string;
  placeholder?: string;
  fallback?: string;
  preload?: boolean;
  rootMargin?: string;
  threshold?: number;
}

export interface UseImageLoaderResult {
  imageSrc: string;
  isLoading: boolean;
  isError: boolean;
  isVisible: boolean;
  ref: React.RefObject<HTMLElement | null>;
}

// 内存缓存，避免重复加载
const imageCache = new Map<string, 'loading' | 'loaded' | 'error'>();

/**
 * 图片懒加载 Hook
 * 使用 Intersection Observer 实现懒加载，支持 placeholder 和 fallback
 */
export function useImageLoader(options: UseImageLoaderOptions): UseImageLoaderResult {
  const {
    src,
    placeholder = '',
    fallback = '',
    preload = false,
    rootMargin = '50px',
    threshold = 0.1,
  } = options;

  const [isVisible, setIsVisible] = useState(preload);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [imageSrc, setImageSrc] = useState(placeholder || src);
  const ref = useRef<HTMLElement | null>(null);

  // Intersection Observer 监听可见性
  useEffect(() => {
    if (preload || !ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin, threshold }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [preload, rootMargin, threshold]);

  // 加载图片
  useEffect(() => {
    if (!isVisible || !src) return;

    // 检查缓存
    const cached = imageCache.get(src);
    if (cached === 'loaded') {
      // 使用 setTimeout 避免在 effect 中同步 setState
      const timer = setTimeout(() => {
        setImageSrc(src);
        setIsLoading(false);
        setIsError(false);
      }, 0);
      return () => clearTimeout(timer);
    }
    if (cached === 'error') {
      const timer = setTimeout(() => {
        setImageSrc(fallback || placeholder || src);
        setIsLoading(false);
        setIsError(true);
      }, 0);
      return () => clearTimeout(timer);
    }

    // 开始加载
    setIsLoading(true);
    setIsError(false);
     
    imageCache.set(src, 'loading');

    const img = new Image();
    img.src = src;

    img.onload = () => {
      imageCache.set(src, 'loaded');
      setImageSrc(src);
      setIsLoading(false);
      setIsError(false);
    };

    img.onerror = () => {
      imageCache.set(src, 'error');
      setImageSrc(fallback || placeholder || src);
      setIsLoading(false);
      setIsError(true);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [isVisible, src, placeholder, fallback]);

  return {
    imageSrc,
    isLoading,
    isError,
    isVisible,
    ref,
  };
}

/**
 * 清除图片缓存（用于测试或强制重新加载）
 */
export function clearImageCache(): void {
  imageCache.clear();
}

/**
 * 获取图片缓存状态（用于测试）
 */
export function getImageCacheStatus(src: string): 'loading' | 'loaded' | 'error' | undefined {
  return imageCache.get(src);
}
