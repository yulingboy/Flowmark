import { RefreshCw, Quote } from 'lucide-react';
import type { PluginSize } from '../../types';
import { useHitokoto } from './useHitokoto';
import { getTypeName } from './types';

export function HitokotoCard({ size }: { size: PluginSize }) {
  const { hitokoto, loading, error, refresh } = useHitokoto();

  // 加载状态
  if (loading && !hitokoto) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-xl">
        <RefreshCw className="w-5 h-5 animate-spin text-white/50" />
      </div>
    );
  }

  // 错误状态
  if (error && !hitokoto) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm rounded-xl p-2">
        <span className="text-xs text-white/60 text-center">{error}</span>
        <button
          onClick={refresh}
          className="text-xs text-white/70 mt-2 hover:text-white flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" /> 重试
        </button>
      </div>
    );
  }

  if (!hitokoto) return null;

  // 1x1 尺寸：只显示图标
  if (size === '1x1') {
    return (
      <div 
        className="w-full h-full flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-xl cursor-pointer hover:bg-black/30 transition-colors"
        onClick={refresh}
      >
        <Quote className="w-6 h-6 text-white/70" />
      </div>
    );
  }

  // 2x2 尺寸：显示句子
  if (size === '2x2') {
    return (
      <div className="w-full h-full flex flex-col bg-black/20 backdrop-blur-sm rounded-xl p-3 text-white">
        <div className="flex-1 flex items-center justify-center overflow-hidden px-1">
          <p className="text-sm leading-relaxed text-center line-clamp-4 text-white/90">
            {hitokoto.hitokoto}
          </p>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-white/50">
          <span className="truncate max-w-[70%]">
            —— {hitokoto.from_who || hitokoto.from || '佚名'}
          </span>
          <div
            onClick={(e) => { e.stopPropagation(); refresh(); }}
            className="p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          </div>
        </div>
      </div>
    );
  }

  // 2x4 尺寸：完整显示
  return (
    <div className="w-full h-full flex flex-col bg-black/20 backdrop-blur-sm rounded-xl p-4 text-white">
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <p className="text-base leading-relaxed text-center text-white/90">
          「{hitokoto.hitokoto}」
        </p>
      </div>
      <div className="flex items-center justify-between mt-3 text-sm text-white/60">
        <div className="flex flex-col gap-0.5">
          <span>—— {hitokoto.from_who || '佚名'}</span>
          {hitokoto.from && (
            <span className="text-xs text-white/40">《{hitokoto.from}》</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 bg-white/10 rounded text-white/50">
            {getTypeName(hitokoto.type)}
          </span>
          <div
            onClick={(e) => { e.stopPropagation(); refresh(); }}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
