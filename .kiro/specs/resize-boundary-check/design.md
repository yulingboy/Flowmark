# Design Document: Resize Boundary Check

## Overview

本设计实现网格项目尺寸调整时的边界检查功能。当用户通过右键菜单调整快捷方式、插件卡片或文件夹的尺寸时，系统会根据项目当前位置和网格边界（12列x4行）计算哪些尺寸选项是有效的，并禁用会导致超出边界的选项。

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ContextMenu Component                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Layout Options Section                  │   │
│  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐          │   │
│  │  │ 1x1 │ │ 1x2 │ │ 2x1 │ │ 2x2 │ │ 2x4 │          │   │
│  │  │  ✓  │ │  ✓  │ │  ✓  │ │  ✓  │ │  ✗  │ disabled │   │
│  │  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘          │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    gridUtils.ts                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  getValidSizesForPosition(                          │   │
│  │    col: number,                                      │   │
│  │    row: number,                                      │   │
│  │    columns: number,                                  │   │
│  │    rows: number,                                     │   │
│  │    currentSize?: ShortcutSize                       │   │
│  │  ): ShortcutSize[]                                  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Grid Utility Function

新增 `getValidSizesForPosition` 函数到 `src/components/Shortcuts/utils/gridUtils.ts`：

```typescript
/**
 * 计算给定位置可用的尺寸选项
 * @param col - 项目所在列（0-indexed）
 * @param row - 项目所在行（0-indexed）
 * @param columns - 网格总列数
 * @param rows - 网格总行数
 * @param currentSize - 当前尺寸（始终保持可用）
 * @returns 有效的尺寸选项数组
 */
function getValidSizesForPosition(
  col: number,
  row: number,
  columns: number,
  rows: number,
  currentSize?: ShortcutSize
): ShortcutSize[]
```

### 2. ContextMenu Component Enhancement

修改 `ContextMenu` 组件的布局选项渲染逻辑：

```typescript
interface ContextMenuItem {
  // ... existing fields
  layoutOptions?: ShortcutSize[];
  disabledLayouts?: ShortcutSize[];  // 新增：禁用的布局选项
  currentLayout?: ShortcutSize;
  onLayoutSelect?: (size: ShortcutSize) => void;
}
```

### 3. Card Components Update

修改 `ShortcutCard`、`PluginCard`、`ShortcutFolder` 组件，在构建右键菜单时计算禁用的尺寸选项。

## Data Models

### ShortcutSize Type (existing)

```typescript
type ShortcutSize = '1x1' | '1x2' | '2x1' | '2x2' | '2x4';
```

### Size Span Mapping

```typescript
const SIZE_SPANS: Record<ShortcutSize, { cols: number; rows: number }> = {
  '1x1': { cols: 1, rows: 1 },
  '1x2': { cols: 1, rows: 2 },
  '2x1': { cols: 2, rows: 1 },
  '2x2': { cols: 2, rows: 2 },
  '2x4': { cols: 2, rows: 4 },
};
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Valid sizes fit within boundaries

*For any* grid position (col, row) and grid dimensions (columns, rows), all sizes returned by `getValidSizesForPosition` must satisfy:
- `col + size.cols <= columns` (不超出列边界)
- `row + size.rows <= rows` (不超出行边界)

**Validates: Requirements 1.1, 1.2, 1.3, 2.2, 2.3**

### Property 2: Current size always included

*For any* grid position and current size, if `currentSize` is provided to `getValidSizesForPosition`, the returned array must include `currentSize`.

**Validates: Requirements 1.5**

## Error Handling

1. **Invalid Position**: 如果传入的位置超出网格范围（col < 0, row < 0, col >= columns, row >= rows），函数应返回空数组或仅包含当前尺寸
2. **Missing Parameters**: 如果 columns 或 rows 为 0 或负数，函数应返回空数组

## Testing Strategy

### Unit Tests

- 测试边界位置（第一行、最后一行、第一列、最后一列）的有效尺寸计算
- 测试中间位置的有效尺寸计算
- 测试当前尺寸始终包含在结果中

### Property-Based Tests

使用 `vitest` 和 `fast-check` 进行属性测试：

1. **Property 1 Test**: 生成随机的网格位置和尺寸，验证所有返回的有效尺寸都不会超出边界
2. **Property 2 Test**: 生成随机的网格位置和当前尺寸，验证当前尺寸始终在返回结果中

测试配置：
- 每个属性测试运行至少 100 次迭代
- 使用 `fc.integer()` 生成有效的网格坐标
- 使用 `fc.constantFrom()` 生成有效的尺寸选项
