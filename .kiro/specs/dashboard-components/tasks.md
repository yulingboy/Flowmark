# Implementation Plan: Dashboard Components

## Overview

实现浏览器新标签页风格的看板界面，包含时间组件、搜索框组件、快捷入口卡片组件和背景壁纸组件。采用 React + TypeScript + Tailwind CSS 技术栈。

## Tasks

- [x] 1. 项目基础设置
  - [x] 1.1 创建类型定义文件 `src/types/index.ts`
    - 定义 ShortcutItem、ShortcutFolder、ShortcutEntry 类型
    - 定义 ClockData 类型
    - _Requirements: 3.1, 4.1, 4.5_
  - [x] 1.2 安装测试依赖
    - 安装 vitest、@testing-library/react、fast-check
    - 配置 vitest.config.ts
    - _Requirements: Testing Strategy_

- [x] 2. 实现时间组件
  - [x] 2.1 创建时间格式化工具函数 `src/utils/clock.ts`
    - 实现 formatTime(date): string 返回 HH:MM:SS
    - 实现 formatDate(date): string 返回 MM月DD日
    - 实现 getWeekday(date): string 返回星期X
    - 实现简化版农历转换函数
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  - [ ]* 2.2 编写时间格式化属性测试
    - **Property 1: Time Format Validity**
    - **Property 2: Date Format Validity**
    - **Property 3: Weekday Mapping Correctness**
    - **Validates: Requirements 1.1, 1.2, 1.3**
  - [x] 2.3 创建 useClock Hook `src/hooks/useClock.ts`
    - 使用 useState 管理时钟状态
    - 使用 useEffect 设置每秒更新的定时器
    - 返回格式化后的时间、日期、星期、农历
    - _Requirements: 1.1_
  - [x] 2.4 创建 Clock 组件 `src/components/Clock/Clock.tsx`
    - 使用 useClock Hook 获取时间数据
    - 实现大字体时钟显示 (HH:MM:SS)
    - 实现日期、星期、农历显示
    - 应用居中对齐样式
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [x] 3. 实现搜索组件
  - [x] 3.1 创建搜索 URL 生成工具 `src/utils/search.ts`
    - 实现 generateSearchUrl(query, engine): string
    - 支持 bing、google、baidu 搜索引擎
    - 正确处理 URL 编码
    - _Requirements: 2.4_
  - [ ]* 3.2 编写搜索 URL 生成属性测试
    - **Property 4: Search URL Generation**
    - **Validates: Requirements 2.4**
  - [x] 3.3 创建 Search 组件 `src/components/Search/Search.tsx`
    - 实现单行搜索输入框
    - 添加搜索引擎图标（左侧）
    - 实现 placeholder 提示文本
    - 实现 Enter 键触发搜索
    - 应用半透明圆角样式
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [x] 4. 实现快捷入口组件
  - [x] 4.1 创建 ShortcutCard 组件 `src/components/Shortcuts/ShortcutCard.tsx`
    - 实现图标 + 名称垂直布局
    - 实现点击跳转功能
    - 应用统一尺寸和圆角阴影样式
    - 实现 hover 效果
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.6, 3.7_
  - [x] 4.2 创建 ShortcutFolder 组件 `src/components/Shortcuts/ShortcutFolder.tsx`
    - 实现文件夹卡片显示
    - 实现默认名称 "新文件夹"
    - 实现点击展开功能
    - 支持容纳多个 ShortcutItem
    - _Requirements: 4.1, 4.2, 4.4, 4.5, 4.6_
  - [ ]* 4.3 编写快捷入口属性测试
    - **Property 6: Folder Default Name**
    - **Property 7: Folder Item Containment**
    - **Validates: Requirements 4.2, 4.5**
  - [x] 4.4 创建 ShortcutsContainer 组件 `src/components/Shortcuts/ShortcutsContainer.tsx`
    - 实现横向网格布局
    - 渲染 ShortcutCard 和 ShortcutFolder
    - 管理文件夹展开状态
    - _Requirements: 3.5, 4.3_

- [x] 5. 实现背景组件
  - [x] 5.1 创建 Background 组件 `src/components/Background/Background.tsx`
    - 实现全屏背景图显示
    - 使用 object-fit: cover 适配
    - 设置正确的 z-index
    - 实现加载失败降级方案
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [x] 6. 组装主应用
  - [x] 6.1 更新 App.tsx 整合所有组件
    - 导入并组装 Background、Clock、Search、ShortcutsContainer
    - 实现居中垂直布局
    - 配置默认快捷入口数据
    - 应用半透明毛玻璃效果
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
  - [x] 6.2 添加默认背景图片
    - 添加示例背景图到 public 目录
    - _Requirements: 6.1_

- [x] 7. Checkpoint - 确保所有测试通过
  - 运行 `pnpm test` 确保所有测试通过
  - 运行 `pnpm dev` 验证界面显示正确
  - 如有问题请询问用户

## Notes

- 标记 `*` 的任务为可选测试任务，可跳过以加快 MVP 开发
- 每个任务都引用了具体的需求条目以便追溯
- 农历转换使用简化算法，如需精确可后续引入第三方库
- 属性测试验证核心逻辑的正确性
