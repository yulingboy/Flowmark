# Implementation Plan: Ant Design Component Migration

## Overview

将项目中的原生 HTML 元素和自定义组件替换为 Ant Design 组件，按组件独立性进行渐进式替换。

## Tasks

- [x] 1. TodoModal 组件 antd 替换
  - [x] 1.1 替换搜索框和输入框为 antd Input
    - 将搜索待办、新建列表输入、待办输入替换为 `Input` 组件
    - _Requirements: 1.1_
  - [x] 1.2 替换优先级选择器为 antd Select
    - 将原生 select 替换为 `Select` 组件
    - _Requirements: 1.2_
  - [x] 1.3 替换复选框为 antd Checkbox
    - 将待办完成状态的 checkbox 替换为 `Checkbox` 组件
    - _Requirements: 1.3_
  - [x] 1.4 替换按钮为 antd Button
    - 将所有原生 button 替换为 `Button` 组件
    - _Requirements: 1.4_
  - [x] 1.5 替换空状态为 antd Empty
    - 将自定义 EmptyIcon 替换为 `Empty` 组件
    - _Requirements: 1.5_
  - [x] 1.6 替换待办列表为 antd List
    - 将自定义列表 div 替换为 `List` 组件
    - _Requirements: 1.6_
  - [x] 1.7 替换优先级指示器为 antd Tag
    - 将优先级圆点替换为 `Tag` 组件
    - _Requirements: 1.7_

- [x] 2. NotesModal 组件 antd 替换
  - [x] 2.1 替换搜索框为 antd Input.Search
    - 将搜索笔记输入框替换为 `Input.Search` 组件
    - _Requirements: 2.1_
  - [x] 2.2 替换文本域为 antd Input.TextArea
    - 将笔记内容 textarea 替换为 `Input.TextArea` 组件
    - _Requirements: 2.2_
  - [x] 2.3 替换按钮为 antd Button
    - 将所有原生 button 替换为 `Button` 组件
    - _Requirements: 2.3_
  - [x] 2.4 替换空状态为 antd Empty
    - 将自定义 EmptyFolderIcon 替换为 `Empty` 组件
    - _Requirements: 2.4_
  - [x] 2.5 替换笔记列表为 antd List
    - 将自定义列表 div 替换为 `List` 组件
    - _Requirements: 2.5_

- [x] 3. Checkpoint - 验证 Modal 组件替换
  - 确保 TodoModal 和 NotesModal 功能正常，如有问题请反馈

- [x] 4. ContextMenu 组件 antd 替换
  - [x] 4.1 使用 antd Dropdown 替换自定义菜单容器
    - 将 portal-based 菜单替换为 `Dropdown` 组件
    - _Requirements: 3.1_
  - [x] 4.2 使用 antd Menu 替换菜单项
    - 将自定义菜单项替换为 `Menu` 组件
    - _Requirements: 3.2_
  - [x] 4.3 使用 antd Menu.SubMenu 处理子菜单
    - 将子菜单逻辑替换为 `Menu` 的 children 结构
    - _Requirements: 3.3_
  - [x] 4.4 保持布局选择器功能
    - 在 antd Menu 结构中保持布局选择器 UI
    - _Requirements: 3.4_

- [x] 5. WeatherModal 组件 antd 替换
  - [x] 5.1 替换刷新按钮为 antd Button
    - 将原生 button 替换为 `Button` 组件，支持 loading 状态
    - _Requirements: 4.1_
  - [x] 5.2 替换统计卡片为 antd Card
    - 将自定义统计 div 替换为 `Card` 组件
    - _Requirements: 4.2_
  - [x] 5.3 添加空状态 antd Empty
    - 无数据时显示 `Empty` 组件
    - _Requirements: 4.3_

- [x] 6. Checkpoint - 验证 ContextMenu 和 WeatherModal 替换
  - 确保右键菜单和天气弹窗功能正常，如有问题请反馈

- [x] 7. TodoCard 组件 antd 替换
  - [x] 7.1 替换数量显示为 antd Badge
    - 将待办数量显示替换为 `Badge` 组件
    - _Requirements: 5.1_
  - [x] 7.2 替换待办列表为 antd List
    - 将待办项展示替换为 `List` 组件
    - _Requirements: 5.2_
  - [x] 7.3 替换完成状态为 antd Tag
    - 将完成状态显示替换为 `Tag` 组件
    - _Requirements: 5.3_

- [x] 8. NotesCard 组件 antd 替换
  - [x] 8.1 替换数量显示为 antd Badge
    - 将笔记数量显示替换为 `Badge` 组件
    - _Requirements: 6.1_
  - [x] 8.2 替换笔记列表为 antd List
    - 将笔记项展示替换为 `List` 组件
    - _Requirements: 6.2_

- [x] 9. Final Checkpoint - 完整功能验证
  - 确保所有组件功能正常，UI 样式一致，如有问题请反馈

## Notes

- 每个任务独立完成，便于测试和回滚
- 替换过程中保持功能不变，仅更换 UI 组件
- 如遇样式冲突，使用 className 或 style 进行调整
