import { Package } from 'lucide-react';
import type { PluginSize } from '@/types';

export function PluginManagerCard({ size }: { size: PluginSize }) {
  if (size === '1x1') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm rounded-xl">
        <Package className="w-6 h-6 text-white/70" />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm rounded-xl p-4">
      <Package className="w-10 h-10 text-white/70 mb-2" />
      <span className="text-sm font-medium text-white/90">插件市场</span>
      <span className="text-xs text-white/50 mt-1">发现更多插件</span>
    </div>
  );
}
