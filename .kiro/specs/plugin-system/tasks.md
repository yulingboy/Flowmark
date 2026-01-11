# Implementation Tasks

## Task 1: 创建插件系统类型定义

- [x] 在 `src/types/plugin.ts` 中定义所有插件相关的 TypeScript 接口
- [x] 包含 Plugin, PluginMetadata, PluginConfig, PluginConfigSchema, PluginAPI 等接口
- [x] 导出类型供其他模块使用

**Requirements:** REQ-1, REQ-2, REQ-3

## Task 2: 实现 Event Bus 事件总线

- [x] 创建 `src/plugins/core/eventBus.ts`
- [x] 实现 emit, on, off, clear 方法
- [x] 支持事件命名空间（按插件 ID）
- [x] 实现类型安全的事件处理

**Requirements:** REQ-5

## Task 3: 实现 Plugin Store 状态管理

- [x] 创建 `src/stores/pluginStore.ts`
- [x] 使用 Zustand 管理插件状态
- [x] 实现 enablePlugin, disablePlugin, setPluginConfig, resetPluginConfig
- [x] 实现 localStorage 持久化

**Requirements:** REQ-2, REQ-3

## Task 4: 实现 Plugin Manager 核心

- [x] 创建 `src/plugins/core/pluginManager.ts`
- [x] 实现 register, unregister 方法
- [x] 实现 enable, disable 方法
- [x] 实现生命周期钩子调用
- [x] 实现插件查询方法

**Requirements:** REQ-1, REQ-2

## Task 5: 实现 Plugin API

- [x] 创建 `src/plugins/core/pluginAPI.ts`
- [x] 实现配置管理方法 (getConfig, setConfig, resetConfig)
- [x] 实现事件方法 (emit, on, off)
- [x] 实现存储方法 (getStorage, setStorage, removeStorage)
- [x] 实现工具方法 (showToast, openModal, closeModal)

**Requirements:** REQ-3, REQ-5

## Task 6: 实现 PluginSlot 组件

- [x] 创建 `src/components/Plugins/PluginSlot.tsx`
- [x] 支持 header, main, sidebar, footer 四种槽位
- [x] 实现插件排序渲染
- [x] 添加 ErrorBoundary 错误处理

**Requirements:** REQ-4

## Task 7: 创建插件系统入口和 Context

- [x] 创建 `src/plugins/index.ts` 导出所有核心模块
- [x] 创建 `src/plugins/PluginProvider.tsx` 提供 React Context
- [x] 在 App.tsx 中集成 PluginProvider

**Requirements:** REQ-1, REQ-4

## Task 8: 实现天气插件

- [x] 创建 `src/plugins/builtin/weather/index.ts`
- [x] 实现天气数据获取（使用免费 API）
- [x] 创建天气显示组件
- [x] 实现配置（位置、单位、更新间隔）
- [x] 处理 API 错误和重试

**Requirements:** REQ-6

## Task 9: 实现待办事项插件

- [x] 创建 `src/plugins/builtin/todo/index.ts`
- [x] 实现任务的增删改查
- [x] 实现任务完成状态切换
- [x] 实现任务过滤（全部、进行中、已完成）
- [x] 实现数据持久化

**Requirements:** REQ-7

## Task 10: 实现便签插件

- [x] 创建 `src/plugins/builtin/notes/index.ts`
- [x] 实现便签的创建、编辑、删除
- [x] 实现富文本编辑（粗体、斜体、列表）
- [x] 实现便签颜色选择
- [x] 实现网格/列表布局切换

**Requirements:** REQ-8

## Task 11: 实现插件管理界面

- [x] 创建 `src/components/Settings/tabs/PluginsSettings.tsx`
- [x] 显示插件列表和状态
- [x] 实现启用/禁用开关
- [x] 实现插件详情和配置面板
- [x] 实现配置重置功能
- [x] 集成到现有设置面板

**Requirements:** REQ-9

## Task 12: 注册内置插件

- [x] 创建 `src/plugins/builtin/index.ts`
- [x] 导出所有内置插件
- [x] 在应用启动时注册内置插件
- [x] 设置默认启用状态

**Requirements:** REQ-6, REQ-7, REQ-8
