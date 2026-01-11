import type { PluginSize } from '../../types';

// 商店图标
const StoreIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export function PluginManagerCard({ size }: { size: PluginSize }) {
  if (size === '1x1') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-violet-500 to-purple-600">
        <StoreIcon className="w-8 h-8 text-white" />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-violet-500 to-purple-600 p-4">
      <StoreIcon className="w-12 h-12 text-white mb-2" />
      <span className="font-medium text-white">插件市场</span>
      <span className="text-xs text-white/70 mt-1">发现更多插件</span>
    </div>
  );
}
