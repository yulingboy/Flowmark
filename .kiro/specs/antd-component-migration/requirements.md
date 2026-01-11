# Requirements Document

## Introduction

将项目中使用原生 HTML 元素和自定义组件的地方替换为 Ant Design 组件，以统一 UI 风格、提升开发效率和用户体验。MacModal 组件保持不变。

## Glossary

- **System**: 新标签页应用系统
- **TodoModal**: 待办事项弹窗组件
- **NotesModal**: 笔记弹窗组件
- **ContextMenu**: 右键上下文菜单组件
- **WeatherModal**: 天气弹窗组件
- **TodoCard**: 待办事项卡片组件
- **NotesCard**: 笔记卡片组件

## Requirements

### Requirement 1: TodoModal 组件 antd 替换

**User Story:** As a user, I want the todo modal to use consistent Ant Design components, so that I have a unified and polished user experience.

#### Acceptance Criteria

1. WHEN the TodoModal renders input fields, THE System SHALL use antd Input component instead of native input elements
2. WHEN the TodoModal renders the priority selector, THE System SHALL use antd Select component instead of native select element
3. WHEN the TodoModal renders todo checkboxes, THE System SHALL use antd Checkbox component instead of native checkbox inputs
4. WHEN the TodoModal renders action buttons, THE System SHALL use antd Button component instead of native button elements
5. WHEN the TodoModal displays an empty state, THE System SHALL use antd Empty component instead of custom SVG icon
6. WHEN the TodoModal renders the todo list, THE System SHALL use antd List component for consistent list styling
7. WHEN the TodoModal renders priority indicators, THE System SHALL use antd Tag or Badge component for visual consistency

### Requirement 2: NotesModal 组件 antd 替换

**User Story:** As a user, I want the notes modal to use consistent Ant Design components, so that I have a unified editing experience.

#### Acceptance Criteria

1. WHEN the NotesModal renders the search input, THE System SHALL use antd Input.Search component instead of native input
2. WHEN the NotesModal renders the content textarea, THE System SHALL use antd Input.TextArea component instead of native textarea
3. WHEN the NotesModal renders action buttons, THE System SHALL use antd Button component instead of native button elements
4. WHEN the NotesModal displays an empty state, THE System SHALL use antd Empty component instead of custom SVG icon
5. WHEN the NotesModal renders the notes list, THE System SHALL use antd List component for consistent list styling

### Requirement 3: ContextMenu 组件 antd 替换

**User Story:** As a user, I want the context menu to use Ant Design dropdown, so that I have a consistent menu experience across the application.

#### Acceptance Criteria

1. WHEN a context menu is triggered, THE System SHALL use antd Dropdown component instead of custom portal-based menu
2. WHEN the context menu displays menu items, THE System SHALL use antd Menu component for menu item rendering
3. WHEN the context menu has submenu items, THE System SHALL use antd Menu.SubMenu for nested menus
4. WHEN the context menu displays layout options, THE System SHALL maintain the current layout selector UI within the antd Menu structure

### Requirement 4: WeatherModal 组件 antd 替换

**User Story:** As a user, I want the weather modal to use consistent Ant Design components, so that I have a polished weather display.

#### Acceptance Criteria

1. WHEN the WeatherModal renders the refresh button, THE System SHALL use antd Button component instead of native button
2. WHEN the WeatherModal displays weather statistics, THE System SHALL use antd Card component for stat containers
3. WHEN the WeatherModal displays an empty state, THE System SHALL use antd Empty component

### Requirement 5: TodoCard 组件 antd 替换

**User Story:** As a user, I want the todo card to use consistent Ant Design components, so that the dashboard cards look polished.

#### Acceptance Criteria

1. WHEN the TodoCard displays todo count, THE System SHALL use antd Badge or Statistic component for number display
2. WHEN the TodoCard displays todo items, THE System SHALL use antd List component for item rendering
3. WHEN the TodoCard displays completion status, THE System SHALL use antd Progress or Tag component

### Requirement 6: NotesCard 组件 antd 替换

**User Story:** As a user, I want the notes card to use consistent Ant Design components, so that the dashboard cards look polished.

#### Acceptance Criteria

1. WHEN the NotesCard displays note count, THE System SHALL use antd Badge component for count indicator
2. WHEN the NotesCard displays note items, THE System SHALL use antd List or Card.Grid component for item rendering
