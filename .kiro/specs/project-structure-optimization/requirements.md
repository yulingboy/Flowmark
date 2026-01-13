# Requirements Document

## Introduction

本文档定义了 AI Nav 项目结构优化的需求。项目当前采用 React + TypeScript + Vite 技术栈，已有较好的模块化基础，但存在一些结构上的不一致性和可优化空间。本次优化旨在提升代码组织的一致性、可维护性和开发体验。

## Glossary

- **Feature_Module**: 功能模块，位于 `src/features/` 下的独立功能单元，包含组件、store、hooks、utils 等
- **Plugin_Module**: 插件模块，位于 `src/plugins/builtin/` 下的可插拔功能单元
- **Barrel_Export**: 桶导出文件，即 `index.ts`，用于统一导出模块的公共 API
- **Common_Component**: 通用组件，位于 `src/components/` 下的可复用 UI 组件
- **Store**: Zustand 状态管理单元

## Requirements

### Requirement 1: 统一 Feature 模块结构

**User Story:** As a developer, I want consistent feature module structure, so that I can quickly understand and navigate any feature module.

#### Acceptance Criteria

1. WHEN a new Feature_Module is created, THE Feature_Module SHALL follow the standard directory structure: `components/`, `store/`, `hooks/`, `utils/`, `types.ts`, `index.ts`
2. WHEN a Feature_Module has only one component, THE Feature_Module SHALL still place it in `components/` directory for consistency
3. WHEN a Feature_Module exports public APIs, THE Barrel_Export SHALL organize exports by category: Types, Components, Hooks, Utils, Store
4. IF a Feature_Module lacks a required subdirectory, THEN THE Feature_Module SHALL create empty directories only when needed

### Requirement 2: 优化 Components 目录组织

**User Story:** As a developer, I want well-organized common components, so that I can easily find and reuse UI components.

#### Acceptance Criteria

1. THE Common_Component directory SHALL group related components into subdirectories (e.g., `Modal/`, `Menu/`, `Image/`)
2. WHEN a Common_Component has associated hooks or utilities, THE Common_Component SHALL co-locate them in the same subdirectory
3. THE Barrel_Export for components SHALL maintain backward compatibility with existing import paths
4. WHEN components share types, THE types SHALL be defined in a shared `types.ts` at the component group level

### Requirement 3: 统一 Store 命名和结构

**User Story:** As a developer, I want consistent store patterns, so that I can predictably work with state management across features.

#### Acceptance Criteria

1. WHEN a Store is created, THE Store file SHALL be named `store.ts` (not `xxxStore.ts`) within the `store/` directory
2. WHEN a Store has types, THE Store types SHALL be defined in `store/types.ts`
3. THE Store hook SHALL be named `use{Feature}Store` (e.g., `useShortcutsStore`)
4. WHEN a Store needs initialization logic, THE Store SHALL separate it into `store/defaults.ts`

### Requirement 4: 优化 Hooks 导出结构

**User Story:** As a developer, I want organized global hooks, so that I can easily discover and use available hooks.

#### Acceptance Criteria

1. THE global hooks directory SHALL group related hooks by functionality
2. WHEN a hook has associated types, THE types SHALL be co-located in `hooks/types.ts`
3. THE Barrel_Export for hooks SHALL export both hooks and their types
4. WHEN hooks are feature-specific, THE hooks SHALL remain in the feature module, not global hooks

### Requirement 5: 统一 Plugin 模块结构

**User Story:** As a developer, I want consistent plugin structure, so that I can quickly create new plugins following established patterns.

#### Acceptance Criteria

1. WHEN a Plugin_Module is created, THE Plugin_Module SHALL follow the standard structure: `index.ts`, `{Name}Card.tsx`, `{Name}Modal.tsx` (optional), `use{Name}.ts` (optional), `types.ts` (optional)
2. THE Plugin_Module entry file SHALL export a single `{name}Plugin` object
3. WHEN a Plugin_Module has styles, THE styles SHALL be co-located in the plugin directory (e.g., `{name}.css`)
4. IF a Plugin_Module has shared utilities, THEN THE utilities SHALL be placed in `src/plugins/utils/` for cross-plugin reuse

### Requirement 6: 清理冗余和未使用代码

**User Story:** As a developer, I want a clean codebase without dead code, so that I can maintain the project more easily.

#### Acceptance Criteria

1. WHEN an empty directory exists, THE directory SHALL be removed unless it serves as a placeholder for future content
2. WHEN duplicate type definitions exist, THE types SHALL be consolidated to a single source of truth
3. WHEN re-exports exist for backward compatibility, THE re-exports SHALL include deprecation comments with migration guidance
4. IF unused exports are detected, THEN THE exports SHALL be removed or marked for deprecation

### Requirement 7: 优化类型定义组织

**User Story:** As a developer, I want well-organized type definitions, so that I can easily find and use types across the codebase.

#### Acceptance Criteria

1. THE global types directory SHALL contain only cross-cutting types used by multiple features
2. WHEN a type is feature-specific, THE type SHALL be defined in the feature's `types.ts`
3. THE Barrel_Export for types SHALL re-export feature types for convenience
4. WHEN types have circular dependencies, THE types SHALL be restructured to eliminate cycles

