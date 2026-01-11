# Implementation Plan: Resize Boundary Check

## Overview

实现网格项目尺寸调整时的边界检查功能，防止项目超出网格边界。

## Tasks

- [x] 1. 实现边界检查工具函数
  - [x] 1.1 在 `gridUtils.ts` 中添加 `getValidSizesForPosition` 函数
    - 接收参数：col, row, columns, rows, currentSize
    - 返回有效的尺寸数组
    - 处理边界情况（无效位置、无效网格尺寸）
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [ ]* 1.2 编写属性测试：有效尺寸不超出边界
    - **Property 1: Valid sizes fit within boundaries**
    - **Validates: Requirements 1.1, 1.2, 1.3, 2.2, 2.3**

  - [ ]* 1.3 编写属性测试：当前尺寸始终包含
    - **Property 2: Current size always included**
    - **Validates: Requirements 1.5**

- [x] 2. 更新 ContextMenu 组件支持禁用选项
  - [x] 2.1 修改 `ContextMenuItem` 接口添加 `disabledLayouts` 字段
    - _Requirements: 1.4_

  - [x] 2.2 修改布局选项渲染逻辑，禁用不可用的尺寸按钮
    - 添加禁用样式（降低透明度、禁用点击）
    - _Requirements: 1.4_

- [x] 3. 更新卡片组件集成边界检查
  - [x] 3.1 修改 `ShortcutCard` 组件
    - 在右键菜单中计算并传递 `disabledLayouts`
    - 需要获取项目当前位置信息
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 3.2 修改 `PluginCard` 组件
    - 在右键菜单中计算并传递 `disabledLayouts`
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 3.3 修改 `ShortcutFolder` 组件
    - 在右键菜单中计算并传递 `disabledLayouts`
    - _Requirements: 1.1, 1.2, 1.3_

- [x] 4. Checkpoint - 确保所有测试通过
  - 确保所有测试通过，如有问题请询问用户

## Notes

- 标记 `*` 的任务为可选任务，可跳过以加快 MVP 开发
- 每个任务都引用了具体的需求以便追溯
- 属性测试验证核心正确性属性
