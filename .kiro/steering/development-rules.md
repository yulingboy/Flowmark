---
inclusion: always
---

# AI Nav 开发规则

本项目是一个基于 React + TypeScript + Vite 的浏览器新标签页应用，支持快捷方式管理、插件系统等功能。

## 技术栈

- **框架**: React 19 + TypeScript 5.9
- **构建工具**: Vite 5
- **样式**: Tailwind CSS 4
- **状态管理**: Zustand 5
- **拖拽**: @dnd-kit
- **UI 组件**: Ant Design 6
- **图标**: Lucide React
- **测试**: Vitest + Playwright

## 项目结构

```
src/
├── components/       # 通用组件
│   ├── common/       # 基础组件（Modal、ContextMenu 等）
│   └── Background/   # 背景组件
├── features/         # 功能模块
│   ├── shortcuts/    # 快捷方式管理
│   ├── search/       # 搜索功能
│   ├── clock/        # 时钟组件
│   └── settings/     # 设置面板
├── plugins/          # 插件系统
│   ├── builtin/      # 内置插件
│   ├── components/   # 插件组件
│   └── core/         # 插件核心
├── hooks/            # 自定义 Hooks
├── types/            # 类型定义
└── utils/            # 工具函数
```

## 代码规范

### 文件命名
- 组件文件：PascalCase（如 `ShortcutCard.tsx`）
- Hook 文件：camelCase，以 `use` 开头（如 `useShortcutItems.ts`）
- 工具文件：camelCase（如 `gridUtils.ts`）
- 类型文件：camelCase（如 `shortcuts.ts`）

### 组件规范
- 使用函数组件 + Hooks
- Props 接口命名：`组件名Props`（如 `ShortcutCardProps`）
- 导出方式：命名导出（`export function Component`）
- 每个功能模块有独立的 `index.ts` 导出

### TypeScript 规范
- 优先使用 `interface` 定义对象类型
- 使用 `type` 定义联合类型和工具类型
- 避免使用 `any`，必要时使用 `unknown`
- 为函数参数和返回值添加类型注解

### 样式规范
- 使用 Tailwind CSS 类名
- 避免内联样式，除非是动态计算的值
- 响应式设计优先考虑移动端
- 使用 `tabular-nums` 类实现数字等宽

## 插件开发规范

### 插件结构
```
src/plugins/builtin/[plugin-name]/
├── index.ts          # 插件入口，导出 Plugin 对象
├── [Name]Card.tsx    # 卡片组件（支持 1x1、2x2、2x4 尺寸）
├── [Name]Modal.tsx   # 弹窗组件（可选）
├── store.ts          # 插件独立 store（可选）
├── use[Name].ts      # 数据 Hook（可选）
└── types.ts          # 类型定义（可选）
```

### 插件数据管理
- 每个插件使用独立的 Zustand store 管理自己的数据
- Store 文件命名：`store.ts`
- 使用 `persist` 中间件持久化数据
- 存储键名：`[plugin-name]-plugin-data`
- 全局 `pluginStore` 只管理插件配置，不存储插件数据

### 插件 Store 示例
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MyPluginState {
  data: string[];
  addData: (item: string) => void;
}

export const useMyPluginStore = create<MyPluginState>()(
  persist(
    (set) => ({
      data: [],
      addData: (item) => set((state) => ({ 
        data: [...state.data, item] 
      }))
    }),
    { name: 'my-plugin-data' }
  )
);
```

### 插件入口示例
```typescript
import React from 'react';
import type { Plugin, PluginSize } from '../../types';
import { MyCard } from './MyCard';
import { MyModal } from './MyModal';

export const myPlugin: Plugin = {
  metadata: {
    id: 'my-plugin',
    name: '插件名称',
    version: '1.0.0',
    description: '插件描述',
    author: 'Built-in',
    icon: '🔌'
  },
  supportedSizes: ['1x1', '2x2', '2x4'],
  defaultSize: '2x2',
  modalSize: { width: 400, height: 500 },
  configSchema: { /* 配置项 */ },
  defaultConfig: { /* 默认配置 */ },
  renderCard: (_api, size: PluginSize) => React.createElement(MyCard, { size }),
  renderModal: () => React.createElement(MyModal)
};
```

### 卡片组件规范
- 必须支持 `size` 属性（`'1x1' | '2x2' | '2x4'`）
- 根据不同尺寸显示不同内容
- 使用 `w-full h-full` 填充容器
- 1x1 尺寸只显示核心信息
- 2x2 尺寸显示主要信息
- 2x4 尺寸显示完整信息

### 注册插件
在 `src/plugins/builtin/index.ts` 中：
1. 导入插件
2. 添加到 `builtinPlugins` 数组
3. 导出插件

## 网格系统

### 网格配置
- 默认 4 列 4 行
- 单元格尺寸：64px
- 间距：16px
- 文字高度：20px

### 位置计算
- `pixelToGrid(x, y, unit, gap)` - 像素转网格坐标
- `gridToPixel(col, row, unit, gap)` - 网格转像素坐标
- `getGridSpan(size)` - 获取尺寸的列/行跨度

### 边界验证
- 使用 `GridManager` 类管理网格占用状态
- `canPlace()` 检查位置是否可用（边界 + 碰撞）
- `canResizeItem()` 检查调整尺寸是否有效
- `findValidPositionInBounds()` 查找有效位置

## 状态管理

### Zustand Store 规范
- 每个功能模块独立 Store
- Store 文件命名：`store.ts`
- 使用 `persist` 中间件持久化数据
- 导出 Hook：`use[Feature]Store`

### Store 示例
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MyState {
  data: string[];
  addItem: (item: string) => void;
}

export const useMyStore = create<MyState>()(
  persist(
    (set) => ({
      data: [],
      addItem: (item) => set((state) => ({ 
        data: [...state.data, item] 
      })),
    }),
    { name: 'my-storage' }
  )
);
```

## 注释规范

### 函数注释
```typescript
/**
 * 函数简要描述
 * 
 * 详细说明（可选）
 * 
 * @param paramName 参数说明
 * @returns 返回值说明
 * @example 使用示例（可选）
 */
```

### 复杂逻辑注释
- 在关键逻辑处添加行内注释
- 说明"为什么"而不是"做什么"
- 使用中文注释

## Git 提交规范

### Commit Message 格式
```
<type>: <description>
```

### Type 类型
- `feat`: 新功能
- `fix`: 修复 Bug
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具相关

### 示例
```
feat: 添加万年历插件，支持农历、节气、节日显示
fix: 修复卡片调整尺寸时的边界溢出问题
docs: 为网格工具函数添加详细注释
```

## 测试规范

### 单元测试
- 使用 Vitest
- 测试文件：`*.test.ts` 或 `*.spec.ts`
- 运行：`pnpm test`

### E2E 测试
- 使用 Playwright
- 测试文件：`e2e/*.spec.ts`
- 运行：`pnpm test:e2e`

## 常用命令

```bash
pnpm dev          # 启动开发服务器
pnpm build        # 构建生产版本
pnpm lint         # 代码检查
pnpm test         # 运行单元测试
pnpm test:e2e     # 运行 E2E 测试
```
