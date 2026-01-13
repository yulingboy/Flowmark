# Requirements Document

## Introduction

本项目旨在对 AI Nav 浏览器新标签页应用进行代码重构，通过抽象共享逻辑、合并分散的状态管理、优化模块边界来提升代码质量和可维护性。重构将保持所有现有功能不变，同时减少代码重复、简化架构。

## Glossary

- **Modal_System**: 弹窗系统，包括 MacModal 和 IframeModal 组件
- **Settings_Store**: 设置状态管理，包括通用、搜索、背景、时钟四个 store
- **Card_Component**: 卡片组件，包括 ShortcutCard 和 PluginCard
- **Grid_Utils**: 网格布局工具函数
- **Type_System**: TypeScript 类型定义系统

## Requirements

### Requirement 1: Modal 组件抽象

**User Story:** As a developer, I want to have a unified modal behavior system, so that I can reduce code duplication and maintain consistent modal interactions.

#### Acceptance Criteria

1. THE Modal_System SHALL provide a `useModalBehavior` hook that encapsulates dragging, fullscreen toggle, ESC key handling, and click-outside-to-close logic
2. WHEN `useModalBehavior` is used, THE Modal_System SHALL return position state, dragging handlers, fullscreen state, and close handlers
3. THE MacModal SHALL use `useModalBehavior` hook to implement its dragging and interaction logic
4. THE IframeModal SHALL use `useModalBehavior` hook to implement its dragging and interaction logic
5. WHEN refactoring is complete, THE Modal_System SHALL maintain all existing functionality including position memory for IframeModal
6. THE Modal_System SHALL reduce total lines of code by at least 100 lines through shared logic extraction

### Requirement 2: Settings Store 模块化迁移

**User Story:** As a developer, I want each settings store to be co-located with its corresponding feature module, so that the codebase has better cohesion and clearer module boundaries.

#### Acceptance Criteria

1. THE Settings_Store SHALL move `searchStore.ts` from `features/settings/store/` to `features/search/store/`
2. THE Settings_Store SHALL move `backgroundStore.ts` from `features/settings/store/` to `src/components/Background/store/`
3. THE Settings_Store SHALL keep `generalStore.ts` in `features/settings/store/` as it contains app-wide settings
4. WHEN stores are moved, THE Settings_Store SHALL update all import paths in dependent files
5. THE Search_Module SHALL export `useSearchStore` from `features/search/index.ts`
6. THE Background_Module SHALL export `useBackgroundStore` from `components/Background/index.ts`
7. WHEN refactoring is complete, THE Settings_Store SHALL maintain all existing functionality and localStorage keys

### Requirement 3: Card 组件抽象

**User Story:** As a developer, I want to have shared card behavior logic, so that I can reduce duplication between ShortcutCard and PluginCard.

#### Acceptance Criteria

1. THE Card_Component SHALL provide a `useCardBehavior` hook that encapsulates context menu state, batch edit selection, and layout validation logic
2. WHEN `useCardBehavior` is used, THE Card_Component SHALL return context menu handlers, selection state, and disabled layouts calculation
3. THE ShortcutCard SHALL use `useCardBehavior` hook to implement its interaction logic
4. THE PluginCard SHALL use `useCardBehavior` hook to implement its interaction logic
5. THE Card_Component SHALL provide shared styling constants for hover effects and container styles
6. WHEN refactoring is complete, THE Card_Component SHALL maintain all existing functionality including different context menu items for each card type

### Requirement 4: 类型定义简化

**User Story:** As a developer, I want to eliminate redundant type re-exports, so that I can reduce maintenance overhead.

#### Acceptance Criteria

1. THE Type_System SHALL remove the intermediate `src/plugins/types.ts` re-export file
2. WHEN plugins need types, THE Type_System SHALL import directly from `@/types`
3. THE Type_System SHALL update all plugin files to use direct imports from `@/types`
4. WHEN refactoring is complete, THE Type_System SHALL not break any existing type references

### Requirement 5: 网格工具函数位置调整

**User Story:** As a developer, I want grid utilities to be in a shared location, so that cross-module dependencies are clearer.

#### Acceptance Criteria

1. THE Grid_Utils SHALL be moved from `features/shortcuts/utils/gridUtils.ts` to `src/utils/gridUtils.ts`
2. WHEN Grid_Utils is moved, THE Grid_Utils SHALL update all import paths in dependent files
3. THE Grid_Utils SHALL export from `src/utils/index.ts` for convenient access
4. WHEN refactoring is complete, THE Grid_Utils SHALL maintain all existing functionality

### Requirement 6: 时钟模块内聚

**User Story:** As a developer, I want clock-related code to be co-located, so that the feature module is self-contained.

#### Acceptance Criteria

1. THE Clock_Module SHALL move `clockStore.ts` from `features/settings/store/` to `features/clock/store/`
2. WHEN clockStore is moved, THE Clock_Module SHALL update all import paths in dependent files
3. THE Clock_Module SHALL export clockStore from `features/clock/index.ts`
4. THE Settings_Module SHALL update its exports to no longer include clockStore
5. WHEN refactoring is complete, THE Clock_Module SHALL maintain all existing functionality

### Requirement 7: 右键菜单 Hook 统一

**User Story:** As a developer, I want consistent context menu handling across components, so that the codebase is more maintainable.

#### Acceptance Criteria

1. THE Card_Component SHALL use the global `useContextMenu` hook instead of local state management
2. WHEN `useContextMenu` is integrated into `useCardBehavior`, THE Card_Component SHALL provide the same functionality as before
3. THE Card_Component SHALL remove duplicate context menu state logic from ShortcutCard and PluginCard
4. WHEN refactoring is complete, THE Card_Component SHALL maintain all existing context menu functionality
