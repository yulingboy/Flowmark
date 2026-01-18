# 实现计划：Side Panel 笔记管理功能

## 概述

本计划将 Side Panel 笔记管理功能分解为可执行的编码任务，按照依赖关系排序，确保每个步骤都能增量验证。

## 任务

- [x] 1. 创建 Chrome Storage 服务层
  - [x] 1.1 创建 `src/utils/chromeStorage.ts`，实现 ChromeStorageService
    - 实现 get、set、remove 方法
    - 实现 subscribe 方法监听 onChanged 事件
    - 添加环境检测（区分扩展环境和普通网页环境）
    - _需求: 3.1, 3.2, 4.1, 4.4_
  - [ ]* 1.2 编写 ChromeStorageService 属性测试
    - **Property 6: 存储变更通知所有监听者**
    - **验证: 需求 4.1**
  - [ ]* 1.3 编写序列化往返属性测试
    - **Property 5: 序列化往返一致性**
    - **验证: 需求 3.5**

- [x] 2. 重构 Notes Store 使用 Chrome Storage
  - [x] 2.1 修改 `src/plugins/builtin/notes/store.ts`
    - 将 persist 中间件替换为自定义 chrome.storage 持久化
    - 添加 isLoading 状态
    - 实现异步初始化 loadNotes 方法
    - 添加 onChanged 监听实现跨页面同步
    - _需求: 3.1, 3.2, 3.3, 4.1_
  - [ ]* 2.2 编写 Notes Store 属性测试
    - **Property 1: 新建笔记增加列表长度**
    - **Property 2: 编辑笔记正确更新数据**
    - **Property 3: 删除笔记正确移除数据**
    - **验证: 需求 2.2, 2.4, 2.5**
  - [ ]* 2.3 编写搜索功能属性测试
    - **Property 4: 搜索返回匹配标题的笔记**
    - **验证: 需求 2.6**

- [x] 3. 检查点 - 确保所有测试通过
  - 确保所有测试通过，如有问题请询问用户。

- [x] 4. 创建数据迁移服务
  - [x] 4.1 创建 `src/utils/migration.ts`，实现 MigrationService
    - 实现 needsMigration 检测方法
    - 实现 migrate 迁移方法
    - 迁移成功后清除 localStorage 旧数据
    - 添加错误处理和日志记录
    - _需求: 6.1, 6.2, 6.3, 6.4_
  - [ ]* 4.2 编写数据迁移属性测试
    - **Property 7: 数据迁移保持数据完整性**
    - **验证: 需求 6.2**

- [x] 5. 创建 Side Panel 应用
  - [x] 5.1 创建 `src/sidepanel/main.tsx` 入口文件
    - 初始化 React 应用
    - 调用迁移服务和 store 初始化
    - _需求: 1.4_
  - [x] 5.2 创建 `src/sidepanel/App.tsx` 根组件
    - 设置 Ant Design ConfigProvider
    - 渲染 SidePanelNotes 组件
    - _需求: 1.4_
  - [x] 5.3 创建 `src/sidepanel/SidePanelNotes.tsx` 笔记管理组件
    - 实现笔记列表显示（标题、更新时间）
    - 实现新建、编辑、删除功能
    - 实现搜索功能
    - 实现内容长度限制（5000 字符）
    - _需求: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

- [x] 6. 配置构建和扩展清单
  - [x] 6.1 创建 `sidepanel.html` 入口文件
    - _需求: 1.3_
  - [x] 6.2 修改 `vite.config.ts` 配置多入口构建
    - 添加 sidepanel 入口
    - 配置输出目录
    - _需求: 5.1, 5.2, 5.3, 5.4_
  - [x] 6.3 更新 `extension/manifest.json`
    - 添加 sidePanel 权限
    - 添加 side_panel 配置
    - 添加 action 配置
    - _需求: 1.1, 1.2_

- [x] 7. 更新 Newtab 应用初始化
  - [x] 7.1 修改 `src/main.tsx` 添加迁移和初始化逻辑
    - 应用启动时检查并执行迁移
    - 初始化 Notes Store
    - _需求: 6.1, 6.2_

- [x] 8. 最终检查点 - 确保所有测试通过
  - 确保所有测试通过，如有问题请询问用户。

## 备注

- 标记 `*` 的任务为可选任务，可跳过以加快 MVP 开发
- 每个任务都引用了具体的需求以便追溯
- 检查点确保增量验证
- 属性测试验证通用正确性属性
- 单元测试验证具体示例和边界情况
