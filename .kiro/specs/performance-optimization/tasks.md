# Implementation Plan: Performance Optimization

## Overview

实现浏览器新标签页应用的性能优化，包括图片懒加载/预加载、组件懒加载、渲染优化（React.memo）、虚拟化列表、资源提示和性能监控。

## Tasks

- [x] 1. 创建图片加载基础设施
  - [x] 1.1 创建 `src/hooks/useImageLoader.ts`
    - 实现 Intersection Observer 懒加载逻辑
    - 实现 loading/loaded/error 状态管理
    - 实现 placeholder 和 fallback 支持
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  - [ ]* 1.2 编写图片加载属性测试
    - **Property 1: Image Fallback on Error**
    - **Validates: Requirements 1.4**
  - [x] 1.3 创建 `src/components/common/LazyImage.tsx`
    - 封装 useImageLoader Hook
    - 实现 fade-in 过渡动画
    - 支持 className 和样式自定义
    - _Requirements: 1.3, 1.6_

- [x] 2. 创建图片预加载工具
  - [x] 2.1 创建 `src/utils/imagePreloader.ts`
    - 实现 preloadImage 单图预加载
    - 实现 preloadImages 批量预加载
    - 实现并发请求限制（默认 3 个）
    - 实现内存缓存避免重复加载
    - _Requirements: 2.1, 2.4_
  - [ ]* 2.2 编写预加载并发限制属性测试
    - **Property 2: Concurrent Preload Limit**
    - **Validates: Requirements 2.4**
  - [x] 2.3 集成预加载到应用
    - 在 App.tsx 中预加载背景图
    - 在 ShortcutFolder 悬停时预加载图标
    - _Requirements: 2.1, 2.2_

- [x] 3. Checkpoint - 确保图片优化完成
  - 运行 `pnpm build` 确保编译通过
  - 验证图片懒加载和预加载功能
  - 如有问题请询问用户

- [x] 4. 实现组件懒加载
  - [x] 4.1 创建 `src/components/common/LazyComponent.tsx`
    - 实现 Suspense 包装器
    - 实现加载指示器
    - 实现错误边界和重试功能
    - _Requirements: 3.3, 3.4, 3.5_
  - [x] 4.2 重构 App.tsx 使用懒加载
    - 懒加载 SettingsPanel 组件
    - 懒加载 AddShortcutModal 组件
    - 懒加载 AddFolderModal 组件
    - 懒加载 WallpaperModal 组件
    - _Requirements: 3.1, 3.2, 3.6_

- [x] 5. 实现渲染优化
  - [x] 5.1 使用 React.memo 优化组件
    - 优化 Clock 组件
    - 优化 Search 组件
    - 优化 ShortcutCard 组件
    - 优化 Background 组件
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  - [ ]* 5.2 编写渲染优化属性测试
    - **Property 3: Memoized Component Re-render Prevention**
    - **Validates: Requirements 4.2, 4.3, 4.4, 4.5**

- [x] 6. Checkpoint - 确保懒加载和渲染优化完成
  - 运行 `pnpm build` 确保编译通过
  - 验证组件懒加载功能
  - 如有问题请询问用户

- [x] 7. 实现虚拟化列表
  - [x] 7.1 创建 `src/components/common/VirtualGrid.tsx`
    - 实现虚拟化渲染逻辑
    - 支持可变尺寸项目
    - 实现滚动位置保持
    - 实现阈值判断（>50 项启用）
    - _Requirements: 5.1, 5.3, 5.4, 5.5_
  - [ ]* 7.2 编写虚拟列表属性测试
    - **Property 4: Virtual List Rendering Efficiency**
    - **Property 5: Virtual List Variable Size Support**
    - **Property 6: Virtual List Scroll Position Preservation**
    - **Validates: Requirements 5.1, 5.3, 5.5**
  - [x] 7.3 集成虚拟列表到 ShortcutsContainer
    - 当快捷方式超过 50 个时启用虚拟化
    - 保持现有拖拽功能兼容
    - _Requirements: 5.1, 5.2_

- [x] 8. 创建资源提示组件
  - [x] 8.1 创建 `src/components/common/ResourceHints.tsx`
    - 实现 preconnect 链接生成
    - 实现 dns-prefetch 链接生成
    - 配置外部域名（Google Favicon, Unsplash）
    - _Requirements: 6.1, 6.2_
  - [x] 8.2 在 index.html 或 App.tsx 中集成资源提示
    - 添加 preconnect 到 Google Favicon 服务
    - 添加 preconnect 到 Unsplash
    - _Requirements: 6.1, 6.2_

- [x] 9. 实现性能监控
  - [x] 9.1 创建 `src/hooks/usePerformanceMonitor.ts`
    - 实现 FCP 指标收集
    - 实现 LCP 指标收集
    - 实现 CLS 指标收集
    - 实现阈值警告
    - 实现开发/生产模式切换
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_
  - [ ]* 9.2 编写性能监控属性测试
    - **Property 7: Performance Threshold Warning**
    - **Validates: Requirements 7.5**
  - [x] 9.3 在 App.tsx 中集成性能监控
    - 仅在开发模式启用
    - 输出性能指标到控制台
    - _Requirements: 7.4, 7.6_

- [x] 10. Final Checkpoint - 确保所有功能完成
  - 运行 `pnpm build` 确保编译通过
  - 运行 `pnpm dev` 验证所有功能正常
  - 检查打包体积变化
  - 如有问题请询问用户

## Notes

- 标记 `*` 的任务为可选测试任务，可跳过以加快 MVP 开发
- 每个任务都引用了具体的需求条目以便追溯
- 属性测试使用 fast-check 库，每个属性至少运行 100 次迭代
- 虚拟化列表仅在快捷方式超过 50 个时启用，避免小列表的额外开销
- 性能监控仅在开发模式启用，生产环境不会有性能开销

