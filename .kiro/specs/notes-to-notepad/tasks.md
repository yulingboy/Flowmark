# Implementation Plan: 记事本插件优化

## Overview

将"便签"插件重命名为"记事本"，并优化页面样式，实现现代化的空状态界面和笔记卡片设计。

## Tasks

- [x] 1. 更新插件元数据
  - 修改 `src/plugins/builtin/notes/index.ts`
  - 将 name 从"便签"改为"记事本"
  - 更新 description 为新的描述文案
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 2. 实现空状态界面
  - [x] 2.1 在 NotesWidget.tsx 中添加 EmptyState 组件
    - 创建 SVG 插图（蓝色信封+文档风格）
    - 添加"欢迎使用记事本"标题
    - 添加副标题说明文案
    - 添加蓝色渐变"新建笔记"按钮
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 3. 优化 NotesModal 弹窗样式
  - [x] 3.1 更新弹窗头部样式
    - 将标题从"便签"改为"记事本"
    - 优化"新建"按钮为蓝色渐变圆角样式
    - _Requirements: 1.1, 4.1, 4.2, 4.3_
  - [x] 3.2 优化笔记卡片样式
    - 添加圆角和阴影效果
    - 添加时间显示
    - 优化悬停时的操作按钮显示
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  - [x] 3.3 集成空状态组件
    - 当没有笔记时显示 EmptyState
    - 点击"新建笔记"按钮创建新笔记
    - _Requirements: 2.1_

- [x] 4. 优化 NotesCard 卡片视图样式
  - [x] 4.1 更新 1x1 尺寸卡片
    - 将"便签"改为"笔记"
    - _Requirements: 1.1_
  - [x] 4.2 更新 2x2 和 2x4 尺寸卡片
    - 将"便签"改为"笔记"
    - 优化卡片样式
    - _Requirements: 1.1, 5.4_

- [x] 5. Checkpoint - 验证功能
  - 确保所有文本已从"便签"改为"记事本"
  - 确保空状态界面正确显示
  - 确保笔记卡片样式符合设计
  - 如有问题请告知

- [ ]* 6. 编写单元测试
  - [ ]* 6.1 测试插件元数据
    - 验证 name 为"记事本"
    - 验证 description 正确
    - _Requirements: 1.2, 1.3_
  - [ ]* 6.2 测试空状态组件
    - 验证标题和副标题文本
    - 验证按钮存在且可点击
    - _Requirements: 2.2, 2.3, 2.4_

- [ ]* 7. 编写属性测试
  - [ ]* 7.1 Property 1: 笔记时间显示一致性
    - **Property 1: 时间显示一致性**
    - **Validates: Requirements 3.3**
  - [ ]* 7.2 Property 2: 响应式布局正确性
    - **Property 2: 响应式布局正确性**
    - **Validates: Requirements 5.4**

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- 主要改动集中在 index.ts 和 NotesWidget.tsx 两个文件
- 使用 Tailwind CSS 实现所有样式
