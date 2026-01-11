import { Tag, Button } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
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
        <Button
          type="primary"
          size="large"
          icon={<SyncOutlined spin={isSpinning} />}
          onClick={spin}
          loading={isSpinning}
          className="!mt-6 !px-8 !h-12 !rounded-full !bg-white/20 !border-none hover:!bg-white/30 hover:!scale-105 !transition-all"
        >
          <span className="text-lg font-medium">
            {isSpinning ? '选择中...' : '随机选择'}
          </span>
        </Button>
      </div>

      {/* 分类选择 */}
      <div className="p-4 border-t border-white/10">
        <p className="text-sm text-white/60 mb-3">选择食物分类：</p>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => {
            const isEnabled = config.enabledCategories.includes(cat.id);
            return (
              <Tag.CheckableTag
                key={cat.id}
                checked={isEnabled}
                onChange={() => toggleCategory(cat.id)}
                className={`!flex !items-center !gap-1.5 !px-3 !py-1.5 !rounded-full !border-none !transition-all ${
                  isEnabled 
                    ? '!bg-white/30 !text-white' 
                    : '!bg-white/10 !text-white/60 hover:!text-white/80'
                }`}
              >
                <span>{cat.icon}</span>
                <span className="text-sm">{cat.name}</span>
              </Tag.CheckableTag>
            );
          })}
        </div>
      </div>
    </div>
  );
}
