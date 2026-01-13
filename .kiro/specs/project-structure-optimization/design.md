# Design Document: Project Structure Optimization

## Overview

本设计文档描述了 AI Nav 项目结构优化的技术方案。优化目标是建立一致的模块组织模式，提升代码可维护性和开发体验。优化将采用渐进式重构策略，确保向后兼容性。

## Architecture

### 目标目录结构

```
src/
├── components/                    # 通用组件（按功能分组）
│   ├── Modal/                     # Modal 相关组件
│   │   ├── MacModal.tsx
│   │   ├── IframeModal.tsx
│   │   ├── useModalBehavior.ts
│   │   ├── types.ts
│   │   └── index.ts
│   ├── Menu/                      # 菜单相关组件
│   │   ├── ContextMenu.tsx
│   │   ├── types.ts
│   │   └── index.ts
│   ├── Image/                     # 图片相关组件
│   │   ├── LazyImage.tsx
│   │   └── index.ts
│   ├── ErrorBoundary.tsx          # 独立组件保持扁平
│   ├── icons.tsx
│   ├── types.ts                   # 共享类型
│   └── index.ts                   # 统一导出
│
├── features/                      # 功能模块（统一结构）
│   └── {feature}/
│       ├── components/            # 组件
│       │   └── {Component}.tsx
│       ├── store/                 # 状态管理
│       │   ├── store.ts           # 主 store（统一命名）
│       │   ├── types.ts           # store 类型
│       │   ├── defaults.ts        # 默认值（可选）
│       │   └── index.ts           # 导出
│       ├── hooks/                 # 自定义 hooks（可选）
│       │   └── use{Hook}.ts
│       ├── utils/                 # 工具函数（可选）
│       │   └── {util}.ts
│       ├── types.ts               # 模块类型
│       └── index.ts               # 桶导出
│
├── plugins/                       # 插件系统
│   ├── builtin/                   # 内置插件
│   │   └── {plugin-name}/
│   │       ├── index.ts           # 插件入口
│   │       ├── {Name}Card.tsx     # 卡片组件
│   │       ├── {Name}Modal.tsx    # 弹窗组件（可选）
│   │       ├── use{Name}.ts       # 数据 hook（可选）
│   │       ├── types.ts           # 类型定义（可选）
│   │       └── {name}.css         # 样式（可选）
│   ├── components/                # 插件通用组件
│   ├── core/                      # 插件核心逻辑
│   ├── utils/                     # 插件共享工具（新增）
│   ├── store.ts
│   ├── types.ts
│   └── index.ts
│
├── hooks/                         # 全局 hooks
│   ├── types.ts                   # hooks 类型
│   └── index.ts
│
├── types/                         # 全局类型（仅跨模块类型）
│   ├── core.ts
│   ├── plugins.ts
│   ├── shortcuts.ts
│   └── index.ts
│
└── utils/                         # 全局工具
    └── index.ts
```

### 设计原则

1. **一致性优先**: 所有同类模块遵循相同的目录结构和命名规范
2. **就近原则**: 相关代码放在一起，减少跨目录引用
3. **向后兼容**: 通过 re-export 保持现有导入路径可用
4. **渐进重构**: 分阶段进行，每阶段可独立验证

## Components and Interfaces

### 1. Feature Module Interface

每个 Feature 模块的标准导出接口：

```typescript
// features/{feature}/index.ts

// 1. Types (always first)
export type { FeatureProps, FeatureState, ... } from './types';

// 2. Components
export { MainComponent } from './components/MainComponent';
export { SubComponent } from './components/SubComponent';

// 3. Hooks
export { useFeatureHook } from './hooks/useFeatureHook';

// 4. Utils
export { utilFunction } from './utils/utilFunction';

// 5. Store (always last)
export { useFeatureStore } from './store';
export type { FeatureStoreState } from './store/types';
```

### 2. Store Interface

统一的 Store 结构：

```typescript
// features/{feature}/store/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FeatureState } from './types';
import { defaultState } from './defaults';

export const useFeatureStore = create<FeatureState>()(
  persist(
    (set, get) => ({
      ...defaultState,
      // actions
    }),
    { name: 'feature-storage' }
  )
);

// features/{feature}/store/index.ts
export { useFeatureStore } from './store';
export type { FeatureState } from './types';
```

### 3. Component Group Interface

组件分组的标准结构：

```typescript
// components/Modal/index.ts
export { MacModal } from './MacModal';
export { IframeModal } from './IframeModal';
export { useModalBehavior } from './useModalBehavior';
export type { 
  MacModalProps, 
  IframeModalProps, 
  ModalPosition,
  UseModalBehaviorOptions 
} from './types';
```

### 4. Plugin Interface

插件的标准导出：

```typescript
// plugins/builtin/{plugin-name}/index.ts
import type { Plugin } from '@/types';
import { PluginCard } from './PluginCard';
import { PluginModal } from './PluginModal';

export const pluginNamePlugin: Plugin = {
  metadata: { id: 'plugin-name', name: '插件名称', ... },
  supportedSizes: ['1x1', '2x2', '2x4'],
  defaultSize: '2x2',
  renderCard: (api, size) => <PluginCard size={size} />,
  renderModal: () => <PluginModal />,
};
```

## Data Models

### 模块元数据模型

```typescript
interface ModuleMetadata {
  name: string;           // 模块名称
  type: 'feature' | 'plugin' | 'component';
  hasStore: boolean;      // 是否有状态管理
  hasHooks: boolean;      // 是否有自定义 hooks
  hasUtils: boolean;      // 是否有工具函数
  exports: string[];      // 导出列表
}
```

### 重构任务模型

```typescript
interface RefactorTask {
  id: string;
  type: 'rename' | 'move' | 'merge' | 'delete';
  source: string;         // 源路径
  target?: string;        // 目标路径
  reason: string;         // 重构原因
  breaking: boolean;      // 是否破坏性变更
  migration?: string;     // 迁移指南
}
```



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

基于 prework 分析，以下是经过整合的正确性属性：

### Property 1: Module Structure Conformance

*For any* Feature_Module in `src/features/`, the module SHALL contain an `index.ts` file and a `components/` directory, and any components SHALL be placed within the `components/` subdirectory.

*For any* Plugin_Module in `src/plugins/builtin/`, the module SHALL contain an `index.ts` entry file and at least one `{Name}Card.tsx` component file.

**Validates: Requirements 1.1, 1.2, 5.1**

### Property 2: Store Convention Conformance

*For any* store directory in `src/features/*/store/`, if a store file exists, it SHALL be named `store.ts` (not `{feature}Store.ts`), and the exported hook SHALL follow the naming pattern `use{Feature}Store`.

*For any* store with type definitions, the types SHALL be located in `store/types.ts` within the same store directory.

**Validates: Requirements 3.1, 3.2, 3.3**

### Property 3: Backward Compatibility

*For any* existing import path that was valid before refactoring, the import SHALL continue to resolve to the same exported value after refactoring. This is a round-trip property: `resolve(oldPath) === resolve(newPath)` where `newPath` is the re-export.

**Validates: Requirements 2.3**

### Property 4: Code Organization Conformance

*For any* component with associated hooks or utilities, those hooks/utilities SHALL be co-located in the same directory or a sibling subdirectory.

*For any* Plugin_Module entry file, it SHALL export exactly one plugin object named `{pluginName}Plugin`.

*For any* re-export added for backward compatibility, the re-export SHALL include a deprecation comment indicating the new import path.

**Validates: Requirements 2.2, 2.4, 4.2, 4.3, 5.2, 5.3, 6.3**

### Property 5: Codebase Hygiene

*For any* directory in the source tree, if the directory is empty (contains no files or subdirectories), it SHALL be removed unless explicitly marked as a placeholder.

*For any* type definition, there SHALL be exactly one source of truth—no duplicate type definitions with the same name and structure across different files.

**Validates: Requirements 6.1, 6.2, 6.4**

### Property 6: No Circular Dependencies

*For any* module in the codebase, the import graph SHALL be acyclic. If module A imports from module B, then module B SHALL NOT directly or transitively import from module A.

**Validates: Requirements 7.4**

## Error Handling

### 重构过程中的错误处理

1. **导入路径失效**: 如果重构导致导入路径失效，构建将失败。通过 TypeScript 编译检查捕获。

2. **类型不匹配**: 如果类型定义移动后导致类型不匹配，TypeScript 编译器会报错。

3. **循环依赖**: 使用 ESLint 插件 `eslint-plugin-import` 检测循环依赖。

4. **回滚策略**: 每个重构步骤应该是原子的，可以通过 Git 回滚。

## Testing Strategy

### 双重测试方法

本项目结构优化主要涉及静态代码分析，测试策略侧重于：

#### 单元测试（Unit Tests）

- 验证特定的目录结构示例
- 验证特定的命名规范示例
- 验证边界情况（空目录、单文件模块等）

#### 属性测试（Property-Based Tests）

使用 Vitest 配合自定义的文件系统扫描工具进行属性测试：

```typescript
// 示例：验证所有 Feature 模块结构
import { describe, it, expect } from 'vitest';
import { glob } from 'glob';
import { existsSync } from 'fs';
import { join } from 'path';

describe('Feature Module Structure', () => {
  // Property 1: Module Structure Conformance
  // Feature: project-structure-optimization, Property 1
  it('all feature modules should have index.ts and components/', async () => {
    const featureDirs = await glob('src/features/*', { onlyDirectories: true });
    
    for (const dir of featureDirs) {
      expect(existsSync(join(dir, 'index.ts'))).toBe(true);
      expect(existsSync(join(dir, 'components'))).toBe(true);
    }
  });
});
```

### 测试配置

- 属性测试最少运行 100 次迭代（对于文件系统扫描，迭代次数取决于模块数量）
- 每个属性测试必须引用设计文档中的属性编号
- 标签格式: **Feature: project-structure-optimization, Property {number}: {property_text}**

### 验证工具

1. **TypeScript 编译器**: 验证类型正确性和导入路径
2. **ESLint**: 验证代码风格和循环依赖
3. **自定义脚本**: 验证目录结构和命名规范
4. **Vitest**: 运行属性测试

