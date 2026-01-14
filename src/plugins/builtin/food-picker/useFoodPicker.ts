import { useState, useCallback, useEffect, useRef } from 'react';
import { useFoodPickerStore } from './store';
import type { FoodCategory } from './types';
import { DEFAULT_CATEGORIES, pickRandomFood } from './types';

export function useFoodPicker() {
  const config = useFoodPickerStore(state => state.config);
  const setConfig = useFoodPickerStore(state => state.setConfig);

  const [currentFood, setCurrentFood] = useState<string | null>(null);
  const [currentCategory, setCurrentCategory] = useState<FoodCategory | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const initializedRef = useRef(false);

  // 初始化时随机选一个
  useEffect(() => {
    if (!initializedRef.current && !currentFood) {
      initializedRef.current = true;
      const result = pickRandomFood(DEFAULT_CATEGORIES, config.enabledCategories);
      if (result) {
        setCurrentFood(result.food);
        setCurrentCategory(result.category);
      }
    }
  }, [currentFood, config.enabledCategories]);

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
    
    setConfig({ enabledCategories: newEnabled });
  }, [config.enabledCategories, setConfig]);

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
