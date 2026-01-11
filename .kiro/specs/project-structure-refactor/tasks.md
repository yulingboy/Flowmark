# Implementation Plan: Project Structure Refactor

## Overview

本实现计划将项目从当前结构重构为 Features 模式。采用渐进式迁移策略，每完成一个 feature 模块后验证构建，确保重构过程可控。

## Tasks

- [x] 1. 创建基础目录结构和统一类型定义
  - [x] 1.1 创建 `src/features/` 目录结构
    - 创建 clock, search, shortcuts, settings, plugins 子目录
    - 每个子目录创建 components/, hooks/, utils/ 子目录（按需）
    - _Requirements: 4.1, 4.2_
  - [x] 1.2 统一类型定义到 `src/types/`
    - 创建 `src/types/core.ts` 定义共享类型（CardSize, Position, OpenMode）
    - 创建 `src/types/shortcuts.ts` 定义快捷方式类型
    - 创建 `src/types/plugins.ts` 定义插件类型
    - 更新 `src/types/index.ts` 统一导出
    - 删除 `src/plugins/types.ts` 中的重复定义，改为从 types 导入
    - _Requirements: 1.1, 1.2, 1.3_
  - [ ]* 1.3 编写类型唯一性属性测试
    - **Property 1: Type Definition Uniqueness**
    - **Validates: Requirements 1.1, 1.2**

- [x] 2. 迁移 Clock 功能模块
  - [x] 2.1 移动 Clock 组件和相关文件
    - 移动 `src/components/Clock/Clock.tsx` 到 `src/features/clock/components/`
    - 移动 `src/hooks/useClock.ts` 到 `src/features/clock/hooks/`
    - 移动 `src/utils/clock.ts` 到 `src/features/clock/utils/`
    - 移动 `src/utils/formatTime.ts` 到 `src/features/clock/utils/`
    - 创建 `src/features/clock/index.ts` barrel export
    - _Requirements: 2.2, 3.2, 4.4_
  - [x] 2.2 更新 Clock 相关导入路径
    - 更新 `src/App.tsx` 中的 Clock 导入
    - 更新 Clock 组件内部的导入路径
    - _Requirements: 2.4, 3.4, 6.1_

- [x] 3. Checkpoint - 验证 Clock 迁移
  - 运行 `pnpm build` 确保构建成功
  - 确保所有测试通过，如有问题请询问用户

- [x] 4. 迁移 Search 功能模块
  - [x] 4.1 移动 Search 组件和相关文件
    - 移动 `src/components/Search/Search.tsx` 到 `src/features/search/components/`
    - 移动 `src/utils/search.ts` 到 `src/features/search/utils/`
    - 移动 `src/utils/searchHistory.ts` 到 `src/features/search/utils/`
    - 创建 `src/features/search/index.ts` barrel export
    - _Requirements: 3.2, 4.5_
  - [x] 4.2 更新 Search 相关导入路径
    - 更新 `src/App.tsx` 中的 Search 导入
    - 更新 Search 组件内部的导入路径
    - _Requirements: 3.4, 6.1_

- [x] 5. Checkpoint - 验证 Search 迁移
  - 运行 `pnpm build` 确保构建成功
  - 确保所有测试通过，如有问题请询问用户

- [x] 6. 迁移 Shortcuts 功能模块
  - [x] 6.1 移动 Shortcuts 组件文件
    - 移动 `src/components/Shortcuts/*.tsx` 到 `src/features/shortcuts/components/`
    - 移动 `src/components/Shortcuts/hooks/` 到 `src/features/shortcuts/hooks/`
    - 移动 `src/components/Shortcuts/utils/` 到 `src/features/shortcuts/utils/`
    - _Requirements: 2.3, 3.3, 4.6_
  - [x] 6.2 移动 Shortcuts store 和相关 utils
    - 移动 `src/stores/shortcuts/` 到 `src/features/shortcuts/store/`
    - 移动 `src/utils/favicon.ts` 到 `src/features/shortcuts/utils/`
    - 移动 `src/utils/faviconService.ts` 到 `src/features/shortcuts/utils/`
    - 移动 `src/utils/siteInfo.ts` 到 `src/features/shortcuts/utils/`
    - _Requirements: 3.2_
  - [x] 6.3 创建 Shortcuts barrel export 并更新导入
    - 创建 `src/features/shortcuts/index.ts`
    - 更新 `src/App.tsx` 中的 Shortcuts 导入
    - 更新所有 Shortcuts 组件内部的导入路径
    - _Requirements: 6.1, 7.1_

- [x] 7. Checkpoint - 验证 Shortcuts 迁移
  - 运行 `pnpm build` 确保构建成功
  - 确保所有测试通过，如有问题请询问用户

- [x] 8. 迁移 Settings 功能模块
  - [x] 8.1 移动 Settings 组件文件
    - 移动 `src/components/Settings/*.tsx` 到 `src/features/settings/components/`
    - 移动 `src/components/Settings/tabs/` 到 `src/features/settings/components/tabs/`
    - _Requirements: 4.7_
  - [x] 8.2 移动 Settings store
    - 移动 `src/stores/settings/` 到 `src/features/settings/store/`
    - _Requirements: 3.2_
  - [x] 8.3 创建 Settings barrel export 并更新导入
    - 创建 `src/features/settings/index.ts`
    - 更新 `src/App.tsx` 中的 Settings 导入
    - 更新所有 Settings 组件内部的导入路径
    - _Requirements: 6.1, 7.1_

- [x] 9. Checkpoint - 验证 Settings 迁移
  - 运行 `pnpm build` 确保构建成功
  - 确保所有测试通过，如有问题请询问用户

- [x] 10. Plugins 模块保持独立
  - Plugins 作为独立模块保留在 `src/plugins/`
  - 不需要迁移到 features 目录
  - _Requirements: 4.8_

- [x] 11. Checkpoint - 验证 Settings 迁移完成
  - 运行 `pnpm build` 确保构建成功
  - 确保所有测试通过，如有问题请询问用户

- [x] 12. 清理和优化
  - [x] 12.1 清理空目录和冗余文件
    - 删除空的 `src/components/Clock/` 目录
    - 删除空的 `src/components/Search/` 目录
    - 删除空的 `src/components/Shortcuts/` 目录
    - 删除空的 `src/components/Settings/` 目录
    - 删除空的 `src/plugins/` 目录
    - 删除空的 `src/stores/settings/` 目录
    - 删除空的 `src/stores/shortcuts/` 目录
    - _Requirements: 4.4, 4.5, 4.6, 4.7, 4.8_
  - [x] 12.2 创建全局 hooks barrel export
    - 创建 `src/hooks/index.ts` 导出所有全局 hooks
    - _Requirements: 7.3_
  - [x] 12.3 更新 tsconfig.json 路径别名（如需要）
    - 添加 `@/features/*` 路径别名
    - _Requirements: 6.2_

- [x] 13. Final Checkpoint - 完整验证
  - 运行 `pnpm build` 确保构建成功
  - 运行 `pnpm lint` 确保无 lint 错误
  - 确保所有测试通过，如有问题请询问用户

- [ ]* 14. 编写属性测试验证重构结果
  - [ ]* 14.1 编写构建成功属性测试
    - **Property 2: Build Success After Refactoring**
    - **Validates: Requirements 2.4, 3.4, 6.1, 6.3**
  - [ ]* 14.2 编写 Feature Module Barrel Exports 属性测试
    - **Property 3: Feature Module Barrel Exports**
    - **Validates: Requirements 7.1**

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- 每个 Checkpoint 后应提交 Git commit，便于回滚
- 如遇循环依赖问题，可能需要调整导入顺序或提取共享模块
- 保持 `src/components/common/` 和 `src/components/Background/` 不变
