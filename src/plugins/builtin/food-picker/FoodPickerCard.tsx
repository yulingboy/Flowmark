import { Shuffle } from 'lucide-react';
import type { PluginSize } from '../../types';
import { useFoodPicker } from './useFoodPicker';

export function FoodPickerCard({ size }: { size: PluginSize }) {
  const { currentFood, isSpinning, spin } = useFoodPicker();

  // 1x1 尺寸
  if (size === '1x1') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl relative overflow-hidden">
        <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-pink-300/60" />
        <div className="absolute bottom-3 right-2 w-1 h-1 rounded-full bg-orange-300/60" />
        <Shuffle className={`w-6 h-6 text-orange-400 ${isSpinning ? 'animate-spin' : ''}`} />
      </div>
    );
  }

  // 2x2 尺寸
  if (size === '2x2') {
    return (
      <div className="w-full h-full flex flex-col bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl p-3 relative overflow-hidden">
        {/* 装饰圆点 */}
        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-pink-300/60" />
        <div className="absolute bottom-12 left-3 w-1.5 h-1.5 rounded-full bg-orange-300/60" />
        
        <div className="flex-1 flex flex-col items-center justify-center">
          <span className="text-sm text-gray-500 mb-1">今天吃什么？</span>
          <span className={`text-lg font-bold text-gray-800 text-center ${isSpinning ? 'animate-pulse' : ''}`}>
            {currentFood || '点击开始'}
          </span>
        </div>
        
        <button
          onClick={(e) => { e.stopPropagation(); spin(); }}
          disabled={isSpinning}
          className="flex items-center justify-center gap-1 py-2 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 text-white text-sm font-medium shadow-sm hover:shadow-md transition-all disabled:opacity-70"
        >
          {isSpinning && <Shuffle className="w-3 h-3 animate-spin" />}
          <span>{isSpinning ? '选择中' : '开始'}</span>
        </button>
      </div>
    );
  }

  // 2x4 尺寸
  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl p-4 relative overflow-hidden">
      {/* 装饰圆点 */}
      <div className="absolute top-4 right-6 w-3 h-3 rounded-full bg-pink-300/60" />
      <div className="absolute top-8 left-4 w-2 h-2 rounded-full bg-yellow-300/60" />
      <div className="absolute bottom-16 right-4 w-2 h-2 rounded-full bg-blue-200/60" />
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <span className="text-base text-gray-500 mb-2">今天吃什么？</span>
        <span className={`text-2xl font-bold text-gray-800 text-center ${isSpinning ? 'animate-pulse' : ''}`}>
          {currentFood ? (
            <span className="text-orange-500">{currentFood}!</span>
          ) : (
            '吃什么!'
          )}
        </span>
      </div>
      
      <button
        onClick={(e) => { e.stopPropagation(); spin(); }}
        disabled={isSpinning}
        className="flex items-center justify-center gap-2 py-3 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 text-white font-medium shadow-md hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-70"
      >
        {isSpinning && <Shuffle className="w-4 h-4 animate-spin" />}
        <span>{isSpinning ? '选择中...' : '开始'}</span>
      </button>
    </div>
  );
}
