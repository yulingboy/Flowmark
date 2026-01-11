# Implementation Plan: Code Quality Enhancement

## Overview

实现浏览器新标签页应用的代码质量优化，包括图标服务优化、搜索组件增强、天气插件稳定性、设置存储增强、快捷方式数据完整性、时钟组件优化、右键菜单改进和弹窗组件统一。

## Tasks

- [x] 1. 图标服务优化
  - [x] 1.1 创建 `src/utils/faviconService.ts`
    - 实现多源回退链（Google → DuckDuckGo → 直接访问）
    - 实现内存缓存机制
    - 实现占位符生成函数
    - 支持可配置图标尺寸
    - _Requirements: 1.1, 1.2, 1.3, 1.5_
  - [ ]* 1.2 编写图标服务属性测试
    - **Property 1: Favicon Service Caching and Fallback**
    - **Property 2: Favicon Placeholder Generation**
    - **Property 3: Favicon Size Support**
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.5**
  - [x] 1.3 更新 `src/utils/favicon.ts` 使用新服务
    - 替换现有 getFaviconUrl 实现
    - 添加预加载功能
    - _Requirements: 1.4_

- [x] 2. 搜索组件增强
  - [x] 2.1 增强 `src/components/Search/Search.tsx`
    - 添加输入防抖（300ms）
    - 实现历史记录高亮匹配
    - 添加单条历史删除功能
    - 实现 URL 模式检测
    - 保持搜索引擎切换时的查询
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6_
  - [ ]* 2.2 编写搜索组件属性测试
    - **Property 4: Search Input Debounce**
    - **Property 5: Search History Highlight**
    - **Property 6: Search History Removal**
    - **Property 7: URL Pattern Detection**
    - **Property 8: Search Engine Switch Preserves Query**
    - **Validates: Requirements 2.2, 2.3, 2.4, 2.5, 2.6**

- [x] 3. Checkpoint - 确保基础组件优化完成
  - [x] 运行 `pnpm build` 确保编译通过
  - [ ] 运行 `pnpm dev` 验证功能正常（用户手动验证）
  - 如有问题请询问用户

- [x] 4. 天气插件稳定性
  - [x] 4.1 增强 `src/plugins/builtin/weather/useWeather.ts`
    - 实现指数退避重试机制（最多 3 次）
    - 添加天气数据缓存和时间戳
    - 显示"X 分钟前更新"指示器
    - 实现位置输入验证
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  - [ ]* 4.2 编写天气插件属性测试
    - **Property 9: Weather Retry Exponential Backoff**
    - **Property 10: Weather Cache Timestamp**
    - **Property 11: Weather Cache Age Display**
    - **Property 12: Weather Location Validation**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4**
  - [x] 4.3 更新 `src/plugins/builtin/weather/WeatherCard.tsx`
    - 显示缓存数据更新时间
    - 改进错误提示信息
    - _Requirements: 3.3, 3.5_

- [x] 5. 设置存储增强
  - [x] 5.1 增强 `src/stores/settingsStore.ts`
    - 添加数据完整性验证
    - 实现版本迁移机制
    - 添加持久化防抖
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  - [ ]* 5.2 编写设置存储属性测试
    - **Property 13: Settings Data Validation**
    - **Property 14: Settings Version Migration**
    - **Validates: Requirements 4.1, 4.3**

- [x] 6. Checkpoint - 确保数据层优化完成
  - [x] 运行 `pnpm build` 确保编译通过
  - [ ] 运行 `pnpm dev` 验证功能正常（用户手动验证）
  - 如有问题请询问用户

- [x] 7. 快捷方式数据完整性
  - [x] 7.1 增强 `src/stores/shortcutsStore.ts`
    - 添加数据结构验证和修复
    - 实现重复 ID 检测和去重
    - 添加数量限制（默认 200）
    - 实现删除撤销功能（5 秒内）
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
  - [ ]* 7.2 编写快捷方式存储属性测试
    - **Property 15: Shortcuts Validation and Repair**
    - **Property 16: Shortcuts Duplicate Prevention**
    - **Property 17: Shortcuts Limit Enforcement**
    - **Property 18: Shortcuts Delete Undo Round-Trip**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.6**

- [x] 8. 时钟组件优化
  - [x] 8.1 优化 `src/utils/clock.ts`
    - 添加农历日期缓存
    - 支持自定义日期格式
    - _Requirements: 6.5, 6.6_
  - [ ]* 8.2 编写时钟工具属性测试
    - **Property 19: Lunar Date Memoization**
    - **Validates: Requirements 6.5**
  - [x] 8.3 优化 `src/hooks/useClock.ts`
    - 添加页面可见性检测
    - 隐藏时暂停更新
    - _Requirements: 6.1, 6.3_

- [x] 9. Checkpoint - 确保核心功能优化完成
  - [x] 运行 `pnpm build` 确保编译通过
  - [ ] 运行 `pnpm dev` 验证功能正常（用户手动验证）
  - 如有问题请询问用户

- [x] 10. 右键菜单改进
  - [x] 10.1 增强 `src/components/common/ContextMenu.tsx`
    - 添加键盘导航（方向键、Enter、Escape）
    - 添加 ARIA 无障碍属性
    - 改进视口边界检测和翻转
    - _Requirements: 7.1, 7.2, 7.3_
  - [ ]* 10.2 编写右键菜单属性测试
    - **Property 20: Context Menu Keyboard Navigation**
    - **Property 21: Context Menu ARIA Attributes**
    - **Property 22: Context Menu Viewport Flip**
    - **Validates: Requirements 7.1, 7.2, 7.3**

- [x] 11. 弹窗组件统一
  - [x] 11.1 增强 `src/components/common/IframeModal.tsx`
    - 使用 useDraggableModal Hook
    - 添加位置和尺寸记忆功能
    - 添加最小/最大尺寸约束
    - 添加 body 滚动锁定
    - _Requirements: 8.1, 8.2, 8.5, 8.6_
  - [ ]* 11.2 编写弹窗组件属性测试
    - **Property 23: Modal Position Persistence**
    - **Property 24: Modal Z-Index Stacking**
    - **Property 25: Modal Size Constraints**
    - **Property 26: Modal Body Scroll Lock**
    - **Validates: Requirements 8.2, 8.3, 8.5, 8.6**

- [x] 12. Final Checkpoint - 确保所有功能完成
  - [x] 运行 `pnpm build` 确保编译通过
  - [ ] 运行 `pnpm dev` 验证所有功能正常（用户手动验证）
  - 如有问题请询问用户

## Notes

- 标记 `*` 的任务为可选测试任务，可跳过以加快 MVP 开发
- 每个任务都引用了具体的需求条目以便追溯
- 属性测试使用 fast-check 库，每个属性至少运行 100 次迭代
- 建议按顺序执行任务，确保依赖关系正确
- 类型安全增强（Requirement 9）和性能监控（Requirement 10）为代码级改进，将在实现过程中逐步完成
