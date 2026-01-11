# Design Document: Project Structure Refactor

## Overview

本设计文档描述了浏览器起始页项目的目录结构重构方案。重构采用 **Features 模式**，将代码按功能域组织，同时统一类型定义、规范 hooks 和 utils 的位置，提升项目的可维护性。

## Architecture

### 目标目录结构

```
src/
├── components/              # 通用 UI 组件（跨功能复用）
│   ├── common/             # 基础通用组件
│   │   ├── ContextMenu.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── icons.tsx
│   │   ├── IframeModal.tsx
│   │   ├── LazyImage.tsx
│   │   ├── MacModal.tsx
│   │   └── index.ts
│   └── Background/         # 背景组件（布局级）
│       └── Background.tsx
│
├── features/               # 功能模块
│   ├── clock/             # 时钟功能
│   │   ├── components/
│   │   │   └── Clock.tsx
│   │   ├── hooks/
│   │   │   └── useClock.ts
│   │   ├── utils/
│   │   │   ├── clock.ts
│   │   │   └── formatTime.ts
│   │   └── index.ts
│   │
│   ├── search/            # 搜索功能
│   │   ├── components/
│   │   │   └── Search.tsx
│   │   ├── utils/
│   │   │   ├── search.ts
│   │   │   └── searchHistory.ts
│   │   └── index.ts
│   │
│   ├── shortcuts/         # 快捷方式功能
│   │   ├── components/
│   │   │   ├── AddFolderModal.tsx
│   │   │   ├── AddShortcutModal.tsx
│   │   │   ├── BatchEditToolbar.tsx
│   │   │   ├── DraggableItem.tsx
│   │   │   ├── FolderPopup.tsx
│   │   │   ├── ShortcutCard.tsx
│   │   │   ├── ShortcutFolder.tsx
│   │   │   └── ShortcutsContainer.tsx
│   │   ├── hooks/
│   │   │   ├── useDragHandlers.ts
│   │   │   ├── useFolderHandlers.ts
│   │   │   └── useShortcutItems.ts
│   │   ├── utils/
│   │   │   ├── gridUtils.ts
│   │   │   ├── favicon.ts
│   │   │   ├── faviconService.ts
│   │   │   └── siteInfo.ts
│   │   ├── store/
│   │   │   ├── defaults.ts
│   │   │   ├── store.ts
│   │   │   ├── types.ts
│   │   │   └── validation.ts
│   │   └── index.ts
│   │
│   ├── settings/          # 设置功能
│   │   ├── components/
│   │   │   ├── tabs/
│   │   │   ├── SettingRow.tsx
│   │   │   ├── SettingsButton.tsx
│   │   │   ├── SettingsPanel.tsx
│   │   │   └── WallpaperModal.tsx
│   │   ├── store/
│   │   │   ├── backgroundStore.ts
│   │   │   ├── clockStore.ts
│   │   │   ├── generalStore.ts
│   │   │   └── searchStore.ts
│   │   └── index.ts
│   │
│   └── plugins/           # 插件系统
│       ├── builtin/
│       │   ├── notes/
│       │   ├── plugin-manager/
│       │   ├── todo/
│       │   ├── weather/
│       │   └── index.ts
│       ├── components/
│       │   └── PluginCard.tsx
│       ├── core/
│       │   ├── pluginAPI.ts
│       │   └── pluginManager.ts
│       ├── store.ts
│       ├── types.ts
│       └── index.ts
│
├── hooks/                  # 全局通用 hooks
│   ├── useClickOutside.ts
│   ├── useDebounce.ts
│   ├── useImageLoader.ts
│   ├── usePageVisibility.ts
│   └── index.ts
│
├── stores/                 # 全局状态（保留用于跨功能状态）
│   └── settingsStore.ts   # 如有全局设置状态
│
├── types/                  # 全局类型定义
│   ├── core.ts            # 核心类型（Position, Size 等）
│   ├── shortcuts.ts       # 快捷方式相关类型
│   ├── plugins.ts         # 插件相关类型
│   └── index.ts           # 统一导出
│
├── utils/                  # 全局工具函数
│   ├── imagePreloader.ts
│   └── index.ts
│
├── constants.ts           # 全局常量
├── App.tsx
├── main.tsx
└── index.css
```

## Components and Interfaces

### Feature Module 接口规范

每个 Feature Module 应遵循以下结构：

```typescript
// features/{feature}/index.ts - Barrel Export
export { ComponentA, ComponentB } from './components';
export { useFeatureHook } from './hooks';
export { featureStore } from './store';
export type { FeatureType } from './types';
```

### 类型统一方案

将分散的类型定义合并到 `src/types/`：

```typescript
// src/types/core.ts - 核心共享类型
export type CardSize = '1x1' | '1x2' | '2x1' | '2x2' | '2x4';
export type OpenMode = 'tab' | 'popup';

export interface Position {
  x: number;
  y: number;
}
```

```typescript
// src/types/shortcuts.ts - 快捷方式类型
import type { CardSize, Position, OpenMode } from './core';

export interface ShortcutItem {
  id: string;
  name: string;
  url: string;
  icon: string;
  size?: CardSize;
  position?: Position;
  openMode?: OpenMode;
}

export interface ShortcutFolder {
  id: string;
  name: string;
  items: ShortcutItem[];
  isFolder: true;
  size?: CardSize;
  position?: Position;
}

export type ShortcutEntry = ShortcutItem | ShortcutFolder;
```

```typescript
// src/types/plugins.ts - 插件类型
import type { ReactNode } from 'react';
import type { CardSize, Position } from './core';

export interface PluginMetadata {
  id: string;
  name: string;
  version: string;
  description?: string;
  author?: string;
  icon?: string;
}

export interface PluginCardItem {
  id: string;
  pluginId: string;
  name: string;
  icon: string;
  size: CardSize;
  position?: Position;
  isPlugin: true;
}
// ... 其他插件类型
```

## Data Models

### 文件移动映射表

| 原路径 | 新路径 |
|--------|--------|
| `src/components/Clock/` | `src/features/clock/components/` |
| `src/components/Search/` | `src/features/search/components/` |
| `src/components/Shortcuts/` | `src/features/shortcuts/components/` |
| `src/components/Shortcuts/hooks/` | `src/features/shortcuts/hooks/` |
| `src/components/Shortcuts/utils/` | `src/features/shortcuts/utils/` |
| `src/components/Settings/` | `src/features/settings/components/` |
| `src/plugins/` | `src/features/plugins/` |
| `src/stores/settings/` | `src/features/settings/store/` |
| `src/stores/shortcuts/` | `src/features/shortcuts/store/` |
| `src/hooks/useClock.ts` | `src/features/clock/hooks/useClock.ts` |
| `src/utils/clock.ts` | `src/features/clock/utils/clock.ts` |
| `src/utils/formatTime.ts` | `src/features/clock/utils/formatTime.ts` |
| `src/utils/search.ts` | `src/features/search/utils/search.ts` |
| `src/utils/searchHistory.ts` | `src/features/search/utils/searchHistory.ts` |
| `src/utils/favicon.ts` | `src/features/shortcuts/utils/favicon.ts` |
| `src/utils/faviconService.ts` | `src/features/shortcuts/utils/faviconService.ts` |
| `src/utils/siteInfo.ts` | `src/features/shortcuts/utils/siteInfo.ts` |

### 保留在原位置的文件

| 路径 | 原因 |
|------|------|
| `src/components/common/` | 跨功能复用的通用组件 |
| `src/components/Background/` | 布局级组件 |
| `src/hooks/useClickOutside.ts` | 全局通用 hook |
| `src/hooks/useDebounce.ts` | 全局通用 hook |
| `src/hooks/useImageLoader.ts` | 全局通用 hook |
| `src/hooks/usePageVisibility.ts` | 全局通用 hook |
| `src/utils/imagePreloader.ts` | 全局通用工具 |
| `src/constants.ts` | 全局常量 |

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


Based on the prework analysis, the following properties are testable:

### Property 1: Type Definition Uniqueness

*For any* type name defined in the `src/types/` directory, that type name SHALL appear exactly once across all type definition files, ensuring no duplicate definitions exist.

**Validates: Requirements 1.1, 1.2**

### Property 2: Build Success After Refactoring

*For any* valid refactoring operation, running `npm run build` or `pnpm build` SHALL complete without errors, ensuring all import paths are correctly updated.

**Validates: Requirements 2.4, 3.4, 6.1, 6.3**

### Property 3: Feature Module Barrel Exports

*For any* feature module in `src/features/`, there SHALL exist an `index.ts` file that exports the feature's public API.

**Validates: Requirements 7.1**

## Error Handling

### 重构过程中的错误处理

1. **导入路径错误**: 如果移动文件后导入路径未更新，TypeScript 编译器会报错。应在每次移动后运行 `tsc --noEmit` 检查。

2. **循环依赖**: 重构可能引入循环依赖。使用 `madge` 或类似工具检测。

3. **类型冲突**: 合并类型定义时可能发现命名冲突。应优先保留更通用的定义。

### 回滚策略

- 使用 Git 分支进行重构
- 每完成一个 feature 模块的迁移后提交
- 如遇问题可回滚到上一个稳定提交

## Testing Strategy

### 验证方法

1. **编译检查**: 每次文件移动后运行 `pnpm build` 确保无编译错误

2. **类型检查**: 运行 `tsc --noEmit` 验证类型正确性

3. **功能验证**: 启动开发服务器，手动验证各功能正常工作
   - 时钟显示
   - 搜索功能
   - 快捷方式增删改
   - 设置面板
   - 插件系统

4. **导入路径验证**: 检查所有 `@/` 路径别名正确解析

### 测试类型

- **Unit Tests**: 验证类型导出正确性
- **Property Tests**: 验证类型唯一性、barrel export 存在性
- **Integration Tests**: 验证应用构建成功

### Property-Based Testing Configuration

使用 `fast-check` 库（项目已安装）进行属性测试：

```typescript
// 示例：验证 feature 模块结构
import fc from 'fast-check';
import { existsSync } from 'fs';
import { join } from 'path';

const featureModules = ['clock', 'search', 'shortcuts', 'settings', 'plugins'];

// Property: 每个 feature 模块都有 index.ts
test('Feature: project-structure-refactor, Property 3: Feature Module Barrel Exports', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...featureModules),
      (feature) => {
        const indexPath = join('src/features', feature, 'index.ts');
        return existsSync(indexPath);
      }
    ),
    { numRuns: featureModules.length }
  );
});
```
