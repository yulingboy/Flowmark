# Requirements Document

## Introduction

本文档定义了 Flowmark 浏览器扩展的网页剪藏功能需求。该功能允许用户在浏览网页时，将选中的文本或整个页面内容剪藏保存为笔记，与现有的笔记系统无缝集成。

## Glossary

- **Clipper**: 网页剪藏服务，负责从网页中提取内容并创建笔记
- **Content_Script**: 注入到网页中的脚本，负责获取页面内容和用户选中的文本
- **Background_Service_Worker**: Chrome 扩展的后台服务，负责处理右键菜单和消息通信
- **Context_Menu**: Chrome 浏览器的右键上下文菜单
- **Clip_Data**: 剪藏数据对象，包含标题、URL、选中文本等信息
- **Notes_Store**: 现有的笔记存储系统，使用 chrome.storage.local 持久化

## Requirements

### Requirement 1: 右键菜单剪藏

**User Story:** As a user, I want to clip web content via right-click context menu, so that I can quickly save interesting content while browsing.

#### Acceptance Criteria

1. WHEN the extension is installed, THE Background_Service_Worker SHALL create context menu items for clipping
2. WHEN a user right-clicks on a webpage without text selection, THE Context_Menu SHALL display "剪藏整个页面" option
3. WHEN a user right-clicks with text selected, THE Context_Menu SHALL display "剪藏选中内容" option
4. WHEN a user clicks "剪藏整个页面", THE Clipper SHALL extract the page title, URL, and main content
5. WHEN a user clicks "剪藏选中内容", THE Clipper SHALL extract the page title, URL, and selected text

### Requirement 2: Content Script 内容提取

**User Story:** As a user, I want the clipper to accurately extract web content, so that my clipped notes contain the information I need.

#### Acceptance Criteria

1. WHEN the Content_Script receives a clip request, THE Content_Script SHALL return the current page title
2. WHEN the Content_Script receives a clip request, THE Content_Script SHALL return the current page URL
3. WHEN clipping selected text, THE Content_Script SHALL return the exact text the user has selected
4. WHEN clipping the entire page, THE Content_Script SHALL extract the main content area text
5. IF the page has no selectable content, THEN THE Content_Script SHALL return an empty content string

### Requirement 3: 剪藏数据格式化

**User Story:** As a user, I want my clipped content to be formatted as readable notes, so that I can easily review them later.

#### Acceptance Criteria

1. WHEN creating a clipped note, THE Clipper SHALL format the note title as the page title
2. WHEN creating a clipped note, THE Clipper SHALL include the source URL in the note content
3. WHEN creating a clipped note from selected text, THE Clipper SHALL include the selected text as quoted content
4. WHEN creating a clipped note from entire page, THE Clipper SHALL include the extracted content as the note body
5. THE Clipper SHALL format the note content in Markdown format

### Requirement 4: 笔记系统集成

**User Story:** As a user, I want clipped content to appear in my existing notes, so that I can manage all my notes in one place.

#### Acceptance Criteria

1. WHEN a clip is created, THE Clipper SHALL save it using the existing Notes_Store
2. WHEN a clip is saved, THE Notes_Store SHALL sync the new note across all extension pages
3. WHEN a clip is saved, THE Clipper SHALL display a success notification to the user
4. IF saving fails, THEN THE Clipper SHALL display an error notification with the failure reason

### Requirement 5: 用户反馈

**User Story:** As a user, I want to receive feedback when clipping content, so that I know whether the operation succeeded.

#### Acceptance Criteria

1. WHEN a clip operation starts, THE Clipper SHALL display a brief loading indicator
2. WHEN a clip operation succeeds, THE Clipper SHALL display a success notification
3. WHEN a clip operation fails, THE Clipper SHALL display an error notification
4. THE notification SHALL automatically dismiss after 3 seconds

### Requirement 6: 快捷键支持

**User Story:** As a user, I want to use keyboard shortcuts to clip content, so that I can clip faster without using the mouse.

#### Acceptance Criteria

1. WHEN the user presses the configured shortcut key, THE Clipper SHALL clip the selected text if any
2. WHEN the user presses the configured shortcut key without selection, THE Clipper SHALL clip the entire page
3. THE extension SHALL use Alt+Shift+C as the default shortcut key
4. WHERE the shortcut conflicts with other extensions, THE user SHALL be able to change it in Chrome settings

### Requirement 7: DOM 节点选择剪藏

**User Story:** As a user, I want to visually select a specific area of the page to clip, so that I can precisely capture the content I need.

#### Acceptance Criteria

1. WHEN the user activates element selection mode, THE Content_Script SHALL enable visual element picker
2. WHILE element selection mode is active, THE Content_Script SHALL highlight the DOM element under the cursor
3. WHEN the user hovers over an element, THE Content_Script SHALL display a visual outline around that element
4. WHEN the user clicks on a highlighted element, THE Clipper SHALL extract the content of that element
5. WHEN the user presses Escape key, THE Content_Script SHALL exit element selection mode
6. THE Context_Menu SHALL include "选择区域剪藏" option to activate element selection mode
7. WHILE element selection mode is active, THE Content_Script SHALL prevent default click behavior on the page
