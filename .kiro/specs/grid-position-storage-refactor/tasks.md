# Implementation Plan: Grid Position Storage Refactor

## Overview

将卡片位置存储从像素坐标 (x, y) 重构为网格坐标 (col, row)。实现分为四个阶段：类型定义、工具函数、数据迁移、组件更新。

## Tasks

- [x] 1. 更新类型定义
  - [x] 1.1 在 `src/types/core.ts` 中添加 GridPosition 接口
    - 定义 `GridPosition { col: number; row: number }`
    - 添加 `PixelPosition` 类型别名（等同于原 Position）
    - 保持 `Position` 别名以兼容现有代码
    - _Requirements: 1.1, 1.2_
  
  - [x] 1.2 更新 `src/types/index.ts` 导出新类型
    - 导出 `GridPosition` 和 `PixelPosition`
    - _Requirements: 1.1_

- [x] 2. 扩展网格工具函数
  - [x] 2.1 在 `src/utils/gridUtils.ts` 中添加 `clampGridPosition` 函数
    - 实现边界 clamp 逻辑
    - 确保位置在有效网格范围内
    - _Requirements: 3.4_
  
  - [ ]* 2.2 编写 `clampGridPosition` 属性测试
    - **Property 3: Boundary Clamping Validity**
    - **Validates: Requirements 3.4**
  
  - [ ]* 2.3 编写坐标转换往返属性测试
    - **Property 1: Grid-to-Pixel Conversion Alignment**
    - **Validates: Requirements 2.1, 2.3**
  
  - [ ]* 2.4 编写像素转网格四舍五入属性测试
    - **Property 2: Pixel-to-Grid Rounding Correctness**
    - **Validates: Requirements 3.1, 3.2**

- [x] 3. Checkpoint - 确保工具函数测试通过
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. 实现数据迁移模块
  - [x] 4.1 创建 `src/features/shortcuts/store/migration.ts`
    - 实现 `isLegacyPosition(position: unknown): boolean`
    - 实现 `migratePosition(position, unit, gap): GridPosition`
    - 实现 `migrateShortcuts(shortcuts, gridConfig): GridItem[]`
    - _Requirements: 4.1, 4.2, 4.3, 4.5_
  
  - [ ]* 4.2 编写旧格式检测属性测试
    - **Property 4: Legacy Format Detection**
    - **Validates: Requirements 4.1**
  
  - [ ]* 4.3 编写迁移幂等性属性测试
    - **Property 5: Migration Idempotence**
    - **Validates: Requirements 4.4**
  
  - [ ]* 4.4 编写迁移正确性属性测试
    - **Property 6: Migration Correctness**
    - **Validates: Requirements 4.2**
  
  - [ ]* 4.5 编写迁移边缘情况单元测试
    - 测试空数组、null/undefined position、无效数据
    - _Requirements: 4.5_

- [x] 5. Checkpoint - 确保迁移模块测试通过
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. 更新 Store 集成迁移逻辑
  - [x] 6.1 修改 `src/features/shortcuts/store/store.ts`
    - 在 `onRehydrateStorage` 中调用迁移函数
    - 确保旧数据自动迁移为新格式
    - _Requirements: 4.2, 4.3_
  
  - [x] 6.2 更新 `addPluginCard` 方法使用 GridPosition
    - 修改位置存储为 `{ col, row }` 格式
    - _Requirements: 1.1, 1.3_

- [x] 7. 更新 Hook 和组件
  - [x] 7.1 修改 `src/features/shortcuts/hooks/useShortcutItems.ts`
    - 读取 GridPosition 并转换为 PixelPosition 用于渲染
    - 更新位置分配逻辑使用 GridPosition
    - _Requirements: 2.1, 2.2, 5.2_
  
  - [x] 7.2 修改 `src/features/shortcuts/hooks/useDragHandlers.ts`
    - 拖拽结束时将 PixelPosition 转换为 GridPosition 存储
    - 使用 `clampGridPosition` 处理边界情况
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 5.3_
  
  - [x] 7.3 更新 `src/features/shortcuts/components/ShortcutsContainer.tsx`
    - 确保 `handleResizeItem` 使用 GridPosition
    - _Requirements: 1.1, 5.1_

- [x] 8. Checkpoint - 确保所有组件正常工作
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. 最终验证
  - [x] 9.1 运行完整测试套件
    - 执行 `pnpm test` 确保所有测试通过
    - _Requirements: 1.1-5.4_
  
  - [ ]* 9.2 编写集成测试验证端到端迁移流程
    - 模拟旧格式数据加载和迁移
    - 验证拖拽后数据正确存储
    - _Requirements: 4.1-4.5_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- 属性测试使用 fast-check 库，每个测试至少运行 100 次迭代
- 迁移逻辑在 store rehydrate 时自动执行，用户无感知
- 保持 Position 类型别名确保现有代码兼容性

