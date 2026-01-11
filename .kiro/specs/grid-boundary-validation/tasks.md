# Implementation Plan: Grid Boundary Validation

## Overview

本实现计划将为网格系统添加边界验证功能，确保卡片在调整大小或从文件夹拖出时不会超出网格边界。采用渐进式实现策略，先添加工具函数，再集成到各个操作点。

## Tasks

- [x] 1. 添加边界验证工具函数
  - [x] 1.1 在 gridUtils.ts 中添加 `canResizeItem` 函数
    - 接收 position、newSize、gridConfig 参数
    - 将像素坐标转换为网格坐标
    - 检查 col + colSpan <= columns 和 row + rowSpan <= rows
    - 返回布尔值表示是否可以调整
    - _Requirements: 1.1, 1.4, 3.1_
  - [x] 1.2 在 gridUtils.ts 中添加 `findValidPositionInBounds` 函数
    - 接收目标位置、尺寸、网格配置、已占用单元格
    - 首先检查目标位置是否有效
    - 如果无效，搜索最近的有效位置
    - 返回有效位置或 null
    - _Requirements: 2.2, 3.2_
  - [x] 1.3 在 GridManager 类中添加 `getOccupiedCells` 方法
    - 返回当前已占用的网格单元格集合
    - 供 findValidPositionInBounds 使用
    - _Requirements: 3.2_

- [x] 2. 集成调整大小的边界验证
  - [x] 2.1 修改 ShortcutsContainer 中的 handleResizeItem
    - 在执行调整前调用 canResizeItem 验证
    - 如果验证失败，拒绝操作并记录警告
    - 如果验证通过，执行原有逻辑
    - _Requirements: 1.1, 1.2, 1.3_
  - [ ]* 2.2 编写 handleResizeItem 边界验证的单元测试
    - 测试边界内的有效调整
    - 测试超出边界的无效调整
    - _Requirements: 1.1, 1.2_

- [x] 3. Checkpoint - 验证调整大小功能
  - 运行 `pnpm build` 确保构建成功
  - 手动测试：将卡片放在网格边缘，尝试调整为会溢出的大小
  - 确保所有测试通过，如有问题请询问用户

- [x] 4. 集成从文件夹拖出的边界验证
  - [x] 4.1 修改 useFolderHandlers 中的 handleItemDragOut
    - 使用 findValidPositionInBounds 查找有效位置
    - 如果大尺寸无法放置，尝试降级为 1x1
    - 如果完全找不到位置，拒绝操作
    - 添加 rows 参数到 FolderHandlersOptions
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  - [x] 4.2 更新 ShortcutsContainer 传递 rows 参数给 createFolderHandlers
    - 确保 useFolderHandlers 能获取到 rows 配置
    - _Requirements: 2.4_
  - [ ]* 4.3 编写 handleItemDragOut 边界验证的单元测试
    - 测试正常拖出到有效位置
    - 测试拖出时的尺寸降级
    - 测试网格已满时的拒绝操作
    - _Requirements: 2.1, 2.2, 2.3_

- [x] 5. Checkpoint - 验证文件夹拖出功能
  - 运行 `pnpm build` 确保构建成功
  - 手动测试：从文件夹拖出大尺寸卡片到边缘位置
  - 确保所有测试通过，如有问题请询问用户

- [x] 6. Final Checkpoint - 完整验证
  - 运行 `pnpm build` 确保构建成功
  - 运行 `pnpm lint` 确保无 lint 错误
  - 手动验证所有场景：
    - 调整大小时的边界限制
    - 从文件夹拖出时的边界限制
    - UI 禁用状态与数据验证的一致性
  - 确保所有测试通过，如有问题请询问用户

- [ ]* 7. 编写属性测试验证边界验证
  - [ ]* 7.1 编写 canResizeItem 属性测试
    - **Property 1: Resize Validation Correctness**
    - **Validates: Requirements 1.1, 1.4**
  - [ ]* 7.2 编写验证一致性属性测试
    - **Property 4: Validation Consistency**
    - **Validates: Requirements 3.3, 4.3**

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- 每个 Checkpoint 后应提交 Git commit，便于回滚
- 边界验证应该是静默的（不显示错误提示），因为 UI 已经通过禁用按钮提供了反馈
- 从文件夹拖出时的尺寸降级是一个用户友好的降级策略，避免操作完全失败

</content>
</invoke>