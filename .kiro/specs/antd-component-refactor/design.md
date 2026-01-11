# Design Document: Ant Design Component Refactor

## Overview

本设计文档描述了将项目中 5 个自定义实现的 UI 组件重构为 Ant Design 组件的技术方案。重构目标是统一 UI 风格、提升代码可维护性，同时保持现有功能和视觉效果。

## Architecture

重构采用渐进式替换策略，每个组件独立重构，不影响其他组件。重构后的组件将：
- 使用 Ant Design 组件替代自定义实现
- 保留 Tailwind CSS 用于布局和自定义样式
- 保持原有的状态管理逻辑（Zustand hooks）不变

```
┌─────────────────────────────────────────────────────────┐
│                    Plugin System                         │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ HabitModal  │  │FoodPicker   │  │ Pomodoro    │     │
│  │ (refactored)│  │Modal        │  │ Modal       │     │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘     │
│         │                │                │             │
│         ▼                ▼                ▼             │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Ant Design Components               │   │
│  │  Input, Button, Empty, Tag, Progress, Card...   │   │
│  └─────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│                    Features                              │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────────────┐      │
│  │ BatchEditToolbar│  │ PluginManagerModal      │      │
│  │ (refactored)    │  │ (refactored)            │      │
│  └────────┬────────┘  └────────────┬────────────┘      │
│           │                        │                    │
│           ▼                        ▼                    │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Button, Dropdown, Divider, Space, Card, Empty  │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. HabitModal 重构

**当前实现：**
- 使用原生 `<input>` 元素
- 使用自定义 `<div>` 作为按钮
- 自定义空状态显示

**重构方案：**
```tsx
// 替换映射
<input> → <Input />
<div onClick={...}> (按钮) → <Button />
自定义空状态 → <Empty />
```

**组件结构：**
```tsx
import { Input, Button, Empty } from 'antd';
import { PlusOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';

export function HabitModal() {
  // 保持原有 hooks 和状态逻辑
  const { habits, addHabit, removeHabit, toggleCheck } = useHabit();
  
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-green-500 to-emerald-600">
      {/* 头部 - 使用 Button 替代 div */}
      <div className="p-4 border-b border-white/10">
        <Button 
          type="text" 
          icon={<PlusOutlined />} 
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-white"
        />
        
        {/* 添加表单 - 使用 Input 替代 input */}
        {showAddForm && (
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="习惯名称"
            onPressEnter={handleAdd}
            className="bg-white/10 border-white/20 text-white"
          />
        )}
      </div>
      
      {/* 空状态 - 使用 Empty */}
      {habits.length === 0 && (
        <Empty 
          description={<span className="text-white/60">还没有习惯</span>}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </div>
  );
}
```

### 2. FoodPickerModal 重构

**当前实现：**
- 使用自定义 `<div>` 作为可选标签
- 使用自定义 `<div>` 作为按钮

**重构方案：**
```tsx
// 替换映射
<div onClick={toggleCategory}> → <Tag.CheckableTag />
<div onClick={spin}> → <Button />
```

**组件结构：**
```tsx
import { Tag, Button } from 'antd';
import { SyncOutlined } from '@ant-design/icons';

export function FoodPickerModal() {
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-orange-400 to-red-500">
      {/* 选择按钮 */}
      <Button
        type="primary"
        size="large"
        icon={<SyncOutlined spin={isSpinning} />}
        onClick={spin}
        loading={isSpinning}
        className="bg-white/20 border-none"
      >
        {isSpinning ? '选择中...' : '随机选择'}
      </Button>
      
      {/* 分类选择 - 使用 CheckableTag */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <Tag.CheckableTag
            key={cat.id}
            checked={config.enabledCategories.includes(cat.id)}
            onChange={() => toggleCategory(cat.id)}
          >
            {cat.icon} {cat.name}
          </Tag.CheckableTag>
        ))}
      </div>
    </div>
  );
}
```

### 3. PomodoroModal 重构

**当前实现：**
- 使用自定义 SVG 绘制圆形进度
- 使用自定义 `<button>` 元素

**重构方案：**
```tsx
// 替换映射
自定义 SVG 进度 → <Progress type="circle" />
<button> → <Button shape="circle" />
```

**组件结构：**
```tsx
import { Progress, Button } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, RedoOutlined, StepForwardOutlined } from '@ant-design/icons';

export function PomodoroModal() {
  const progress = ((totalTime - data.timeLeft) / totalTime) * 100;
  
  return (
    <div className={`h-full flex flex-col bg-gradient-to-br ${bgColor}`}>
      {/* 圆形进度 - 使用 Progress */}
      <Progress
        type="circle"
        percent={progress}
        size={192}
        format={() => formatTime(data.timeLeft)}
        strokeColor="rgba(255,255,255,0.8)"
        trailColor="rgba(255,255,255,0.2)"
      />
      
      {/* 控制按钮 - 使用 Button */}
      <div className="flex items-center gap-4">
        <Button 
          shape="circle" 
          icon={<RedoOutlined />} 
          onClick={reset}
          className="bg-white/10 border-none text-white"
        />
        <Button 
          shape="circle" 
          size="large"
          icon={isRunning ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
          onClick={isRunning ? pause : start}
          className="bg-white/20 border-none text-white"
        />
        <Button 
          shape="circle" 
          icon={<StepForwardOutlined />} 
          onClick={skip}
          className="bg-white/10 border-none text-white"
        />
      </div>
    </div>
  );
}
```

### 4. BatchEditToolbar 重构

**当前实现：**
- 使用自定义 `<button>` 元素
- 使用 CSS hover 实现下拉菜单
- 使用自定义分隔线

**重构方案：**
```tsx
// 替换映射
<button> → <Button />
CSS hover 下拉 → <Dropdown />
<div className="h-6 w-px"> → <Divider type="vertical" />
外层容器 → <Space />
```

**组件结构：**
```tsx
import { Button, Dropdown, Divider, Space } from 'antd';
import { DeleteOutlined, CloseOutlined, FolderOutlined } from '@ant-design/icons';

export function BatchEditToolbar() {
  const folderMenuItems = folders.map(folder => ({
    key: folder.id,
    label: folder.name,
    onClick: () => batchMoveToFolder(folder.id),
  }));

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl px-6 py-3 z-50">
      <Space split={<Divider type="vertical" />}>
        <span className="text-gray-600 text-sm">已选择 {selectedCount} 项</span>
        
        <Space>
          <Button type="link" size="small" onClick={selectAll}>全选</Button>
          <Button type="text" size="small" onClick={clearSelection}>取消全选</Button>
        </Space>
        
        <Dropdown menu={{ items: folderMenuItems }} disabled={selectedCount === 0}>
          <Button icon={<FolderOutlined />} disabled={selectedCount === 0}>
            移动至
          </Button>
        </Dropdown>
        
        <Button 
          danger 
          icon={<DeleteOutlined />} 
          onClick={handleDelete}
          disabled={selectedCount === 0}
        >
          删除
        </Button>
        
        <Button icon={<CloseOutlined />} onClick={toggleBatchEdit}>
          完成
        </Button>
      </Space>
    </div>
  );
}
```

### 5. PluginManagerModal 重构

**当前实现：**
- 使用自定义 `<div>` 作为卡片
- 使用自定义 `<button>` 元素
- 自定义空状态

**重构方案：**
```tsx
// 替换映射
<div className="bg-white rounded-2xl"> → <Card />
<button> → <Button />
自定义空状态 → <Empty />
```

**组件结构：**
```tsx
import { Card, Button, Empty } from 'antd';

function PluginItem({ plugin }: { plugin: Plugin }) {
  return (
    <Card
      hoverable
      cover={
        <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <span className="text-6xl">{plugin.metadata.icon || '🔌'}</span>
        </div>
      }
    >
      <Card.Meta
        title={plugin.metadata.name}
        description={plugin.metadata.description}
      />
      <Button
        block
        type={isOnDesktop ? 'default' : 'primary'}
        onClick={handleToggle}
        className="mt-3"
      >
        {isOnDesktop ? '移除' : '添加'}
      </Button>
    </Card>
  );
}

export function PluginManagerModal() {
  if (plugins.length === 0) {
    return <Empty description="暂无可用插件" />;
  }
  
  return (
    <div className="grid grid-cols-3 gap-4 p-6">
      {plugins.map(plugin => (
        <PluginItem key={plugin.metadata.id} plugin={plugin} />
      ))}
    </div>
  );
}
```

## Data Models

本次重构不涉及数据模型变更，所有组件继续使用现有的：
- `useHabit` hook 管理习惯数据
- `useFoodPicker` hook 管理食物选择数据
- `usePomodoro` hook 管理番茄钟数据
- `useShortcutsStore` 管理快捷方式和插件数据

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: HabitModal 功能保持

*For any* habit operation (add, toggle, remove), the refactored HabitModal SHALL produce the same state changes as the original implementation.

**Validates: Requirements 1.6**

### Property 2: FoodPickerModal 功能保持

*For any* category toggle or spin operation, the refactored FoodPickerModal SHALL produce the same results as the original implementation.

**Validates: Requirements 2.4**

### Property 3: PomodoroModal 功能保持

*For any* timer control operation (start, pause, reset, skip), the refactored PomodoroModal SHALL produce the same state transitions as the original implementation.

**Validates: Requirements 3.4**

### Property 4: BatchEditToolbar 功能保持

*For any* batch operation (select all, clear, move, delete), the refactored BatchEditToolbar SHALL produce the same state changes as the original implementation.

**Validates: Requirements 4.5**

### Property 5: PluginManagerModal 功能保持

*For any* plugin toggle operation (add/remove from desktop), the refactored PluginManagerModal SHALL produce the same state changes as the original implementation.

**Validates: Requirements 5.4**

## Error Handling

- 组件重构不改变现有的错误处理逻辑
- Ant Design 组件的内置错误处理（如 Input 的 maxLength）将被保留
- 使用 `message` API 显示操作反馈（已在部分组件中使用）

## Testing Strategy

### Unit Tests

由于本次重构主要是 UI 组件替换，重点测试：
1. 组件渲染正确性
2. 用户交互行为
3. 状态变更正确性

### Property-Based Tests

使用 Vitest 进行属性测试，验证重构后的组件功能与原实现一致：

```typescript
// 示例：HabitModal 功能测试
describe('HabitModal', () => {
  it('should add habit correctly', () => {
    // 测试添加习惯功能
  });
  
  it('should toggle habit check correctly', () => {
    // 测试打卡功能
  });
  
  it('should remove habit correctly', () => {
    // 测试删除习惯功能
  });
});
```

### E2E Tests

使用 Playwright 进行端到端测试，验证：
1. 组件在实际环境中的渲染
2. 用户交互流程
3. 视觉回归测试（可选）
