import { RefreshCw, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useHitokoto } from './useHitokoto';
import { getTypeName, HITOKOTO_TYPES } from './types';

export function HitokotoModal() {
  const { hitokoto, loading, refresh } = useHitokoto();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!hitokoto) return;
    
    const text = `${hitokoto.hitokoto} —— ${hitokoto.from_who || '佚名'}${hitokoto.from ? `《${hitokoto.from}》` : ''}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!hitokoto) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
        {loading ? (
          <RefreshCw className="w-6 h-6 animate-spin text-white/70" />
        ) : (
          <button
            onClick={refresh}
            className="text-white hover:text-white/80 text-sm"
          >
            点击加载
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-500 to-pink-500 text-white">
      {/* 主内容 */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <p className="text-xl leading-relaxed text-center mb-6">
          「{hitokoto.hitokoto}」
        </p>
        
        <div className="text-center text-white/80">
          <p className="text-base">—— {hitokoto.from_who || '佚名'}</p>
          {hitokoto.from && (
            <p className="text-sm text-white/60 mt-1">《{hitokoto.from}》</p>
          )}
        </div>
      </div>

      {/* 底部信息 */}
      <div className="px-6 py-4 bg-black/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 bg-white/10 rounded">
              {getTypeName(hitokoto.type)}
            </span>
            <span className="text-xs text-white/50">
              #{hitokoto.id}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              title="复制"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-300" />
              ) : (
                <Copy className="w-4 h-4 text-white/60" />
              )}
            </button>
            <button
              onClick={refresh}
              disabled={loading}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              title="换一条"
            >
              <RefreshCw className={`w-4 h-4 text-white/60 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* 类型说明 */}
        <div className="mt-3 flex flex-wrap gap-1">
          {Object.entries(HITOKOTO_TYPES).slice(0, 6).map(([key, name]) => (
            <span
              key={key}
              className="text-xs px-1.5 py-0.5 bg-white/5 rounded text-white/40"
            >
              {name}
            </span>
          ))}
          <span className="text-xs text-white/30">...</span>
        </div>
      </div>
    </div>
  );
}
