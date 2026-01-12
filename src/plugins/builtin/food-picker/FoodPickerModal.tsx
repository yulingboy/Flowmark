import { useFoodPicker } from './useFoodPicker';

/** 随机位置的食物名称 */
const floatingFoods = [
  { name: '干锅系列', top: '12%', left: '20%', size: 'text-base', opacity: 'opacity-40' },
  { name: '米苕目', top: '28%', left: '8%', size: 'text-sm', opacity: 'opacity-30' },
  { name: '珍珠奶茶', top: '22%', right: '12%', size: 'text-sm', opacity: 'opacity-30' },
  { name: '肉羹', top: '58%', left: '10%', size: 'text-base', opacity: 'opacity-35' },
  { name: '扬州炒饭', bottom: '18%', right: '8%', size: 'text-sm', opacity: 'opacity-25' },
  { name: '花甲粉丝', bottom: '12%', right: '15%', size: 'text-base', opacity: 'opacity-30' },
  { name: '麻辣烫', bottom: '25%', left: '18%', size: 'text-xs', opacity: 'opacity-25' },
  { name: '烤鱼', top: '45%', right: '20%', size: 'text-xs', opacity: 'opacity-20' },
];

export function FoodPickerModal() {
  const { currentFood, isSpinning, spin } = useFoodPicker();

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-orange-50 via-white to-pink-50 relative overflow-hidden">
      {/* 装饰性圆点 */}
      <div className="absolute top-8 left-12 w-4 h-4 rounded-full bg-pink-300/50" />
      <div className="absolute top-16 left-1/3 w-6 h-6 rounded-full bg-orange-200/40" />
      <div className="absolute top-24 right-24 w-3 h-3 rounded-full bg-orange-300/50" />
      <div className="absolute top-40 left-1/4 w-2 h-2 rounded-full bg-yellow-300/50" />
      <div className="absolute bottom-40 right-1/3 w-3 h-3 rounded-full bg-blue-200/50" />
      <div className="absolute bottom-24 left-20 w-2 h-2 rounded-full bg-purple-200/50" />
      <div className="absolute top-1/3 right-16 w-5 h-5 rounded-full bg-pink-200/30" />

      {/* 飘动的食物名称 */}
      {floatingFoods.map((food, i) => (
        <span
          key={i}
          className={`absolute text-gray-400 ${food.size} ${food.opacity} select-none`}
          style={{
            top: food.top,
            left: food.left,
            right: food.right,
            bottom: food.bottom,
          }}
        >
          {food.name}
        </span>
      ))}

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 z-10">
        <h1 className={`text-3xl font-bold text-orange-500 mb-6 ${isSpinning ? 'animate-pulse' : ''}`}>
          {currentFood || '今天吃什么？'}
        </h1>
        
        {/* 按钮 */}
        <button
          onClick={spin}
          className="px-12 py-3 rounded-full bg-gradient-to-r from-orange-400 to-red-400 text-white font-medium shadow-lg shadow-orange-200/50 hover:shadow-orange-300/50 hover:scale-105 transition-all"
        >
          {isSpinning ? '停止' : '开始'}
        </button>
      </div>
    </div>
  );
}
