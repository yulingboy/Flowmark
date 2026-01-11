# Design Document: Ant Design Component Migration

## Overview

本设计文档描述如何将项目中的原生 HTML 元素和自定义组件替换为 Ant Design 组件。这是一个纯 UI 层面的重构，不涉及业务逻辑变更，目标是统一 UI 风格并提升代码可维护性。

## Architecture

### 组件替换策略

采用渐进式替换策略，按组件独立性从高到低进行替换：

```
┌─────────────────────────────────────────────────────────┐
│                    应用层                                │
├─────────────────────────────────────────────────────────┤
│  TodoModal  │  NotesModal  │  WeatherModal  │  Cards    │
├─────────────────────────────────────────────────────────┤
│                  ContextMenu (共享组件)                  │
├─────────────────────────────────────────────────────────┤
│                  Ant Design 组件库                       │
│  Input │ Select │ Button │ List │ Empty │ Dropdown │ ...│
└─────────────────────────────────────────────────────────┘
```

### 替换原则

1. **保持功能不变** - 仅替换 UI 组件，不改变业务逻辑
2. **保持 API 兼容** - 组件对外接口保持不变
3. **样式适配** - 使用 antd 的 className 和 style 属性进行样式微调
4. **渐进替换** - 每个组件独立替换，便于测试和回滚

## Components and Interfaces

### 1. TodoModal 组件替换

**当前实现 → antd 替换方案：**

| 原生元素 | antd 组件 | 用途 |
|---------|----------|------|
| `<input type="text">` | `Input` | 搜索框、新建列表输入、待办输入 |
| `<select>` | `Select` | 优先级选择器 |
| `<input type="checkbox">` | `Checkbox` | 待办完成状态 |
| `<button>` | `Button` | 新建列表、确定、取消等按钮 |
| 自定义 EmptyIcon | `Empty` | 空状态展示 |
| 自定义列表 div | `List` | 待办列表、分类列表 |
| 自定义优先级圆点 | `Tag` | 优先级标识 |

**代码示例：**

```tsx
// 搜索框
<Input placeholder="搜索待办" allowClear />

// 优先级选择
<Select value={selectedPriority} onChange={setSelectedPriority}>
  <Select.Option value="low">低优先级</Select.Option>
  <Select.Option value="medium">中优先级</Select.Option>
  <Select.Option value="high">高优先级</Select.Option>
</Select>

// 待办项
<List
  dataSource={filteredTodos}
  renderItem={(todo) => (
    <List.Item>
      <Checkbox checked={todo.completed} onChange={() => toggleTodo(todo.id)} />
      <span>{todo.text}</span>
      <Tag color={priorityColors[todo.priority]}>{todo.priority}</Tag>
    </List.Item>
  )}
/>

// 空状态
<Empty description="没有待办事项" />
```

### 2. NotesModal 组件替换

**当前实现 → antd 替换方案：**

| 原生元素 | antd 组件 | 用途 |
|---------|----------|------|
| `<input type="text">` | `Input.Search` | 搜索笔记 |
| `<textarea>` | `Input.TextArea` | 笔记内容编辑 |
| `<button>` | `Button` | 新建、删除、保存等按钮 |
| 自定义 EmptyFolderIcon | `Empty` | 空状态展示 |
| 自定义列表 div | `List` | 笔记列表 |

**代码示例：**

```tsx
// 搜索框
<Input.Search
  placeholder="搜索笔记标题"
  value={searchQuery}
  onChange={e => setSearchQuery(e.target.value)}
  allowClear
/>

// 笔记内容
<Input.TextArea
  placeholder="笔记内容（最大5000字符）"
  value={selectedNote.content}
  onChange={e => updateNote(selectedNote.id, { content: e.target.value })}
  maxLength={5000}
  showCount
  autoSize={{ minRows: 10 }}
/>

// 笔记列表
<List
  dataSource={filteredNotes}
  renderItem={(note) => (
    <List.Item onClick={() => handleSelect(note.id)}>
      <List.Item.Meta
        title={note.title || '未命名笔记'}
        description={formatFullTime(note.updatedAt)}
      />
    </List.Item>
  )}
/>
```

### 3. ContextMenu 组件替换

**当前实现 → antd 替换方案：**

使用 `Dropdown` + `Menu` 组合替换自定义的 portal-based 右键菜单。

**接口设计：**

```tsx
interface ContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  items: ContextMenuItem[];
  onClose: () => void;
}

// 转换为 antd Menu items 格式
function convertToMenuItems(items: ContextMenuItem[]): MenuProps['items'] {
  return items.map((item, index) => {
    if (item.type === 'submenu') {
      return {
        key: index,
        icon: item.icon,
        label: item.label,
        children: item.submenuItems?.map(sub => ({
          key: sub.id,
          label: sub.label,
          onClick: sub.onClick,
        })),
      };
    }
    return {
      key: index,
      icon: item.icon,
      label: item.label,
      onClick: item.onClick,
    };
  });
}
```

### 4. WeatherModal 组件替换

**当前实现 → antd 替换方案：**

| 原生元素 | antd 组件 | 用途 |
|---------|----------|------|
| `<button>` | `Button` | 刷新按钮 |
| 自定义统计 div | `Card` | 天气统计卡片 |
| 无 | `Empty` | 无数据状态 |

**代码示例：**

```tsx
<Button onClick={refresh} loading={loading}>
  {loading ? '刷新中...' : '刷新'}
</Button>

<Card size="small" title="体感温度">
  <span>{weather.feelsLike}°</span>
</Card>

{!weather && <Empty description="暂无天气数据" />}
```

### 5. TodoCard 组件替换

**当前实现 → antd 替换方案：**

| 原生元素 | antd 组件 | 用途 |
|---------|----------|------|
| 自定义数字展示 | `Badge` | 待办数量 |
| 自定义列表 | `List` | 待办项展示 |
| 自定义进度 | `Tag` | 完成状态 |

### 6. NotesCard 组件替换

**当前实现 → antd 替换方案：**

| 原生元素 | antd 组件 | 用途 |
|---------|----------|------|
| 自定义数字展示 | `Badge` | 笔记数量 |
| 自定义网格 | `List` | 笔记项展示 |

## Data Models

本次重构不涉及数据模型变更，所有现有的类型定义保持不变：

- `Todo` - 待办事项类型
- `Note` - 笔记类型
- `Priority` - 优先级枚举
- `FilterType` - 筛选类型
- `ContextMenuItem` - 菜单项类型

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

由于本次重构是纯 UI 组件替换，不涉及业务逻辑变更，所有验收标准都是关于 UI 组件的视觉/结构变化，无法通过属性测试进行自动化验证。

**验证方式：** 通过手动测试和视觉检查确保：
1. 功能行为与替换前一致
2. UI 样式符合 Ant Design 设计规范
3. 无控制台错误或警告

## Error Handling

### 组件替换错误处理

1. **样式冲突** - 如果 antd 样式与 Tailwind 冲突，使用 `className` 覆盖或 `style` 内联样式
2. **事件处理差异** - antd 组件的事件回调参数可能与原生不同，需要适配
3. **受控组件** - 确保 antd 受控组件正确绑定 value 和 onChange

## Testing Strategy

### 测试方法

由于这是 UI 组件替换，主要采用以下测试策略：

1. **手动功能测试**
   - 验证所有交互功能正常工作
   - 验证数据正确显示和更新

2. **视觉回归测试**
   - 确保 UI 样式符合预期
   - 检查响应式布局

3. **控制台检查**
   - 无 React 警告
   - 无 antd 组件警告
   - 无类型错误

### 测试清单

- [ ] TodoModal: 添加待办、完成待办、删除待办、筛选、新建列表
- [ ] NotesModal: 新建笔记、编辑笔记、删除笔记、搜索笔记
- [ ] ContextMenu: 右键菜单显示、菜单项点击、子菜单展开
- [ ] WeatherModal: 刷新天气、显示天气数据
- [ ] TodoCard: 各尺寸显示正确
- [ ] NotesCard: 各尺寸显示正确
