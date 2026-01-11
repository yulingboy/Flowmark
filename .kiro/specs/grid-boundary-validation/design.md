# Design Document: Grid Boundary Validation

## Overview

本设计文档描述了网格边界验证功能的实现方案。目标是在数据层面拦截会导致卡片溢出网格边界的操作，包括调整大小和从文件夹拖出。设计采用统一的验证工具函数，确保所有操作使用一致的边界检查逻辑。

## Architecture

### 验证流程

```
┌─────────────────────────────────────────────────────────────┐
│                      用户操作                                │
│  (右键菜单调整大小 / 从文件夹拖出)                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   边界验证层 (gridUtils.ts)                  │
│  ┌─────────────────────┐  ┌─────────────────────────────┐   │
│  │  canResizeItem()    │  │  findValidPositionForSize() │   │
│  │  - 检查新尺寸是否    │  │  - 在边界内查找有效位置      │   │
│  │    在边界内          │  │  - 考虑已占用的网格单元      │   │
│  └─────────────────────┘  └─────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│      验证通过            │     │      验证失败            │
│  - 执行操作              │     │  - 拒绝操作              │
│  - 更新 store            │     │  - 保持原状态            │
│  - 触发 UI 更新          │     │  - (可选) 显示提示       │
└─────────────────────────┘     └─────────────────────────┘
```

### 修改点

1. **gridUtils.ts** - 添加边界验证工具函数
2. **ShortcutsContainer.tsx** - 在 `handleResizeItem` 中添加验证
3. **useFolderHandlers.ts** - 在 `handleItemDragOut` 中添加边界检查
4. **PluginCard.tsx** - 在 `onLayoutSelect` 回调中添加验证（可选，因为 UI 已禁用）

## Components and Interfaces

### 新增工具函数

```typescript
// src/features/shortcuts/utils/gridUtils.ts

interface GridConfig {
  columns: number;
  rows: number;
  unit: number;
  gap: number;
}

/**
 * 检查是否可以将指定位置的卡片调整为新尺寸
 * @param position 卡片当前位置（像素坐标）
 * @param newSize 目标尺寸
 * @param gridConfig 网格配置
 * @returns 是否可以调整
 */
export function canResizeItem(
  position: Position,
  newSize: ShortcutSize,
  gridConfig: GridConfig
): boolean {
  const { col, row } = pixelToGrid(position.x, position.y, gridConfig.unit, gridConfig.gap);
  const { colSpan, rowSpan } = getGridSpan(newSize);
  
  // 检查是否超出边界
  return col + colSpan <= gridConfig.columns && row + rowSpan <= gridConfig.rows;
}

/**
 * 在网格边界内查找指定尺寸的有效位置
 * @param targetCol 目标列
 * @param targetRow 目标行
 * @param size 卡片尺寸
 * @param gridConfig 网格配置
 * @param occupiedCells 已占用的网格单元（可选）
 * @returns 有效位置或 null
 */
export function findValidPositionInBounds(
  targetCol: number,
  targetRow: number,
  size: ShortcutSize,
  gridConfig: GridConfig,
  occupiedCells?: Set<string>
): { col: number; row: number } | null {
  const { colSpan, rowSpan } = getGridSpan(size);
  const { columns, rows } = gridConfig;
  
  // 首先检查目标位置是否有效
  if (isPositionValid(targetCol, targetRow, colSpan, rowSpan, columns, rows, occupiedCells)) {
    return { col: targetCol, row: targetRow };
  }
  
  // 搜索最近的有效位置
  const maxRadius = Math.max(columns, rows);
  for (let radius = 1; radius <= maxRadius; radius++) {
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue;
        const col = targetCol + dx;
        const row = targetRow + dy;
        if (isPositionValid(col, row, colSpan, rowSpan, columns, rows, occupiedCells)) {
          return { col, row };
        }
      }
    }
  }
  
  return null;
}

function isPositionValid(
  col: number,
  row: number,
  colSpan: number,
  rowSpan: number,
  columns: number,
  rows: number,
  occupiedCells?: Set<string>
): boolean {
  // 边界检查
  if (col < 0 || row < 0 || col + colSpan > columns || row + rowSpan > rows) {
    return false;
  }
  
  // 碰撞检查
  if (occupiedCells) {
    for (let r = 0; r < rowSpan; r++) {
      for (let c = 0; c < colSpan; c++) {
        if (occupiedCells.has(`${col + c},${row + r}`)) {
          return false;
        }
      }
    }
  }
  
  return true;
}
```

### 修改 handleResizeItem

```typescript
// src/features/shortcuts/components/ShortcutsContainer.tsx

const handleResizeItem = (item: GridItem, size: ShortcutSize) => {
  // 边界验证
  if (item.position && !canResizeItem(item.position, size, { columns, rows, unit, gap })) {
    console.warn(`Cannot resize item ${item.id} to ${size}: would overflow grid boundaries`);
    return; // 拒绝操作
  }
  
  const newItems = items.map(s => (s.id === item.id ? { ...s, size } : s));
  setItems(newItems);
  onShortcutsChange?.(newItems);
};
```

### 修改 handleItemDragOut

```typescript
// src/features/shortcuts/hooks/useFolderHandlers.ts

const handleItemDragOut = (folderId: string, item: ShortcutItem) => {
  const folder = itemsMap.get(folderId);
  const folderPos = folder?.position || { x: 0, y: 0 };
  
  // 从文件夹中移除项目
  const newItems = items.map(i => {
    if (i.id === folderId && isShortcutFolder(i)) {
      return { ...i, items: i.items.filter(fi => fi.id !== item.id) };
    }
    return i;
  });
  
  const manager = new GridManager(columns, unit, gap);
  manager.initFromItems(newItems);
  
  const folderGrid = pixelToGrid(folderPos.x, folderPos.y, unit, gap);
  const { colSpan, rowSpan } = getGridSpan(item.size || '1x1');
  
  // 使用新的边界感知位置查找
  const gridConfig = { columns, rows, unit, gap };
  let targetPos = findValidPositionInBounds(
    folderGrid.col + 1, 
    folderGrid.row, 
    item.size || '1x1',
    gridConfig,
    manager.getOccupiedCells() // 需要在 GridManager 中添加此方法
  );
  
  // 如果找不到有效位置，尝试缩小尺寸
  if (!targetPos && item.size !== '1x1') {
    targetPos = findValidPositionInBounds(
      folderGrid.col + 1,
      folderGrid.row,
      '1x1',
      gridConfig,
      manager.getOccupiedCells()
    );
    if (targetPos) {
      item = { ...item, size: '1x1' }; // 降级为 1x1
    }
  }
  
  if (!targetPos) {
    console.warn('Cannot place item: no valid position available');
    return; // 拒绝操作，保持在文件夹中
  }
  
  const finalPos = gridToPixel(targetPos.col, targetPos.row, unit, gap);
  const itemWithPos: ShortcutItem = { ...item, position: finalPos };
  
  newItems.push(itemWithPos);
  setItems(newItems);
  onShortcutsChange?.(newItems);
  setOpenFolder(null);
};
```

## Data Models

### GridConfig 接口

```typescript
interface GridConfig {
  columns: number;  // 网格列数
  rows: number;     // 网格行数
  unit: number;     // 单元格大小（像素）
  gap: number;      // 单元格间距（像素）
}
```

### GridManager 扩展

```typescript
// 在 GridManager 类中添加
getOccupiedCells(): Set<string> {
  return new Set(this.grid);
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Resize Validation Correctness

*For any* grid configuration, item position, and target size, if `canResizeItem` returns true, then the item's new bounding box (col + colSpan, row + rowSpan) SHALL be within grid boundaries (≤ columns, ≤ rows).

**Validates: Requirements 1.1, 1.4**

### Property 2: Resize Rejection Preserves State

*For any* resize operation where `canResizeItem` returns false, the item's size in the resulting state SHALL equal its original size.

**Validates: Requirements 1.2, 1.3**

### Property 3: Drag-Out Position Validity

*For any* item dragged out of a folder, the resulting position SHALL satisfy: col ≥ 0, row ≥ 0, col + colSpan ≤ columns, row + rowSpan ≤ rows.

**Validates: Requirements 2.1, 2.4**

### Property 4: Validation Consistency

*For any* item position and size, `canResizeItem(position, size, config)` SHALL return true if and only if `getValidSizesForPosition(col, row, columns, rows).includes(size)`.

**Validates: Requirements 3.3, 4.3**

## Error Handling

### 边界情况处理

1. **无效位置**: 如果卡片位置为 undefined，使用 (0, 0) 作为默认值
2. **网格已满**: 如果从文件夹拖出时找不到有效位置，保持项目在文件夹中
3. **尺寸降级**: 如果大尺寸无法放置，自动降级为 1x1

### 日志记录

- 拒绝的操作应记录警告日志，便于调试
- 尺寸降级时应记录信息日志

## Testing Strategy

### 单元测试

1. **canResizeItem 函数测试**
   - 边界内的有效调整
   - 超出列边界的无效调整
   - 超出行边界的无效调整
   - 边缘位置的调整

2. **findValidPositionInBounds 函数测试**
   - 目标位置有效时直接返回
   - 目标位置无效时查找最近有效位置
   - 网格已满时返回 null

### 属性测试

使用 `fast-check` 进行属性测试：

```typescript
import fc from 'fast-check';
import { canResizeItem, getValidSizesForPosition, pixelToGrid, gridToPixel } from './gridUtils';

// Property 1: Resize Validation Correctness
test('Feature: grid-boundary-validation, Property 1: Resize Validation Correctness', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 2, max: 10 }), // columns
      fc.integer({ min: 2, max: 10 }), // rows
      fc.integer({ min: 0, max: 9 }),  // col
      fc.integer({ min: 0, max: 9 }),  // row
      fc.constantFrom('1x1', '1x2', '2x1', '2x2', '2x4'),
      (columns, rows, col, row, size) => {
        const unit = 64, gap = 16;
        const position = gridToPixel(col, row, unit, gap);
        const gridConfig = { columns, rows, unit, gap };
        
        if (canResizeItem(position, size, gridConfig)) {
          const { colSpan, rowSpan } = getGridSpan(size);
          return col + colSpan <= columns && row + rowSpan <= rows;
        }
        return true; // If validation fails, we don't check bounds
      }
    ),
    { numRuns: 100 }
  );
});

// Property 4: Validation Consistency
test('Feature: grid-boundary-validation, Property 4: Validation Consistency', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 2, max: 10 }),
      fc.integer({ min: 2, max: 10 }),
      fc.integer({ min: 0, max: 9 }),
      fc.integer({ min: 0, max: 9 }),
      fc.constantFrom('1x1', '1x2', '2x1', '2x2', '2x4'),
      (columns, rows, col, row, size) => {
        const unit = 64, gap = 16;
        const position = gridToPixel(col, row, unit, gap);
        const gridConfig = { columns, rows, unit, gap };
        
        const canResize = canResizeItem(position, size, gridConfig);
        const validSizes = getValidSizesForPosition(col, row, columns, rows);
        const isInValidSizes = validSizes.includes(size);
        
        return canResize === isInValidSizes;
      }
    ),
    { numRuns: 100 }
  );
});
```

### 集成测试

1. 在 ShortcutsContainer 中测试 resize 操作的完整流程
2. 测试从文件夹拖出的完整流程
3. 验证 UI 禁用状态与数据验证的一致性

</content>
</invoke>