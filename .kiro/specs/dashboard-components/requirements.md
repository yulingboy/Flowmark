# Requirements Document

## Introduction

本功能为浏览器新标签页风格的看板界面，包含四个核心组件：时间组件、搜索框组件、快捷入口卡片组件和背景壁纸组件。界面采用半透明毛玻璃风格，提供实时时钟、全局搜索、网站快捷入口等功能。

## Glossary

- **Dashboard**: 看板主界面，承载所有组件的容器
- **Clock_Component**: 时间组件，显示实时时钟、日期、星期和农历
- **Search_Component**: 搜索框组件，提供全局搜索功能
- **Shortcut_Card**: 快捷入口卡片，展示网站/应用图标和名称
- **Shortcut_Folder**: 快捷入口文件夹，可容纳多个快捷入口
- **Background_Component**: 背景壁纸组件，提供全屏背景图

## Requirements

### Requirement 1: 时间与日期看板

**User Story:** As a user, I want to see real-time clock and date information, so that I can quickly check the current time without leaving the page.

#### Acceptance Criteria

1. THE Clock_Component SHALL display the current time in HH:MM:SS format with real-time updates every second
2. THE Clock_Component SHALL display the current Gregorian date in MM月DD日 format
3. THE Clock_Component SHALL display the current day of the week in Chinese (星期X)
4. THE Clock_Component SHALL display the Chinese lunar calendar date
5. THE Clock_Component SHALL use large, bold typography for the time display to enhance readability
6. THE Clock_Component SHALL center-align all date and time information vertically

### Requirement 2: 全局搜索功能

**User Story:** As a user, I want to search the web directly from the dashboard, so that I can quickly find information without navigating to a search engine first.

#### Acceptance Criteria

1. THE Search_Component SHALL provide a single-line text input field for search queries
2. THE Search_Component SHALL display a search engine icon on the left side of the input field
3. THE Search_Component SHALL show placeholder text indicating search functionality
4. WHEN a user presses Enter key in the search input, THE Search_Component SHALL navigate to the search engine with the entered query
5. THE Search_Component SHALL have a semi-transparent background with rounded corners
6. THE Search_Component SHALL have a fixed width appropriate for the dashboard layout

### Requirement 3: 快捷入口卡片

**User Story:** As a user, I want to access my frequently used websites quickly, so that I can navigate to them with a single click.

#### Acceptance Criteria

1. THE Shortcut_Card SHALL display a website icon and name in a vertical layout
2. THE Shortcut_Card SHALL have uniform icon dimensions (consistent size across all cards)
3. THE Shortcut_Card SHALL have rounded corners and subtle shadow for visual depth
4. WHEN a user clicks on a Shortcut_Card, THE Dashboard SHALL navigate to the target website URL
5. THE Shortcut_Card SHALL display cards in a horizontal row layout
6. THE Shortcut_Card SHALL support hover effects for visual feedback
7. THE Shortcut_Card SHALL use semi-transparent background styling

### Requirement 4: 快捷入口文件夹

**User Story:** As a user, I want to organize my shortcuts into folders, so that I can group related websites together.

#### Acceptance Criteria

1. THE Shortcut_Folder SHALL display as a card with a folder icon or grid preview of contained items
2. THE Shortcut_Folder SHALL have a customizable name label (default: "新文件夹")
3. THE Shortcut_Folder SHALL be displayed alongside regular Shortcut_Cards in the same row
4. WHEN a user clicks on a Shortcut_Folder, THE Dashboard SHALL expand to show contained shortcuts
5. THE Shortcut_Folder SHALL support containing multiple Shortcut_Cards
6. THE Shortcut_Folder SHALL have the same visual styling as regular Shortcut_Cards for consistency

### Requirement 5: 页面布局与交互

**User Story:** As a user, I want a clean and organized dashboard layout, so that I can easily find and use all features.

#### Acceptance Criteria

1. THE Dashboard SHALL use a centered vertical layout for all components
2. THE Dashboard SHALL position the Clock_Component at the top center of the viewport
3. THE Dashboard SHALL position the Search_Component below the Clock_Component
4. THE Dashboard SHALL position the Shortcut_Cards below the Search_Component in a horizontal grid
5. THE Dashboard SHALL ensure all UI elements float above the background with proper z-index
6. THE Dashboard SHALL use semi-transparent card styling with backdrop blur effect

### Requirement 6: 背景壁纸系统

**User Story:** As a user, I want a beautiful background image, so that the dashboard is visually appealing while remaining functional.

#### Acceptance Criteria

1. THE Background_Component SHALL display a full-screen background image covering the entire viewport
2. THE Background_Component SHALL ensure the background does not affect text readability
3. THE Background_Component SHALL use CSS to create visual separation between background and foreground elements
4. THE Background_Component SHALL support high-resolution images without distortion
5. THE Background_Component SHALL position the image to cover the viewport using object-fit: cover
6. THE Background_Component SHALL have a lower z-index than all foreground UI elements
