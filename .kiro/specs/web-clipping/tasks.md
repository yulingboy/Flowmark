# Implementation Plan: Web Clipping

## Overview

本实现计划将网页剪藏功能分解为增量式的编码任务。从类型定义和基础设施开始，逐步实现内容提取、元素选择、消息通信，最后完成集成和测试。

## Tasks

- [x] 1. 类型定义和项目配置
  - [x] 1.1 创建剪藏相关类型定义
    - 在 `src/types/clipper.ts` 中定义 ClipType、ClipData、ClipRequest 等类型
    - 定义消息类型联合 ClipperMessage
    - _Requirements: 1.4, 1.5, 2.1-2.4_
  
  - [x] 1.2 更新 Manifest 配置
    - 添加 `contextMenus`、`activeTab`、`scripting` 权限
    - 添加 `commands` 配置（Alt+Shift+C 快捷键）
    - 添加 `content_scripts` 配置
    - _Requirements: 1.1, 6.3_

- [x] 2. 内容提取模块
  - [x] 2.1 实现 ContentExtractor
    - 创建 `src/content/extractor.ts`
    - 实现 getTitle()、getUrl()、getSelection()、getPageContent()、getElementContent() 方法
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  
  - [ ]* 2.2 编写 ContentExtractor 属性测试
    - **Property 2: 选中文本准确性**
    - **Property 3: 页面内容提取非空性**
    - **验证: 需求 2.3, 2.4**

- [x] 3. 笔记格式化模块
  - [x] 3.1 实现 NoteFormatter
    - 创建 `src/utils/noteFormatter.ts`
    - 实现 format() 方法，将 ClipData 转换为 Markdown 格式笔记
    - 包含来源 URL、剪藏时间、引用块格式
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [ ]* 3.2 编写 NoteFormatter 属性测试
    - **Property 4: 笔记格式化完整性**
    - **验证: 需求 3.1, 3.2, 3.3, 3.4, 3.5**

- [x] 4. Checkpoint - 确保基础模块测试通过
  - 运行 `pnpm test` 确保所有测试通过
  - 如有问题请询问用户

- [x] 5. 元素选择器模块
  - [x] 5.1 实现 ElementPicker 类
    - 创建 `src/content/elementPicker.ts`
    - 实现 activate()、deactivate()、isActive() 方法
    - 实现鼠标移动时的元素高亮逻辑
    - 实现点击选择和 Escape 取消逻辑
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.7_
  
  - [x] 5.2 创建元素选择器样式
    - 创建 `src/content/elementPicker.css`
    - 定义高亮覆盖层样式 `.flowmark-picker-overlay`
    - 定义提示文字样式 `.flowmark-picker-tooltip`
    - _Requirements: 7.2, 7.3_
  
  - [ ]* 5.3 编写 ElementPicker 属性测试
    - **Property 6: 元素高亮跟随**
    - **Property 8: 选择模式点击拦截**
    - **验证: 需求 7.2, 7.3, 7.7**

- [x] 6. 页面通知组件
  - [x] 6.1 实现页面内通知组件
    - 创建 `src/content/notification.ts`
    - 实现 showSuccess()、showError() 方法
    - 实现 3 秒自动消失逻辑
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 7. Content Script 主入口
  - [x] 7.1 实现 ClipperService
    - 创建 `src/content/clipperService.ts`
    - 实现 clipSelection()、clipPage()、clipElement() 方法
    - 协调 ContentExtractor 和 ElementPicker
    - _Requirements: 1.4, 1.5, 7.4_
  
  - [x] 7.2 创建 Content Script 入口
    - 创建 `src/content/index.ts`
    - 设置消息监听器处理来自 Background 的请求
    - 初始化 ClipperService
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [ ]* 7.3 编写 ClipperService 属性测试
    - **Property 1: 剪藏数据完整性**
    - **验证: 需求 1.4, 1.5, 2.1, 2.2**

- [x] 8. Checkpoint - 确保 Content Script 模块测试通过
  - 运行 `pnpm test` 确保所有测试通过
  - 如有问题请询问用户

- [x] 9. Background Service Worker 扩展
  - [x] 9.1 实现 ClipperHandler
    - 创建 `src/background/clipperHandler.ts`
    - 实现 initContextMenus() 创建右键菜单
    - 实现 handleClipRequest() 处理剪藏请求
    - 实现 saveClip() 保存笔记到 Notes Store
    - _Requirements: 1.1, 1.2, 1.3, 4.1, 4.3, 4.4_
  
  - [x] 9.2 更新 Background 入口
    - 修改 `src/background/index.ts`
    - 集成 ClipperHandler
    - 添加快捷键命令监听
    - _Requirements: 1.1, 6.1, 6.2_
  
  - [ ]* 9.3 编写 ClipperHandler 单元测试
    - 测试右键菜单创建
    - 测试消息处理流程
    - **Property 5: 笔记存储集成**
    - **验证: 需求 1.1, 4.1**

- [x] 10. Vite 构建配置
  - [x] 10.1 配置 Content Script 构建
    - 更新 `vite.config.ts` 添加 content script 入口
    - 配置 CSS 提取
    - _Requirements: 2.1_
  
  - [x] 10.2 更新构建脚本
    - 修改 `scripts/build-extension.js` 处理 content script 产物
    - 确保 manifest.json 正确引用构建产物
    - _Requirements: 1.1_

- [x] 11. Checkpoint - 确保构建成功
  - 运行 `pnpm build` 确保构建成功
  - 在 Chrome 中加载扩展测试基本功能
  - 如有问题请询问用户

- [ ] 12. 集成测试
  - [ ]* 12.1 编写 E2E 测试
    - 测试右键菜单剪藏选中文本
    - 测试右键菜单剪藏整个页面
    - 测试元素选择模式剪藏
    - 测试快捷键剪藏
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 6.1, 6.2, 7.1_

- [ ] 13. Final Checkpoint - 确保所有测试通过
  - 运行 `pnpm test` 确保单元测试通过
  - 运行 `pnpm test:e2e` 确保 E2E 测试通过
  - 如有问题请询问用户

## Notes

- 标记 `*` 的任务为可选测试任务，可跳过以加快 MVP 开发
- 每个任务都引用了具体的需求条款以确保可追溯性
- Checkpoint 任务用于增量验证，确保每个阶段的代码质量
- 属性测试验证通用正确性属性，单元测试验证具体示例和边界情况
