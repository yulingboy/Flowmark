# Design Document: Code Refactoring

## Overview

本设计文档描述了 AI Nav 项目的代码重构方案，旨在通过抽象共享逻辑、模块化迁移状态管理、优化模块边界来提升代码质量。重构遵循"高内聚、低耦合"原则，确保每个功能模块自包含。

## Architecture

### 重构后的模块结构

```
src/
├── components/
│   ├── common/
│   │   ├── Modal/
│   │   │   ├── useModalBehavior.ts    # 新增：Modal 行为 Hook
│   │   │   ├── MacModal.tsx           # 重构：使用 useModalBehavior
│   │   │   └── IframeModal.tsx        # 重构：使用 useModalBehavior
│   │   └── ...
│   └── Background/
│       ├── Background.tsx
│       ├── store/
│       │   └── backgroundStore.ts     # 迁移自 features/settings/store/
│       └── index.ts                   # 更新导出
├── features/
│   ├── clock/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── store/
│   │   │   └── clockStore.ts          # 迁移自 features/settings/store/
│   │   └── index.ts                   # 更新导出
│   ├── search/
│   │   ├── components/
│   │   ├── store/
│   │   │   └── searchStore.ts         # 迁移自 features/settings/store/
│   │   └── index.ts                   # 更新导出
│   ├── settings/
│   │   ├── store/
│   │   │   └── generalStore.ts        # 保留：全局设置
│   │   └── index.ts                   # 更新导出
│   └── shortcuts/
│       ├── components/
│       │   ├── ShortcutCard.tsx       # 重构：使用 useCardBehavior
│       │   └── ...
│       └── hooks/
│           └── useCardBehavior.ts     # 新增：Card 行为 Hook
├── hooks/
│   └── index.ts                       # 更新导出
├── plugins/
│   ├── components/
│   │   └── PluginCard.tsx             # 重构：使用 useCardBehavior
│   └── types.ts                       # 删除：直接从 @/types 导入
├── utils/
│   ├── gridUtils.ts                   # 迁移自 features/shortcuts/utils/
│   └── index.ts                       # 新增导出
└── types/
    └── index.ts                       # 保持不变
```

## Components and Interfaces

### 1. useModalBehavior Hook

```typescript
// src/components/common/Modal/useModalBehavior.ts

interface UseModalBehaviorOptions {
  isOpen: boolean;
  onClose: () => void;
  enableDrag?: boolean;
  enableFullscreen?: boolean;
  enableClickOutside?: boolean;
  enableEscapeKey?: boolean;
  initialPosition?: { x: number; y: number };
}

interface UseModalBehaviorResult {
  // 位置状态
  position: { x: number; y: number };
  setPosition: (pos: { x: number; y: number }) => void;
  
  // 全屏状态
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  
  // 拖拽状态
  isDragging: boolean;
  handlePointerDown: (e: React.PointerEvent) => void;
  
  // Refs
  modalRef: React.RefObject<HTMLDivElement>;
  
  // 重置
  reset: () => void;
}

function useModalBehavior(options: UseModalBehaviorOptions): UseModalBehaviorResult;
```

### 2. useCardBehavior Hook

```typescript
// src/features/shortcuts/hooks/useCardBehavior.ts

interface GridConfig {
  columns: number;
  rows: number;
  unit: number;
  gap: number;
}

interface UseCardBehaviorOptions {
  itemId: string;
  itemSize: CardSize;
  position?: Position;
  gridConfig?: GridConfig;
  batchEditMode: boolean;
  isSelected: boolean;
  onToggleSelect?: (id: string) => void;
}

interface UseCardBehaviorResult {
  // 右键菜单
  contextMenu: { isOpen: boolean; x: number; y: number };
  handleContextMenu: (e: React.MouseEvent) => void;
  closeContextMenu: () => void;
  
  // 布局验证
  disabledLayouts: CardSize[];
  
  // 批量编辑
  handleClick: (defaultAction: () => void) => void;
  
  // 样式
  containerClassName: string;
  selectionIndicatorClassName: string;
}

function useCardBehavior(options: UseCardBehaviorOptions): UseCardBehaviorResult;
```

### 3. Store 迁移接口

各 Store 保持原有接口不变，仅改变文件位置和导出路径：

```typescript
// features/search/store/searchStore.ts - 接口不变
export const useSearchStore = create<SearchState>()(...)

// features/clock/store/clockStore.ts - 接口不变
export const useClockStore = create<ClockState>()(...)

// components/Background/store/backgroundStore.ts - 接口不变
export const useBackgroundStore = create<BackgroundState>()(...)
```

## Data Models

本次重构不涉及数据模型变更，所有类型定义保持不变。

### 类型导入路径变更

```typescript
// 重构前 (plugins/types.ts 重导出)
import type { PluginCardItem } from '../types';

// 重构后 (直接导入)
import type { PluginCardItem } from '@/types';
```



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Modal Behavior Hook Functionality

*For any* modal using `useModalBehavior`, when the modal is opened, dragged to a new position, and then closed and reopened, the position state should be correctly managed according to the hook's configuration (reset or remembered).

**Validates: Requirements 1.1, 1.5**

### Property 2: Store Persistence After Migration

*For any* store (searchStore, backgroundStore, clockStore), after migration to its new location, reading and writing to localStorage should produce identical results to the original implementation using the same localStorage keys.

**Validates: Requirements 2.7, 6.5**

### Property 3: Grid Utils Functionality Preservation

*For any* valid grid position and size parameters, the grid utility functions (`pixelToGrid`, `gridToPixel`, `getGridSpan`, `canResizeItem`, `GridManager`) should return identical results before and after the file location change.

**Validates: Requirements 5.4**

### Property 4: Card Behavior Hook Functionality

*For any* card (ShortcutCard or PluginCard) using `useCardBehavior`, the context menu should open at the correct position on right-click, batch edit selection should toggle correctly, and disabled layouts should be calculated correctly based on grid position.

**Validates: Requirements 3.1, 3.6, 7.2, 7.4**

## Error Handling

### Migration Errors

1. **Import Path Errors**: TypeScript compilation will catch any broken import paths after file migrations
2. **Missing Exports**: Module exports will be validated by TypeScript and runtime imports
3. **localStorage Key Mismatch**: Stores must maintain original localStorage keys to preserve user data

### Hook Usage Errors

1. **useModalBehavior**: Should handle cases where modalRef is null gracefully
2. **useCardBehavior**: Should handle missing gridConfig by returning empty disabledLayouts array

## Testing Strategy

### Unit Tests

- Test `useModalBehavior` hook with React Testing Library's `renderHook`
- Test `useCardBehavior` hook with various grid configurations
- Test grid utility functions with edge cases (boundary positions, invalid sizes)

### Property-Based Tests

- **Property 1**: Generate random modal positions and verify state management
- **Property 2**: Generate random store values and verify persistence round-trip
- **Property 3**: Generate random grid parameters and verify function outputs
- **Property 4**: Generate random card configurations and verify behavior

### Integration Tests

- Verify MacModal and IframeModal work correctly with the new hook
- Verify ShortcutCard and PluginCard work correctly with the new hook
- Verify all stores work correctly from their new locations

### Regression Tests

- Run existing E2E tests to ensure no functionality is broken
- Manual testing of all modal interactions
- Manual testing of all card interactions
