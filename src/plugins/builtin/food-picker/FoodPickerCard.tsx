import { Shuffle } from 'lucide-react';
import type { PluginSize } from '../../types';
import { useFoodPicker } from './useFoodPicker';

export function FoodPickerCard({ size }: { size: PluginSize }) {
  const { currentFood, currentCategory, isSpinning, spin } = useFoodPicker();

  // 1x1 尺寸：只显示图标，点击打开弹窗
  if (size === '1x1') {
    return (
      <div 
        className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-400/80 to-red-500/80 rounded-xl"
      >
        <span className={`text-2xl ${isSpinning ? 'animate-bounce' : ''}`}>🍽️</span>
      </div>
    );
  }

  // 2x2 尺寸
  if (size === '2x2') {
    return (
      <div className="w-full h-full flex flex-col bg-gradient-to-br from-orange-400/80 to-red-500/80 rounded-xl p-3 text-white">
        {/* 标题 */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium">🍽️ 今天吃什么</span>
        </div>
        
        {/* 结果显示 */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {currentFood ? (
            <>
              <span className="text-2xl mb-1">{currentCategory?.icon}</span>
              <span className={`text-lg font-bold text-center ${isSpinning ? 'animate-pulse' : ''}`}>
                {currentFood}
              </span>
              <span className="text-xs text-white/60 mt-1">{currentCategory?.name}</span>
            </>
          ) : (
            <span className="text-sm text-white/70">点击按钮开始</span>
          )}
        </div>
        
        {/* 按钮 */}
        <div
          onClick={(e) => { e.stopPropagation(); spin(); }}
          className={`flex items-center justify-center gap-1 py-2 rounded-lg cursor-pointer transition-all ${
            isSpinning ? 'bg-white/10' : 'bg-white/20 hover:bg-white/30'
          }`}
        >
          <Shuffle className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
          <span className="text-sm">{isSpinning ? '选择中...' : '随机选择'}</span>
        </div>
      </div>
    );
  }

  // 2x4 尺寸：完整显示
  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-orange-400/80 to-red-500/80 rounded-xl p-4 text-white">
      {/* 标题 */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">🍽️</span>
        <span className="text-base font-medium">今天吃什么</span>
      </div>
      
      {/* 结果显示 */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {currentFood ? (
          <>
            <span className="text-4xl mb-2">{currentCategory?.icon}</span>
            <span className={`text-2xl font-bold text-center ${isSpinning ? 'animate-pulse' : ''}`}>
              {currentFood}
            </span>
            <span className="text-sm text-white/70 mt-2">{currentCategory?.name}</span>
          </>
        ) : (
          <div className="text-center">
            <span className="text-4xl block mb-2">🤔</span>
            <span className="text-white/70">不知道吃什么？</span>
            <span className="text-white/70 block">让我来帮你选！</span>
          </div>
        )}
      </div>
      
      {/* 按钮 */}
      <div
        onClick={(e) => { e.stopPropagation(); spin(); }}
        className={`flex items-center justify-center gap-2 py-3 rounded-lg cursor-pointer transition-all ${
          isSpinning ? 'bg-white/10' : 'bg-white/20 hover:bg-white/30'
        }`}
      >
        <Shuffle className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
        <span className="text-base font-medium">{isSpinning ? '选择中...' : '随机选择'}</span>
      </div>
    </div>
  );
}
