# Implementation Plan: Code Refactoring

## Overview

本实现计划将代码重构分为 7 个主要任务，按依赖关系排序。首先完成基础设施（工具函数迁移、类型简化），然后实现新的 Hook，最后迁移 Store 并更新组件。

## Tasks

- [x] 1. 网格工具函数迁移
  - [x] 1.1 创建 `src/utils/gridUtils.ts`，从 `features/shortcuts/utils/gridUtils.ts` 复制内容
    - 保持所有函数签名和实现不变
    - _Requirements: 5.1_
  - [x] 1.2 创建 `src/utils/index.ts` 导出文件
    - 导出 gridUtils 中的所有函数和类
    - _Requirements: 5.3_
  - [x] 1.3 更新所有依赖文件的导入路径
    - 更新 `features/shortcuts/components/` 下的文件
    - 更新 `plugins/components/PluginCard.tsx`
    - 更新 `features/shortcuts/store/store.ts`
    - _Requirements: 5.2_
  - [x] 1.4 删除原 `features/shortcuts/utils/gridUtils.ts` 文件
    - 更新 `features/shortcuts/index.ts` 导出
    - _Requirements: 5.1_
  - [ ]* 1.5 Write property test for grid utils functionality
    - **Property 3: Grid Utils Functionality Preservation**
    - **Validates: Requirements 5.4**

- [x] 2. 类型定义简化
  - [x] 2.1 更新 `plugins/core/pluginManager.ts` 直接从 `@/types` 导入
    - 替换 `from '../types'` 为 `from '@/types'`
    - _Requirements: 4.2, 4.3_
  - [x] 2.2 更新 `plugins/core/pluginAPI.ts` 直接从 `@/types` 导入
    - _Requirements: 4.2, 4.3_
  - [x] 2.3 更新 `plugins/components/PluginCard.tsx` 直接从 `@/types` 导入
    - _Requirements: 4.2, 4.3_
  - [x] 2.4 更新 `plugins/builtin/index.ts` 直接从 `@/types` 导入
    - _Requirements: 4.2, 4.3_
  - [x] 2.5 更新 `plugins/store.ts` 直接从 `@/types` 导入
    - _Requirements: 4.2, 4.3_
  - [x] 2.6 更新 `plugins/index.ts` 导出，移除 types 重导出
    - _Requirements: 4.1_
  - [x] 2.7 删除 `plugins/types.ts` 文件
    - _Requirements: 4.1_

- [x] 3. Checkpoint - 基础设施验证
  - 运行 TypeScript 编译确保无错误
  - 运行现有测试确保功能正常
  - 确保所有测试通过，如有问题请询问用户

- [x] 4. 创建 useModalBehavior Hook
  - [x] 4.1 创建 `src/components/common/Modal/useModalBehavior.ts`
    - 实现 UseModalBehaviorOptions 接口
    - 实现 UseModalBehaviorResult 接口
    - 实现拖拽逻辑（position, isDragging, handlePointerDown）
    - 实现全屏切换逻辑（isFullscreen, toggleFullscreen）
    - 实现 ESC 键处理逻辑
    - 实现点击外部关闭逻辑
    - 实现 reset 方法
    - _Requirements: 1.1, 1.2_
  - [x] 4.2 重构 `MacModal.tsx` 使用 useModalBehavior
    - 移除重复的状态和逻辑
    - 使用 hook 返回的状态和处理函数
    - _Requirements: 1.3_
  - [x] 4.3 重构 `IframeModal.tsx` 使用 useModalBehavior
    - 保留 IframeModal 特有的 resize 逻辑和位置缓存
    - 使用 hook 处理通用的拖拽和全屏逻辑
    - _Requirements: 1.4, 1.5_
  - [x] 4.4 更新 `src/components/common/index.ts` 导出
    - 导出 useModalBehavior hook
    - _Requirements: 1.1_
  - [ ]* 4.5 Write property test for useModalBehavior
    - **Property 1: Modal Behavior Hook Functionality**
    - **Validates: Requirements 1.1, 1.5**

- [x] 5. 创建 useCardBehavior Hook
  - [x] 5.1 创建 `src/features/shortcuts/hooks/useCardBehavior.ts`
    - 实现 UseCardBehaviorOptions 接口
    - 实现 UseCardBehaviorResult 接口
    - 集成 useContextMenu hook
    - 实现 disabledLayouts 计算逻辑
    - 实现批量编辑点击处理逻辑
    - 实现共享样式类名生成
    - _Requirements: 3.1, 3.2, 7.1, 7.2_
  - [x] 5.2 重构 `ShortcutCard.tsx` 使用 useCardBehavior
    - 移除重复的 contextMenu 状态
    - 移除重复的 disabledLayouts 计算
    - 使用 hook 返回的状态和处理函数
    - 保留 ShortcutCard 特有的 contextMenuItems
    - _Requirements: 3.3, 7.3_
  - [x] 5.3 重构 `PluginCard.tsx` 使用 useCardBehavior
    - 移除重复的 contextMenu 状态
    - 移除重复的 disabledLayouts 计算
    - 使用 hook 返回的状态和处理函数
    - 保留 PluginCard 特有的 contextMenuItems
    - _Requirements: 3.4, 7.3_
  - [x] 5.4 更新 `src/features/shortcuts/index.ts` 导出
    - 导出 useCardBehavior hook
    - _Requirements: 3.1_
  - [ ]* 5.5 Write property test for useCardBehavior
    - **Property 4: Card Behavior Hook Functionality**
    - **Validates: Requirements 3.1, 3.6, 7.2, 7.4**

- [x] 6. Checkpoint - Hook 验证
  - 运行 TypeScript 编译确保无错误
  - 手动测试 Modal 拖拽、全屏、关闭功能
  - 手动测试 Card 右键菜单、批量选择功能
  - 确保所有测试通过，如有问题请询问用户

- [x] 7. Store 模块化迁移
  - [x] 7.1 迁移 searchStore 到 search 模块
    - 创建 `src/features/search/store/searchStore.ts`
    - 更新 `src/features/search/index.ts` 导出
    - _Requirements: 2.1, 2.5_
  - [x] 7.2 迁移 backgroundStore 到 Background 组件
    - 创建 `src/components/Background/store/backgroundStore.ts`
    - 创建 `src/components/Background/index.ts` 导出
    - _Requirements: 2.2, 2.6_
  - [x] 7.3 迁移 clockStore 到 clock 模块
    - 创建 `src/features/clock/store/clockStore.ts`
    - 更新 `src/features/clock/index.ts` 导出
    - _Requirements: 6.1, 6.3_
  - [x] 7.4 更新所有依赖文件的导入路径
    - 更新 `App.tsx` 导入路径
    - 更新 `features/settings/` 下的组件导入路径
    - 更新 `features/search/components/` 导入路径
    - 更新 `features/clock/components/` 导入路径
    - 更新 `components/Background/` 导入路径
    - _Requirements: 2.4, 6.2_
  - [x] 7.5 更新 settings 模块导出
    - 从 `features/settings/index.ts` 移除 searchStore、backgroundStore、clockStore 导出
    - 保留 generalStore 导出
    - _Requirements: 6.4_
  - [x] 7.6 删除原 store 文件
    - 删除 `features/settings/store/searchStore.ts`
    - 删除 `features/settings/store/backgroundStore.ts`
    - 删除 `features/settings/store/clockStore.ts`
    - 更新 `features/settings/store/index.ts`
    - _Requirements: 2.1, 2.2, 6.1_
  - [ ]* 7.7 Write property test for store persistence
    - **Property 2: Store Persistence After Migration**
    - **Validates: Requirements 2.7, 6.5**

- [x] 8. Final Checkpoint - 完整验证
  - 运行 TypeScript 编译确保无错误
  - 运行所有单元测试
  - 运行 E2E 测试
  - 手动测试所有功能
  - 确保所有测试通过，如有问题请询问用户

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Store 迁移保持原有 localStorage key 不变，确保用户数据不丢失
- 建议按顺序执行任务，因为后续任务依赖前面的基础设施
