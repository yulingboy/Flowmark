# Requirements Document

## Introduction

本文档定义了浏览器起始页项目的目录结构重构需求。目标是优化代码组织，统一类型定义，规范 hooks 和 utils 的位置，提升项目的可维护性和可扩展性。

## Glossary

- **Refactoring_System**: 执行目录结构重构的系统
- **Feature_Module**: 按功能域组织的代码模块，包含该功能的 UI、逻辑、hooks 和类型
- **Common_Component**: 可被多个功能模块复用的纯 UI 组件
- **Global_Hook**: 不依赖特定功能域、可全局复用的 React Hook
- **Type_Definition**: TypeScript 类型、接口和类型守卫的定义

## Requirements

### Requirement 1: 统一类型定义

**User Story:** As a developer, I want all type definitions to be centralized, so that I can avoid duplicate definitions and easily find type information.

#### Acceptance Criteria

1. WHEN the Refactoring_System consolidates types THEN it SHALL merge `src/types/index.ts` and `src/plugins/types.ts` into a unified type system
2. WHEN duplicate types exist (e.g., CardSize, Position) THEN the Refactoring_System SHALL keep only one definition and update all imports
3. THE Refactoring_System SHALL organize types into logical groups: core types, plugin types, component types
4. WHEN a type is only used within a single feature THEN the Refactoring_System SHALL co-locate it with that feature

### Requirement 2: 规范 Hooks 位置

**User Story:** As a developer, I want a consistent pattern for hook organization, so that I can quickly locate and reuse hooks.

#### Acceptance Criteria

1. THE Refactoring_System SHALL move truly global hooks to `src/hooks/`
2. WHEN a hook is only used by a single feature THEN the Refactoring_System SHALL co-locate it within that feature's directory
3. THE Refactoring_System SHALL consolidate `src/components/Shortcuts/hooks/` into the shortcuts feature module
4. WHEN moving hooks THEN the Refactoring_System SHALL update all import paths accordingly

### Requirement 3: 规范 Utils 位置

**User Story:** As a developer, I want utility functions organized consistently, so that I can find and reuse them easily.

#### Acceptance Criteria

1. THE Refactoring_System SHALL keep global utilities in `src/utils/`
2. WHEN a utility is only used by a single feature THEN the Refactoring_System SHALL co-locate it within that feature's directory
3. THE Refactoring_System SHALL consolidate `src/components/Shortcuts/utils/` into the shortcuts feature module
4. WHEN moving utilities THEN the Refactoring_System SHALL update all import paths accordingly

### Requirement 4: 采用 Features 模式重组代码

**User Story:** As a developer, I want code organized by feature domain, so that related code is co-located and easier to maintain.

#### Acceptance Criteria

1. THE Refactoring_System SHALL create a `src/features/` directory for feature modules
2. WHEN reorganizing THEN the Refactoring_System SHALL create feature modules for: clock, search, shortcuts, settings, plugins
3. WHEN a feature module is created THEN it SHALL contain: components, hooks (if feature-specific), utils (if feature-specific), types (if feature-specific), and an index.ts barrel export
4. THE Refactoring_System SHALL move `src/components/Clock/` to `src/features/clock/`
5. THE Refactoring_System SHALL move `src/components/Search/` to `src/features/search/`
6. THE Refactoring_System SHALL move `src/components/Shortcuts/` to `src/features/shortcuts/`
7. THE Refactoring_System SHALL move `src/components/Settings/` to `src/features/settings/`
8. THE Refactoring_System SHALL move `src/plugins/` to `src/features/plugins/`

### Requirement 5: 保留通用组件目录

**User Story:** As a developer, I want pure UI components that are reused across features to remain in a common location.

#### Acceptance Criteria

1. THE Refactoring_System SHALL keep `src/components/common/` for shared UI components
2. THE Refactoring_System SHALL keep `src/components/Background/` as it is a layout-level component
3. WHEN a component is used by multiple features THEN it SHALL remain in `src/components/`

### Requirement 6: 更新导入路径

**User Story:** As a developer, I want all import paths to be updated correctly after refactoring, so that the application continues to work.

#### Acceptance Criteria

1. WHEN files are moved THEN the Refactoring_System SHALL update all import statements in affected files
2. THE Refactoring_System SHALL update path aliases in `tsconfig.json` if needed
3. WHEN refactoring is complete THEN the application SHALL build without errors
4. WHEN refactoring is complete THEN all existing functionality SHALL work as before

### Requirement 7: 保持向后兼容的导出

**User Story:** As a developer, I want barrel exports to maintain compatibility, so that existing imports don't break during gradual migration.

#### Acceptance Criteria

1. WHEN creating feature modules THEN the Refactoring_System SHALL create index.ts barrel exports
2. THE Refactoring_System SHALL ensure `src/types/index.ts` re-exports all necessary types
3. THE Refactoring_System SHALL ensure `src/hooks/index.ts` exports all global hooks
