# Requirements Document

## Introduction

本需求文档描述了将项目中自定义实现的 UI 组件重构为 Ant Design 组件的功能需求。目标是统一项目的 UI 风格，提升代码可维护性，并利用 Ant Design 提供的成熟组件减少自定义代码量。

## Glossary

- **Refactor_System**: 负责将自定义组件重构为 Ant Design 组件的系统
- **HabitModal**: 习惯养成插件的弹窗组件
- **FoodPickerModal**: 今天吃什么插件的弹窗组件
- **PomodoroModal**: 番茄钟插件的弹窗组件
- **BatchEditToolbar**: 批量编辑工具栏组件
- **PluginManagerModal**: 插件管理器弹窗组件
- **Ant_Design**: 项目使用的 UI 组件库（版本 6）

## Requirements

### Requirement 1: HabitModal 组件重构

**User Story:** As a developer, I want to refactor HabitModal to use Ant Design components, so that the UI is consistent with the rest of the application.

#### Acceptance Criteria

1. WHEN the HabitModal renders an input field, THE Refactor_System SHALL use Ant Design Input component instead of native HTML input
2. WHEN the HabitModal renders action buttons, THE Refactor_System SHALL use Ant Design Button component instead of custom div elements
3. WHEN the HabitModal displays an empty state, THE Refactor_System SHALL use Ant Design Empty component
4. WHEN the HabitModal renders icon selection, THE Refactor_System SHALL use a grid layout with proper hover states
5. WHEN the HabitModal renders color selection, THE Refactor_System SHALL maintain the current visual appearance while using Ant Design styling patterns
6. THE Refactor_System SHALL preserve all existing functionality including add habit, toggle check, and remove habit

### Requirement 2: FoodPickerModal 组件重构

**User Story:** As a developer, I want to refactor FoodPickerModal to use Ant Design components, so that the category selection is more intuitive.

#### Acceptance Criteria

1. WHEN the FoodPickerModal renders category selection, THE Refactor_System SHALL use Ant Design Tag.CheckableTag components
2. WHEN the FoodPickerModal renders the spin button, THE Refactor_System SHALL use Ant Design Button component
3. THE Refactor_System SHALL preserve the gradient background and visual styling
4. THE Refactor_System SHALL maintain all existing functionality including spin animation and category toggle

### Requirement 3: PomodoroModal 组件重构

**User Story:** As a developer, I want to refactor PomodoroModal to use Ant Design components, so that the progress display is more polished.

#### Acceptance Criteria

1. WHEN the PomodoroModal displays timer progress, THE Refactor_System SHALL use Ant Design Progress component with type="circle"
2. WHEN the PomodoroModal renders control buttons, THE Refactor_System SHALL use Ant Design Button component with shape="circle"
3. THE Refactor_System SHALL preserve the gradient background based on timer status
4. THE Refactor_System SHALL maintain all existing functionality including start, pause, reset, and skip

### Requirement 4: BatchEditToolbar 组件重构

**User Story:** As a developer, I want to refactor BatchEditToolbar to use Ant Design components, so that the toolbar has consistent styling and better UX.

#### Acceptance Criteria

1. WHEN the BatchEditToolbar renders action buttons, THE Refactor_System SHALL use Ant Design Button component
2. WHEN the BatchEditToolbar renders the folder dropdown, THE Refactor_System SHALL use Ant Design Dropdown component
3. WHEN the BatchEditToolbar renders dividers, THE Refactor_System SHALL use Ant Design Divider component with type="vertical"
4. THE Refactor_System SHALL use Ant Design Space component for layout
5. THE Refactor_System SHALL preserve all existing functionality including select all, clear selection, move to folder, and delete

### Requirement 5: PluginManagerModal 组件重构

**User Story:** As a developer, I want to refactor PluginManagerModal to use Ant Design components, so that the plugin cards have consistent styling.

#### Acceptance Criteria

1. WHEN the PluginManagerModal renders plugin cards, THE Refactor_System SHALL use Ant Design Card component
2. WHEN the PluginManagerModal renders toggle buttons, THE Refactor_System SHALL use Ant Design Button component
3. WHEN the PluginManagerModal displays an empty state, THE Refactor_System SHALL use Ant Design Empty component
4. THE Refactor_System SHALL preserve all existing functionality including add and remove plugin from desktop

### Requirement 6: 保持视觉一致性

**User Story:** As a user, I want the refactored components to maintain visual consistency, so that the application looks cohesive.

#### Acceptance Criteria

1. WHEN components are refactored, THE Refactor_System SHALL preserve the existing color schemes and gradients
2. WHEN components are refactored, THE Refactor_System SHALL maintain responsive behavior
3. WHEN components are refactored, THE Refactor_System SHALL ensure accessibility compliance
4. THE Refactor_System SHALL use Tailwind CSS classes alongside Ant Design components where appropriate
