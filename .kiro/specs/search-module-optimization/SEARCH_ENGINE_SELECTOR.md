# 搜索引擎选择器功能

## 功能概述

为搜索框添加了下拉菜单，允许用户快速切换搜索引擎（Bing、Google、Baidu）。

## 新增组件

### SearchEngineSelector

位置：`src/features/search/components/SearchEngineSelector.tsx`

**功能特性**：
- 显示当前选中的搜索引擎图标
- 点击展开下拉菜单
- 列出所有可用的搜索引擎
- 当前选中的引擎显示勾选标记
- 点击外部自动关闭下拉菜单
- 支持 favicon 加载失败的降级处理

**Props**：
```typescript
interface SearchEngineSelectorProps {
  currentEngine: SearchEngine;      // 当前选中的搜索引擎
  onEngineChange: (engine: SearchEngine) => void;  // 切换回调
}
```

## 集成方式

### 1. SearchInput 组件更新

添加了 `onEngineChange` prop：
```typescript
interface SearchInputProps {
  // ... 其他 props
  searchEngine: SearchEngine;
  onEngineChange: (engine: SearchEngine) => void;  // 新增
}
```

### 2. Search 主组件更新

集成搜索引擎切换逻辑：
```typescript
const handleEngineChange = (engine: SearchEngine) => {
  updateSearchEngine(engine);
};
```

## UI 设计

### 选择器按钮
- 显示当前搜索引擎的 favicon
- 带有下拉箭头图标
- Hover 时显示灰色背景
- 圆角过渡效果

### 下拉菜单
- 白色背景，圆角设计
- 阴影和边框
- 最小宽度 120px
- 每个选项显示：
  - 搜索引擎 favicon
  - 搜索引擎名称
  - 当前选中项显示蓝色背景和勾选标记

### 交互效果
- Hover 时选项背景变为浅灰色
- 当前选中项蓝色高亮
- 点击选项后自动关闭菜单
- 点击外部区域关闭菜单

## 可访问性

- `aria-label` 标签说明功能
- `aria-expanded` 指示下拉状态
- `role="menu"` 和 `role="menuitem"` 语义化
- 键盘导航支持（通过 useClickOutside）

## 测试覆盖

创建了完整的单元测试：
- ✅ 渲染当前搜索引擎
- ✅ 点击打开下拉菜单
- ✅ 选择引擎触发回调
- ✅ 显示当前引擎的勾选标记

测试文件：`src/features/search/components/__tests__/SearchEngineSelector.test.tsx`

## 使用示例

```tsx
import { SearchEngineSelector } from '@/features/search';

function MyComponent() {
  const [engine, setEngine] = useState<SearchEngine>('google');
  
  return (
    <SearchEngineSelector
      currentEngine={engine}
      onEngineChange={setEngine}
    />
  );
}
```

## 技术实现

### 状态管理
- 使用 `useState` 管理下拉菜单开关状态
- 使用 `useRef` 获取容器引用
- 使用 `useClickOutside` hook 处理外部点击

### 数据源
- 从 `SEARCH_ENGINE_CONFIGS` 获取搜索引擎列表
- 动态渲染所有可用的搜索引擎
- 支持未来扩展新的搜索引擎

### 错误处理
- Favicon 加载失败时隐藏图片
- 优雅降级，不影响功能使用

## 构建结果

✅ TypeScript 编译通过
✅ Vite 构建成功
✅ 所有测试通过（4/4）
✅ 打包大小：455.57 kB (gzip: 148.45 kB)

## 后续优化建议

1. **键盘导航增强**：
   - 支持 Tab 键在选项间切换
   - 支持 Enter 键选择
   - 支持 Escape 键关闭

2. **动画效果**：
   - 添加下拉菜单展开/收起动画
   - 添加选项 hover 过渡效果

3. **自定义搜索引擎**：
   - 允许用户添加自定义搜索引擎
   - 支持搜索引擎排序

4. **快捷键支持**：
   - Ctrl+1/2/3 快速切换搜索引擎
   - 记住用户偏好

## 相关文件

- `src/features/search/components/SearchEngineSelector.tsx` - 主组件
- `src/features/search/components/SearchInput.tsx` - 集成点
- `src/features/search/components/Search.tsx` - 使用示例
- `src/features/search/components/__tests__/SearchEngineSelector.test.tsx` - 测试
- `src/features/search/utils/search.ts` - 搜索引擎配置
