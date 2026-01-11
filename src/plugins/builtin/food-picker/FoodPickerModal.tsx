import { Shuffle, Check } from 'lucide-react';
import { useFoodPicker } from './useFoodPicker';

export function FoodPickerModal() {
  const { currentFood, currentCategory, isSpinning, spin, categories, config, toggleCategory } = useFoodPicker();

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-orange-400 to-red-500 text-white">
      {/* 头部 */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🍽️</span>
          <div>
            <h2 className="text-lg font-bold">今天吃什么</h2>
            <p className="text-sm text-white/70">让选择困难症不再困难</p>
          </div>
        </div>
      </div>

      {/* 结果区域 */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {currentFood ? (
          <>
            <span className={`text-6xl mb-4 ${isSpinning ? 'animate-bounce' : ''}`}>
              {currentCategory?.icon}
            </span>
            <span className={`text-3xl font-bold text-center ${isSpinning ? 'animate-pulse' : ''}`}>
              {currentFood}
            </span>
            <span className="text-lg text-white/70 mt-2">{currentCategory?.name}</span>
          </>
        ) : (
          <>
            <span className="text-6xl mb-4">🤔</span>
            <span className="text-xl text-white/80">点击下方按钮开始选择</span>
          </>
        )}
        
        {/* 选择按钮 */}
        <div
          onClick={spin}
          className={`mt-6 flex items-center gap-2 px-8 py-3 rounded-full cursor-pointer transition-all ${
            isSpinning 
              ? 'bg-white/10' 
              : 'bg-white/20 hover:bg-white/30 hover:scale-105'
          }`}
        >
          <Shuffle className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
          <span className="text-lg font-medium">
            {isSpinning ? '选择中...' : '随机选择'}
          </span>
        </div>
      </div>

      {/* 分类选择 */}
      <div className="p-4 border-t border-white/10">
        <p className="text-sm text-white/60 mb-3">选择食物分类：</p>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => {
            const isEnabled = config.enabledCategories.includes(cat.id);
            return (
              <div
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full cursor-pointer transition-all ${
                  isEnabled 
                    ? 'bg-white/30' 
                    : 'bg-white/10 opacity-60 hover:opacity-80'
                }`}
              >
                <span>{cat.icon}</span>
                <span className="text-sm">{cat.name}</span>
                {isEnabled && <Check className="w-3 h-3" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
