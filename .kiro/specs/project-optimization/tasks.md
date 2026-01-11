# Implementation Plan: Project Optimization

## Overview

实现浏览器新标签页应用的代码优化和架构改进，包括创建图标库、表单组件、Toast 系统、错误边界、可拖拽 Hook、常量模块、键盘快捷键和确认对话框，以及代码结构重组。

## Tasks

- [x] 1. 创建常量模块
  - [x] 1.1 创建 `src/constants.ts` 文件
    - 定义 GRID 常量（COLUMNS, ROWS, UNIT, GAP）
    - 定义 Z_INDEX 层级常量
    - 定义 ANIMATION 时长常量
    - 定义 SEARCH 配置常量（MAX_HISTORY_ITEMS）
    - 定义 TOAST 配置常量
    - 定义 DEFAULTS 默认值常量
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  - [x] 1.2 更新现有代码使用常量
    - 更新 App.tsx 使用 GRID 常量
    - 更新 searchHistory.ts 使用 SEARCH.MAX_HISTORY_ITEMS
    - 更新 settingsStore.ts 使用 DEFAULTS 常量
    - _Requirements: 6.6_

- [x] 2. 创建图标库
  - [x] 2.1 创建 `src/components/common/icons.tsx` 文件
    - 定义 IconProps 接口（className, size, color）
    - 从 App.tsx 提取图标：AddIcon, FolderIcon, WallpaperIcon, RefreshIcon, EditIcon, SettingsIcon
    - 从 ShortcutCard.tsx 提取图标：OpenTabIcon, MoveIcon, LayoutIcon, DeleteIcon
    - 从 BatchEditToolbar.tsx 提取图标：CloseIcon
    - 添加通用图标：CheckIcon, ChevronRightIcon, UploadIcon, LinkIcon, InfoIcon, WarningIcon, ErrorIcon, SuccessIcon, SearchIcon
    - _Requirements: 1.1, 1.2, 1.3, 1.5_
  - [ ]* 2.2 编写图标组件属性测试
    - **Property 1: Icon Props Application**
    - **Validates: Requirements 1.2, 1.3**
  - [x] 2.3 更新现有组件使用图标库
    - 更新 App.tsx 导入图标
    - 更新 ShortcutCard.tsx 导入图标
    - 更新 BatchEditToolbar.tsx 导入图标
    - 更新 SettingsPanel.tsx 导入图标
    - 更新 common/index.ts 导出图标
    - _Requirements: 1.4_

- [x] 3. 创建可拖拽弹窗 Hook
  - [x] 3.1 创建 `src/hooks/useDraggableModal.ts`
    - 实现 position 状态管理
    - 实现 handleMouseDown 事件处理
    - 实现 mousemove/mouseup 事件监听
    - 实现 constrainToViewport 边界约束
    - 实现 resetPosition 重置功能
    - _Requirements: 5.1, 5.2, 5.3, 5.5_
  - [ ]* 3.2 编写拖拽 Hook 属性测试
    - **Property 5: Draggable Hook Position Management**
    - **Validates: Requirements 5.2, 5.3**
  - [x] 3.3 重构 Modal.tsx 使用 useDraggableModal
    - 移除重复的拖拽逻辑
    - 使用 Hook 替代
    - _Requirements: 5.4_
  - [x] 3.4 重构 IframeModal.tsx 使用 useDraggableModal
    - 移除重复的拖拽逻辑
    - 使用 Hook 替代
    - _Requirements: 5.4_

- [x] 4. Checkpoint - 确保基础设施完成
  - 运行 `pnpm build` 确保编译通过
  - 运行 `pnpm dev` 验证功能正常
  - 如有问题请询问用户

- [x] 5. 创建表单组件库
  - [x] 5.1 创建 `src/components/common/FormField.tsx`
    - 实现 label 显示
    - 实现 error 消息显示
    - 实现 required 标记
    - 支持 children 插槽
    - _Requirements: 2.1_
  - [x] 5.2 创建 `src/components/common/FormToggle.tsx`
    - 实现开关切换功能
    - 支持 label 和 description
    - 支持 disabled 状态
    - _Requirements: 2.2, 2.6_
  - [x] 5.3 创建 `src/components/common/FormSelect.tsx`
    - 实现下拉选择功能
    - 支持 options 数组
    - 支持 disabled 状态
    - _Requirements: 2.3, 2.6_
  - [x] 5.4 创建 `src/components/common/FormSlider.tsx`
    - 实现滑块功能
    - 支持 min/max/step
    - 支持 showValue 显示当前值
    - 支持 disabled 状态
    - _Requirements: 2.4, 2.6_
  - [ ]* 5.5 编写表单组件属性测试
    - **Property 2: Form Component Behavior**
    - **Validates: Requirements 2.2, 2.3, 2.4, 2.6**
  - [x] 5.6 更新 common/index.ts 导出表单组件
    - _Requirements: 2.5_

- [x] 6. 创建 Toast 系统
  - [x] 6.1 创建 `src/hooks/useToast.ts`
    - 实现 toasts 状态管理
    - 实现 showToast 方法
    - 实现 dismissToast 方法
    - 实现 success/error/warning/info 快捷方法
    - 实现自动消失定时器
    - _Requirements: 3.1, 3.2_
  - [x] 6.2 创建 `src/components/common/Toast.tsx`
    - 实现单个 Toast 组件
    - 支持 4 种类型样式
    - 实现关闭按钮
    - _Requirements: 3.1, 3.3_
  - [x] 6.3 创建 `src/components/common/ToastContainer.tsx`
    - 实现 Toast 列表渲染
    - 实现垂直堆叠布局
    - 支持 position 配置
    - _Requirements: 3.4_
  - [ ]* 6.4 编写 Toast 系统属性测试
    - **Property 3: Toast System Rendering**
    - **Validates: Requirements 3.1, 3.4**
  - [x] 6.5 集成 Toast 到 App.tsx
    - 添加 ToastContainer
    - 在快捷方式操作时显示 Toast
    - _Requirements: 3.5, 3.6, 3.7_

- [x] 7. 创建错误边界
  - [x] 7.1 创建 `src/components/common/ErrorBoundary.tsx`
    - 实现 componentDidCatch 错误捕获
    - 实现 fallback UI 渲染
    - 实现 retry 重试按钮
    - 实现 console.error 日志记录
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  - [ ]* 7.2 编写错误边界属性测试
    - **Property 4: Error Boundary Catches Errors**
    - **Validates: Requirements 4.1**
  - [x] 7.3 在 App.tsx 中包装主要组件
    - 包装 Clock 组件
    - 包装 Search 组件
    - 包装 ShortcutsContainer 组件
    - _Requirements: 4.5_

- [x] 8. Checkpoint - 确保核心组件完成
  - 运行 `pnpm build` 确保编译通过
  - 运行 `pnpm dev` 验证功能正常
  - 如有问题请询问用户

- [x] 9. 创建确认对话框
  - [x] 9.1 创建 `src/components/common/ConfirmDialog.tsx`
    - 实现 title 和 message 显示
    - 实现 confirm 和 cancel 按钮
    - 支持自定义按钮标签
    - 支持 danger 变体样式
    - 实现 Escape 键关闭
    - 实现点击外部关闭
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.6_
  - [ ]* 9.2 编写确认对话框属性测试
    - **Property 6: ConfirmDialog Customization**
    - **Validates: Requirements 8.3**
  - [x] 9.3 更新 BatchEditToolbar.tsx 使用 ConfirmDialog
    - 替换 window.confirm() 调用
    - _Requirements: 8.5_

- [x] 10. 创建键盘快捷键系统
  - [x] 10.1 创建 `src/hooks/useKeyboardShortcuts.ts`
    - 实现快捷键注册
    - 实现 Ctrl/Cmd 修饰键支持
    - 实现快捷键冲突检测
    - _Requirements: 7.5_
  - [x] 10.2 在 App.tsx 中集成键盘快捷键
    - 实现 Ctrl+K 聚焦搜索
    - 实现 Escape 关闭弹窗
    - 实现 Ctrl+, 打开设置
    - 实现 Ctrl+N 添加快捷方式
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  - [x] 10.3 在 AboutSettings.tsx 中添加快捷键文档
    - 显示所有可用快捷键列表
    - _Requirements: 7.6_

- [x] 11. 代码结构优化
  - [x] 11.1 重组 Shortcuts 文件夹结构
    - 创建 components/ 子目录
    - 创建 hooks/ 子目录（已存在）
    - 创建 utils/ 子目录（已存在）
    - 移动组件文件到 components/
    - 更新 index.ts 导出
    - _Requirements: 9.1_
  - [x] 11.2 更新 common/index.ts 导出
    - 导出所有新创建的组件
    - 导出图标库
    - 导出表单组件
    - _Requirements: 9.6_

- [x] 12. Final Checkpoint - 确保所有功能完成
  - 运行 `pnpm build` 确保编译通过
  - 运行 `pnpm dev` 验证所有功能正常
  - 如有问题请询问用户

## Notes

- 标记 `*` 的任务为可选测试任务，可跳过以加快 MVP 开发
- 每个任务都引用了具体的需求条目以便追溯
- 属性测试使用 fast-check 库，每个属性至少运行 100 次迭代
- 建议按顺序执行任务，确保依赖关系正确

