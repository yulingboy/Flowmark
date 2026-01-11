import { RefreshCw } from 'lucide-react';
import type { PluginSize } from '../../types';
import { useHitokoto } from './useHitokoto';
import { getTypeName } from './types';

export function HitokotoCard({ size }: { size: PluginSize }) {
  const { hitokoto, loading, error, refresh } = useHitokoto();

  // 加载状态
  if (loading && !hitokoto) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/80 to-pink-500/80 rounded-xl">
        <RefreshCw className="w-5 h-5 animate-spin text-white/70" />
      </div>
    );
  }

  // 错误状态
  if (error && !hitokoto) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-500/80 to-pink-500/80 rounded-xl p-2">
        <span className="text-xs text-white/70 text-center">{error}</span>
        <button
          onClick={refresh}
          className="text-xs text-white mt-2 hover:text-white/80 flex items-center gap-1"
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
        className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/80 to-pink-500/80 rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
        onClick={refresh}
      >
        <span className="text-2xl">💬</span>
      </div>
    );
  }

  // 2x2 尺寸：显示句子
  if (size === '2x2') {
    return (
      <div className="w-full h-full flex flex-col bg-gradient-to-br from-purple-500/80 to-pink-500/80 rounded-xl p-3 text-white">
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <p className="text-sm leading-relaxed text-center line-clamp-4">
            {hitokoto.hitokoto}
          </p>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-white/60">
          <span className="truncate max-w-[70%]">
            —— {hitokoto.from_who || hitokoto.from || '佚名'}
          </span>
          <button
            onClick={refresh}
            disabled={loading}
            className="p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    );
  }

  // 2x4 尺寸：完整显示
  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-purple-500/80 to-pink-500/80 rounded-xl p-4 text-white">
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <p className="text-base leading-relaxed text-center">
          「{hitokoto.hitokoto}」
        </p>
      </div>
      <div className="flex items-center justify-between mt-3 text-sm text-white/70">
        <div className="flex flex-col gap-0.5">
          <span>—— {hitokoto.from_who || '佚名'}</span>
          {hitokoto.from && (
            <span className="text-xs text-white/50">《{hitokoto.from}》</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 bg-white/10 rounded">
            {getTypeName(hitokoto.type)}
          </span>
          <button
            onClick={refresh}
            disabled={loading}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
