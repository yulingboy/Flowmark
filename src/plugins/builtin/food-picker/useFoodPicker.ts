import { useState, useCallback, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { usePluginStore } from '../../store';
import type { FoodPickerConfig, FoodCategory } from './types';
import { PLUGIN_ID, DEFAULT_CONFIG, DEFAULT_CATEGORIES, pickRandomFood } from './types';

export function useFoodPicker() {
  const storedConfig = usePluginStore(
    useShallow(state => state.pluginConfigs[PLUGIN_ID] || {})
  );
  const config: FoodPickerConfig = { ...DEFAULT_CONFIG, ...storedConfig };

  const [currentFood, setCurrentFood] = useState<string | null>(null);
  const [currentCategory, setCurrentCategory] = useState<FoodCategory | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  // 初始化时随机选一个
  useEffect(() => {
    if (!currentFood) {
      const result = pickRandomFood(DEFAULT_CATEGORIES, config.enabledCategories);
      if (result) {
        setCurrentFood(result.food);
        setCurrentCategory(result.category);
      }
    }
  }, []);

  /** 随机选择 */
  const spin = useCallback(() => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    
    // 动画效果：快速切换几次后停止
    let count = 0;
    const maxCount = 8;
    const interval = setInterval(() => {
      const result = pickRandomFood(DEFAULT_CATEGORIES, config.enabledCategories);
      if (result) {
        setCurrentFood(result.food);
        setCurrentCategory(result.category);
      }
      count++;
      
      if (count >= maxCount) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, 80);
  }, [config.enabledCategories, isSpinning]);

  /** 更新启用的分类 */
  const toggleCategory = useCallback((categoryId: string) => {
    const newEnabled = config.enabledCategories.includes(categoryId)
      ? config.enabledCategories.filter(id => id !== categoryId)
      : [...config.enabledCategories, categoryId];
    
    usePluginStore.getState().setPluginConfig(PLUGIN_ID, 'enabledCategories', newEnabled);
  }, [config.enabledCategories]);

  return {
    currentFood,
    currentCategory,
    isSpinning,
    spin,
    config,
    categories: DEFAULT_CATEGORIES,
    toggleCategory,
  };
}
