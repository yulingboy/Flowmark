# 需求文档

## 简介

本功能为 Flowmark 浏览器扩展添加 Side Panel（侧边栏）笔记管理功能。Side Panel 将提供完整的笔记管理界面，与 newtab 页面中的笔记插件共享同一份数据，实现双向实时同步。

## 术语表

- **Side_Panel**: Chrome 浏览器扩展的侧边栏面板，通过 chrome.sidePanel API 实现
- **Newtab**: 浏览器新标签页，当前 Flowmark 扩展的主界面
- **Notes_Store**: 笔记数据的 Zustand 状态管理器
- **Chrome_Storage**: Chrome 扩展的 chrome.storage.local API，用于跨页面数据持久化
- **Storage_Sync_Service**: 负责在 localStorage 和 chrome.storage 之间同步数据的服务

## 需求

### 需求 1：Side Panel 基础配置

**用户故事：** 作为用户，我希望能够通过浏览器工具栏打开 Side Panel，以便在浏览网页时快速访问笔记功能。

#### 验收标准

1. THE Manifest SHALL 声明 sidePanel 权限和 side_panel 配置
2. WHEN 用户点击扩展图标 THEN THE Side_Panel SHALL 打开并显示笔记管理界面
3. THE Side_Panel SHALL 使用独立的 HTML 入口文件（sidepanel.html）
4. THE Side_Panel SHALL 加载独立构建的 React 应用

### 需求 2：Side Panel 笔记管理界面

**用户故事：** 作为用户，我希望在 Side Panel 中拥有完整的笔记管理功能，以便高效地创建、编辑和管理笔记。

#### 验收标准

1. THE Side_Panel SHALL 显示笔记列表，包含标题和更新时间
2. WHEN 用户点击新建按钮 THEN THE Side_Panel SHALL 创建一条新笔记并自动选中
3. WHEN 用户选中一条笔记 THEN THE Side_Panel SHALL 显示笔记编辑区域
4. WHEN 用户编辑笔记标题或内容 THEN THE Notes_Store SHALL 更新对应笔记数据
5. WHEN 用户点击删除按钮 THEN THE Notes_Store SHALL 删除对应笔记
6. THE Side_Panel SHALL 支持按标题搜索笔记
7. THE Side_Panel SHALL 限制笔记内容最大长度为 5000 字符

### 需求 3：数据存储层重构

**用户故事：** 作为开发者，我希望笔记数据使用 chrome.storage API 存储，以便在扩展的不同页面间共享数据。

#### 验收标准

1. THE Notes_Store SHALL 使用 chrome.storage.local 作为持久化后端
2. WHEN 笔记数据变更 THEN THE Notes_Store SHALL 将数据写入 chrome.storage.local
3. WHEN Notes_Store 初始化 THEN THE Notes_Store SHALL 从 chrome.storage.local 读取数据
4. THE Notes_Store SHALL 提供序列化和反序列化笔记数据的方法
5. FOR ALL 有效的笔记数据，序列化后反序列化 SHALL 产生等价的数据（往返一致性）

### 需求 4：跨页面数据同步

**用户故事：** 作为用户，我希望在 Side Panel 和 newtab 中的笔记数据保持实时同步，以便在任一界面操作后另一界面能立即看到更新。

#### 验收标准

1. WHEN chrome.storage 数据变更 THEN THE Storage_Sync_Service SHALL 通知所有监听者
2. WHEN Side_Panel 修改笔记 THEN THE Newtab SHALL 在 500ms 内显示更新后的数据
3. WHEN Newtab 修改笔记 THEN THE Side_Panel SHALL 在 500ms 内显示更新后的数据
4. THE Storage_Sync_Service SHALL 使用 chrome.storage.onChanged 事件监听数据变更
5. IF 同步过程中发生错误 THEN THE Storage_Sync_Service SHALL 记录错误日志并保持当前状态

### 需求 5：构建配置

**用户故事：** 作为开发者，我希望项目能够同时构建 newtab 和 Side Panel 两个入口，以便生成完整的扩展包。

#### 验收标准

1. THE Vite_Config SHALL 配置多入口构建（newtab 和 sidepanel）
2. WHEN 执行构建命令 THEN THE Build_System SHALL 生成 index.html 和 sidepanel.html
3. THE Build_System SHALL 将构建产物输出到 extension/assets 目录
4. THE Side_Panel SHALL 复用 newtab 的公共依赖（React、Ant Design 等）

### 需求 6：向后兼容

**用户故事：** 作为现有用户，我希望升级扩展后原有的笔记数据不会丢失。

#### 验收标准

1. WHEN 扩展首次升级 THEN THE Migration_Service SHALL 检测 localStorage 中的旧数据
2. IF localStorage 存在旧数据且 chrome.storage 为空 THEN THE Migration_Service SHALL 将数据迁移到 chrome.storage
3. WHEN 数据迁移完成 THEN THE Migration_Service SHALL 清除 localStorage 中的旧数据
4. IF 迁移过程中发生错误 THEN THE Migration_Service SHALL 保留原始数据并记录错误
