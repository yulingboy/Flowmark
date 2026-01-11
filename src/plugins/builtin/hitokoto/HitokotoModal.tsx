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
      <div className="h-full flex items-center justify-center bg-neutral-900">
        {loading ? (
          <RefreshCw className="w-6 h-6 animate-spin text-neutral-500" />
        ) : (
          <button
            onClick={refresh}
            className="text-neutral-400 hover:text-neutral-200 text-sm transition-colors"
          >
            点击加载
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-neutral-900 text-neutral-100">
      {/* 主内容 */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <p className="text-xl leading-relaxed text-center mb-6 text-neutral-100">
          「{hitokoto.hitokoto}」
        </p>
        
        <div className="text-center">
          <p className="text-base text-neutral-400">—— {hitokoto.from_who || '佚名'}</p>
          {hitokoto.from && (
            <p className="text-sm text-neutral-500 mt-1">《{hitokoto.from}》</p>
          )}
        </div>
      </div>

      {/* 底部信息 */}
      <div className="px-6 py-4 border-t border-neutral-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 bg-neutral-800 rounded text-neutral-400">
              {getTypeName(hitokoto.type)}
            </span>
            <span className="text-xs text-neutral-600">
              #{hitokoto.id}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg hover:bg-neutral-800 transition-colors"
              title="复制"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-neutral-500" />
              )}
            </button>
            <button
              onClick={refresh}
              disabled={loading}
              className="p-2 rounded-lg hover:bg-neutral-800 transition-colors"
              title="换一条"
            >
              <RefreshCw className={`w-4 h-4 text-neutral-500 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* 类型标签 */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {Object.entries(HITOKOTO_TYPES).slice(0, 6).map(([key, name]) => (
            <span
              key={key}
              className="text-xs px-2 py-0.5 bg-neutral-800/50 rounded text-neutral-500"
            >
              {name}
            </span>
          ))}
          <span className="text-xs text-neutral-600">...</span>
        </div>
      </div>
    </div>
  );
}
