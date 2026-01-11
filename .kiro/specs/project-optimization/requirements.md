# Requirements Document

## Introduction

本功能为浏览器新标签页应用进行全面的代码优化和架构改进。通过消除代码重复、提取公共抽象、统一命名规范、增强可访问性和添加缺失功能，提升代码质量、可维护性和用户体验。

## Glossary

- **Icon_Library**: 图标库组件，集中管理所有 SVG 图标
- **Form_Components**: 表单组件库，提供可复用的表单控件
- **Toast_System**: 消息提示系统，提供用户操作反馈
- **Error_Boundary**: 错误边界组件，捕获并处理组件错误
- **Draggable_Modal_Hook**: 可拖拽弹窗 Hook，提供统一的拖拽逻辑
- **Constants_Module**: 常量模块，集中管理魔法数字和配置值
- **Keyboard_Shortcuts**: 键盘快捷键系统，提升操作效率
- **Accessibility_Features**: 无障碍功能，支持屏幕阅读器和键盘导航

## Requirements

### Requirement 1: 图标组件库

**User Story:** As a developer, I want a centralized icon library, so that I can reuse icons consistently across the application without code duplication.

#### Acceptance Criteria

1. THE Icon_Library SHALL export all SVG icons as named React components
2. THE Icon_Library SHALL support customizable size via className or size prop
3. THE Icon_Library SHALL support customizable color via className or color prop
4. WHEN an icon is used in multiple components THEN THE Icon_Library SHALL provide a single source of truth
5. THE Icon_Library SHALL include at least 20 icons currently scattered across App.tsx, ShortcutCard.tsx, BatchEditToolbar.tsx, and SettingsPanel.tsx

### Requirement 2: 可复用表单组件

**User Story:** As a developer, I want reusable form components, so that I can build consistent forms with less code duplication.

#### Acceptance Criteria

1. THE Form_Components SHALL include FormField component with label, input, and error message support
2. THE Form_Components SHALL include FormToggle component for boolean settings
3. THE Form_Components SHALL include FormSelect component for dropdown selections
4. THE Form_Components SHALL include FormSlider component for range inputs
5. WHEN a form component is used THEN THE Form_Components SHALL apply consistent styling
6. THE Form_Components SHALL support disabled state and validation feedback

### Requirement 3: 消息提示系统

**User Story:** As a user, I want to receive feedback when I perform actions, so that I know whether my actions succeeded or failed.

#### Acceptance Criteria

1. THE Toast_System SHALL display success, error, warning, and info messages
2. WHEN a toast is displayed THEN THE Toast_System SHALL auto-dismiss after 3 seconds by default
3. THE Toast_System SHALL support manual dismissal via close button
4. THE Toast_System SHALL stack multiple toasts vertically
5. WHEN a shortcut is added THEN THE Toast_System SHALL display a success message
6. WHEN a shortcut is deleted THEN THE Toast_System SHALL display a confirmation message
7. IF an error occurs THEN THE Toast_System SHALL display an error message with details

### Requirement 4: 错误边界

**User Story:** As a user, I want the application to handle errors gracefully, so that a component crash doesn't break the entire page.

#### Acceptance Criteria

1. THE Error_Boundary SHALL catch JavaScript errors in child components
2. WHEN an error is caught THEN THE Error_Boundary SHALL display a fallback UI
3. THE Error_Boundary SHALL provide a retry button to attempt recovery
4. THE Error_Boundary SHALL log error details to console for debugging
5. THE Error_Boundary SHALL wrap major sections: Clock, Search, Shortcuts, Settings

### Requirement 5: 可拖拽弹窗 Hook

**User Story:** As a developer, I want a reusable draggable modal hook, so that I can add drag functionality to modals without duplicating code.

#### Acceptance Criteria

1. THE Draggable_Modal_Hook SHALL provide position state management
2. THE Draggable_Modal_Hook SHALL provide mouse event handlers for drag operations
3. THE Draggable_Modal_Hook SHALL constrain dragging within viewport bounds
4. WHEN the hook is used in Modal.tsx and IframeModal.tsx THEN THE Draggable_Modal_Hook SHALL replace duplicated drag logic
5. THE Draggable_Modal_Hook SHALL support optional initial position

### Requirement 6: 常量模块

**User Story:** As a developer, I want centralized constants, so that magic numbers are documented and easy to modify.

#### Acceptance Criteria

1. THE Constants_Module SHALL define grid layout constants (columns, rows, unit, gap)
2. THE Constants_Module SHALL define search history limit (MAX_HISTORY_ITEMS)
3. THE Constants_Module SHALL define animation durations
4. THE Constants_Module SHALL define z-index layers
5. THE Constants_Module SHALL define default values for settings
6. WHEN a magic number is used THEN THE Constants_Module SHALL provide a named constant

### Requirement 7: 键盘快捷键

**User Story:** As a user, I want keyboard shortcuts, so that I can navigate and perform actions quickly without using the mouse.

#### Acceptance Criteria

1. WHEN a user presses Ctrl+K or Cmd+K THEN THE Search_Component SHALL receive focus
2. WHEN a user presses Escape THEN THE application SHALL close any open modal or popup
3. WHEN a user presses Ctrl+, or Cmd+, THEN THE Settings_Panel SHALL open
4. WHEN a user presses Ctrl+N or Cmd+N THEN THE AddShortcutModal SHALL open
5. THE Keyboard_Shortcuts SHALL not conflict with browser default shortcuts
6. THE Keyboard_Shortcuts SHALL be documented in the About settings tab

### Requirement 8: 确认对话框组件

**User Story:** As a user, I want styled confirmation dialogs, so that destructive actions require explicit confirmation.

#### Acceptance Criteria

1. THE ConfirmDialog SHALL replace browser's native confirm() calls
2. THE ConfirmDialog SHALL display a title, message, and action buttons
3. THE ConfirmDialog SHALL support customizable button labels
4. THE ConfirmDialog SHALL support danger styling for destructive actions
5. WHEN batch delete is triggered THEN THE ConfirmDialog SHALL ask for confirmation
6. THE ConfirmDialog SHALL be dismissible via Escape key or clicking outside

### Requirement 9: 代码结构优化

**User Story:** As a developer, I want consistent code organization, so that the codebase is easier to navigate and maintain.

#### Acceptance Criteria

1. THE Shortcuts folder SHALL organize files into components/, hooks/, and utils/ subdirectories
2. THE component naming SHALL follow <Feature><Type> pattern consistently
3. THE hook naming SHALL follow use<Feature><Purpose> pattern consistently
4. THE type naming SHALL use consistent suffixes (Type or Interface)
5. WHEN a component exceeds 150 lines THEN THE component SHALL be refactored into smaller parts
6. THE index.ts files SHALL provide clean public APIs for each feature folder

