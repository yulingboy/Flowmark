export const PLUGIN_ID = 'food-picker';

/** 食物数据 */
export interface Food {
  id: string;
  name: string;
  category: string;
  icon: string;
}

/** 食物分类 */
export interface FoodCategory {
  id: string;
  name: string;
  icon: string;
  foods: string[];
}

/** 配置 */
export interface FoodPickerConfig {
  enabledCategories: string[];
}

/** 默认配置 */
export const DEFAULT_CONFIG: FoodPickerConfig = {
  enabledCategories: ['chinese', 'western', 'japanese', 'korean', 'snack', 'drink'],
};

/** 预设食物分类 */
export const DEFAULT_CATEGORIES: FoodCategory[] = [
  {
    id: 'chinese',
    name: '中餐',
    icon: '🥢',
    foods: ['红烧肉', '宫保鸡丁', '麻婆豆腐', '糖醋排骨', '鱼香肉丝', '回锅肉', '水煮鱼', '酸菜鱼', '红烧牛肉', '东坡肉', '蒜蓉虾', '清蒸鲈鱼', '炒青菜', '番茄炒蛋', '蛋炒饭', '扬州炒饭', '兰州拉面', '重庆小面', '担担面', '炸酱面', '饺子', '包子', '馄饨', '火锅', '麻辣烫', '串串香', '烤鱼', '黄焖鸡', '沙县小吃', '盖浇饭'],
  },
  {
    id: 'western',
    name: '西餐',
    icon: '🍝',
    foods: ['牛排', '披萨', '意大利面', '汉堡', '三明治', '沙拉', '炸鸡', '薯条', '烤鸡', '奶油蘑菇汤', '罗宋汤', '凯撒沙拉', '芝士焗饭', '培根蛋面', '肉酱面', '海鲜披萨', '夏威夷披萨', '烤肋排', '炸鱼薯条'],
  },
  {
    id: 'japanese',
    name: '日料',
    icon: '🍣',
    foods: ['寿司', '刺身', '拉面', '乌冬面', '荞麦面', '天妇罗', '烤鳗鱼', '日式咖喱', '牛丼', '亲子丼', '猪排饭', '章鱼小丸子', '大阪烧', '味噌汤', '茶泡饭', '日式烤肉', '寿喜烧', '关东煮'],
  },
  {
    id: 'korean',
    name: '韩餐',
    icon: '🍜',
    foods: ['韩式烤肉', '石锅拌饭', '部队锅', '泡菜汤', '大酱汤', '炸鸡', '年糕', '紫菜包饭', '冷面', '参鸡汤', '辣炒年糕', '韩式炸酱面', '芝士排骨', '烤五花肉'],
  },
  {
    id: 'snack',
    name: '小吃',
    icon: '🍢',
    foods: ['煎饼果子', '肉夹馍', '凉皮', '臭豆腐', '烤冷面', '炸串', '烧烤', '鸡蛋灌饼', '手抓饼', '烤红薯', '糖葫芦', '豆腐脑', '油条', '春卷', '锅贴', '生煎', '小笼包', '蛋挞', '鸡蛋仔'],
  },
  {
    id: 'drink',
    name: '饮品',
    icon: '🧋',
    foods: ['奶茶', '咖啡', '果汁', '柠檬茶', '可乐', '雪碧', '酸奶', '豆浆', '椰汁', '芒果冰沙', '珍珠奶茶', '抹茶拿铁', '美式咖啡', '卡布奇诺'],
  },
];

/** 生成唯一ID */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/** 随机选择食物 */
export function pickRandomFood(categories: FoodCategory[], enabledCategories: string[]): { food: string; category: FoodCategory } | null {
  const enabledCats = categories.filter(c => enabledCategories.includes(c.id));
  if (enabledCats.length === 0) return null;
  
  // 收集所有食物
  const allFoods: { food: string; category: FoodCategory }[] = [];
  enabledCats.forEach(cat => {
    cat.foods.forEach(food => {
      allFoods.push({ food, category: cat });
    });
  });
  
  if (allFoods.length === 0) return null;
  
  return allFoods[Math.floor(Math.random() * allFoods.length)];
}
