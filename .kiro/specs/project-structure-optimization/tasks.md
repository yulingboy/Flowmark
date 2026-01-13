# Implementation Plan: Project Structure Optimization

## Overview

本实现计划采用渐进式重构策略，分阶段优化项目结构。每个阶段完成后进行验证，确保不破坏现有功能。优化顺序：Components → Features → Plugins → 清理。

## Tasks

- [x] 1. 重组 Components 目录结构
  - [x] 1.1 创建 Modal 组件分组
    - 创建 `src/components/Modal/` 目录
    - 移动 `MacModal.tsx`、`IframeModal.tsx` 到 Modal 目录
    - 移动 `useModalBehavior.ts` 到 Modal 目录
    - 创建 `Modal/types.ts` 整合 Modal 相关类型
    - 创建 `Modal/index.ts` 导出
    - _Requirements: 2.1, 2.2, 2.4_

  - [x] 1.2 创建 Menu 组件分组
    - 创建 `src/components/Menu/` 目录
    - 移动 `ContextMenu.tsx` 到 Menu 目录
    - 创建 `Menu/types.ts` 提取菜单相关类型
    - 创建 `Menu/index.ts` 导出
    - _Requirements: 2.1, 2.2_

  - [x] 1.3 创建 Image 组件分组
    - 创建 `src/components/Image/` 目录
    - 移动 `LazyImage.tsx` 到 Image 目录
    - 创建 `Image/index.ts` 导出
    - _Requirements: 2.1_

  - [x] 1.4 更新 Components 根 index.ts
    - 更新 `src/components/index.ts` 从新的子目录导出
    - 保持向后兼容的导出路径
    - 添加废弃注释指向新路径
    - _Requirements: 2.3, 6.3_

  - [ ]* 1.5 编写组件结构属性测试
    - **Property 1: Module Structure Conformance (Components)**
    - 验证 Modal、Menu、Image 目录存在且包含正确文件
    - **Validates: Requirements 2.1, 2.2**

- [x] 2. Checkpoint - 验证 Components 重构
  - 确保所有测试通过，如有问题请告知

- [x] 3. 统一 Feature 模块 Store 命名
  - [x] 3.1 重构 background store
    - 重命名 `backgroundStore.ts` 为 `store.ts`
    - 创建 `store/types.ts` 提取类型
    - 更新 `store/index.ts` 导出
    - _Requirements: 3.1, 3.2_

  - [x] 3.2 重构 clock store
    - 重命名 `clockStore.ts` 为 `store.ts`
    - 创建 `store/types.ts` 提取类型
    - 更新 `store/index.ts` 导出
    - _Requirements: 3.1, 3.2_

  - [x] 3.3 重构 search store
    - 重命名 `searchStore.ts` 为 `store.ts`
    - 创建 `store/types.ts` 提取类型
    - 更新 `store/index.ts` 导出
    - _Requirements: 3.1, 3.2_

  - [x] 3.4 重构 settings store
    - 重命名 `generalStore.ts` 为 `store.ts`
    - 创建 `store/types.ts` 提取类型
    - 更新 `store/index.ts` 导出
    - _Requirements: 3.1, 3.2_

  - [x] 3.5 更新 Feature 模块导出
    - 更新各 feature 的 `index.ts` 使用新的 store 路径
    - 保持向后兼容的导出
    - _Requirements: 2.3, 6.3_

  - [ ]* 3.6 编写 Store 命名规范属性测试
    - **Property 2: Store Convention Conformance**
    - 验证所有 store 文件命名为 `store.ts`
    - 验证 store hook 命名为 `use{Feature}Store`
    - **Validates: Requirements 3.1, 3.2, 3.3**

- [x] 4. Checkpoint - 验证 Store 重构
  - 确保所有测试通过，如有问题请告知

- [x] 5. 清理冗余代码和空目录
  - [x] 5.1 删除空目录
    - 删除 `src/plugins/styles/` 空目录
    - 检查并删除其他空目录
    - _Requirements: 6.1_

  - [x] 5.2 整合重复类型定义
    - 检查 `src/types/` 和各模块 `types.ts` 中的重复定义
    - 将重复类型整合到单一来源
    - 更新引用路径
    - _Requirements: 6.2_

  - [x] 5.3 添加废弃注释
    - 为所有向后兼容的 re-export 添加 `@deprecated` 注释
    - 注释中说明新的导入路径
    - _Requirements: 6.3_

  - [ ]* 5.4 编写代码库整洁性属性测试
    - **Property 5: Codebase Hygiene**
    - 验证无空目录存在
    - 验证无重复类型定义
    - **Validates: Requirements 6.1, 6.2**

- [x] 6. Checkpoint - 验证清理工作
  - 确保所有测试通过，如有问题请告知

- [ ] 7. 验证向后兼容性
  - [x] 7.1 编写向后兼容性测试
    - **Property 3: Backward Compatibility**
    - 验证所有旧导入路径仍然有效
    - 验证导出值与重构前一致
    - **Validates: Requirements 2.3**

  - [x] 7.2 运行完整测试套件
    - 运行 `pnpm test` 确保单元测试通过
    - 运行 `pnpm build` 确保构建成功
    - _Requirements: 2.3_

- [ ] 8. 检测循环依赖
  - [ ]* 8.1 编写循环依赖检测测试
    - **Property 6: No Circular Dependencies**
    - 使用 madge 或类似工具检测循环依赖
    - 验证模块导入图无环
    - **Validates: Requirements 7.4**

- [x] 9. Final Checkpoint - 最终验证
  - 确保所有测试通过，如有问题请告知
  - 运行 `pnpm lint` 确保代码风格一致
  - 运行 `pnpm build` 确保生产构建成功

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- 每个重构步骤应该是原子的，可以通过 Git 回滚
- 重构过程中保持向后兼容，避免破坏现有功能
- 属性测试验证结构规范的普遍性

