# Implementation Plan: Ant Design Component Refactor

## Overview

本实现计划将 5 个自定义组件重构为使用 Ant Design 组件，采用渐进式替换策略，每个组件独立完成重构和测试。

## Tasks

- [x] 1. 重构 HabitModal 组件
  - [x] 1.1 将原生 input 替换为 Ant Design Input 组件
    - 导入 Input 组件
    - 替换习惯名称输入框
    - 添加 onPressEnter 支持
    - 保持白色半透明背景样式
    - _Requirements: 1.1_
  - [x] 1.2 将自定义 div 按钮替换为 Ant Design Button 组件
    - 导入 Button 组件和相关图标
    - 替换添加按钮（右上角 +）
    - 替换表单中的取消/添加按钮
    - 替换删除按钮
    - 保持白色文字和透明背景样式
    - _Requirements: 1.2_
  - [x] 1.3 添加 Ant Design Empty 组件显示空状态
    - 导入 Empty 组件
    - 替换自定义空状态显示
    - 自定义描述文字样式
    - _Requirements: 1.3_
  - [ ]* 1.4 编写 HabitModal 功能测试
    - 测试添加习惯功能
    - 测试打卡功能
    - 测试删除习惯功能
    - _Requirements: 1.6_

- [x] 2. 重构 FoodPickerModal 组件
  - [x] 2.1 将分类选择替换为 Ant Design Tag.CheckableTag 组件
    - 导入 Tag 组件
    - 替换分类选择按钮为 CheckableTag
    - 保持图标和文字显示
    - 自定义选中/未选中样式
    - _Requirements: 2.1_
  - [x] 2.2 将随机选择按钮替换为 Ant Design Button 组件
    - 导入 Button 和 SyncOutlined 图标
    - 替换自定义 div 按钮
    - 使用 loading 属性显示旋转状态
    - 保持白色半透明背景样式
    - _Requirements: 2.2_
  - [ ]* 2.3 编写 FoodPickerModal 功能测试
    - 测试分类切换功能
    - 测试随机选择功能
    - _Requirements: 2.4_

- [x] 3. 重构 PomodoroModal 组件
  - [x] 3.1 将自定义 SVG 进度替换为 Ant Design Progress 组件
    - 导入 Progress 组件
    - 使用 type="circle" 配置
    - 自定义 format 显示时间
    - 设置 strokeColor 和 trailColor 为白色半透明
    - 调整尺寸为 192px
    - _Requirements: 3.1_
  - [x] 3.2 将控制按钮替换为 Ant Design Button 组件
    - 导入 Button 和相关图标
    - 使用 shape="circle" 配置
    - 替换重置、播放/暂停、跳过按钮
    - 保持白色半透明背景样式
    - _Requirements: 3.2_
  - [ ]* 3.3 编写 PomodoroModal 功能测试
    - 测试开始/暂停功能
    - 测试重置功能
    - 测试跳过功能
    - _Requirements: 3.4_

- [x] 4. 重构 BatchEditToolbar 组件
  - [x] 4.1 将自定义按钮替换为 Ant Design Button 组件
    - 导入 Button 组件和相关图标
    - 替换全选、取消全选按钮
    - 替换删除按钮（使用 danger 属性）
    - 替换完成按钮
    - _Requirements: 4.1_
  - [x] 4.2 将文件夹下拉菜单替换为 Ant Design Dropdown 组件
    - 导入 Dropdown 组件
    - 构建 menu items 数组
    - 替换 CSS hover 实现的下拉菜单
    - 处理禁用状态
    - _Requirements: 4.2_
  - [x] 4.3 使用 Ant Design Divider 和 Space 组件优化布局
    - 导入 Divider 和 Space 组件
    - 使用 Divider type="vertical" 替换自定义分隔线
    - 使用 Space 组件包裹工具栏内容
    - _Requirements: 4.3, 4.4_
  - [ ]* 4.4 编写 BatchEditToolbar 功能测试
    - 测试全选/取消全选功能
    - 测试移动到文件夹功能
    - 测试删除功能
    - _Requirements: 4.5_

- [x] 5. 重构 PluginManagerModal 组件
  - [x] 5.1 将插件卡片替换为 Ant Design Card 组件
    - 导入 Card 组件
    - 使用 Card.Meta 显示插件信息
    - 使用 cover 属性显示插件图标
    - 添加 hoverable 属性
    - _Requirements: 5.1_
  - [x] 5.2 将操作按钮替换为 Ant Design Button 组件
    - 导入 Button 组件
    - 使用 block 属性占满宽度
    - 根据状态切换 type="primary" 或 type="default"
    - _Requirements: 5.2_
  - [x] 5.3 添加 Ant Design Empty 组件显示空状态
    - 导入 Empty 组件
    - 替换自定义空状态显示
    - _Requirements: 5.3_
  - [ ]* 5.4 编写 PluginManagerModal 功能测试
    - 测试添加插件到桌面功能
    - 测试从桌面移除插件功能
    - _Requirements: 5.4_

- [x] 6. Checkpoint - 验证所有重构 ✅
  - [x] 确保所有组件正常渲染
  - [x] 确保所有功能正常工作
  - [x] 运行 pnpm lint 检查代码规范
  - [x] 所有重构组件无诊断错误

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- 重构时保持原有的渐变背景和视觉风格
- 使用 Tailwind CSS 类名配合 Ant Design 组件
