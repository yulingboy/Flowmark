# Requirements Document

## Introduction

本文档定义了网格边界验证功能的需求。目标是确保卡片在调整大小或从文件夹拖出时，不会超出网格的限制区域。当前系统仅在 UI 层面（布局按钮置灰）进行了限制，但在数据层面缺少验证拦截，导致卡片可能溢出网格边界。

## Glossary

- **Grid_System**: 管理卡片位置和大小的网格系统
- **Boundary_Validator**: 验证卡片是否在网格边界内的验证器
- **Resize_Operation**: 调整卡片大小的操作
- **Drag_Out_Operation**: 从文件夹弹窗拖出卡片到主网格的操作
- **Grid_Config**: 网格配置，包含 columns（列数）、rows（行数）、unit（单元格大小）、gap（间距）

## Requirements

### Requirement 1: 调整大小时的边界验证

**User Story:** As a user, I want the system to prevent card resizing that would cause overflow, so that cards always stay within the grid boundaries.

#### Acceptance Criteria

1. WHEN a resize operation is requested THEN the Grid_System SHALL validate if the new size fits within grid boundaries
2. IF the new size would cause the card to overflow the grid boundary THEN the Grid_System SHALL reject the resize operation and keep the original size
3. WHEN a resize operation is rejected THEN the Grid_System SHALL NOT modify the card's size in the store
4. THE Boundary_Validator SHALL check both column overflow (col + colSpan > columns) and row overflow (row + rowSpan > rows)

### Requirement 2: 从文件夹拖出时的边界验证

**User Story:** As a user, I want items dragged out of folders to be placed within grid boundaries, so that they don't overflow the visible area.

#### Acceptance Criteria

1. WHEN an item is dragged out of a folder THEN the Grid_System SHALL find a valid position within grid boundaries
2. IF the item's size would cause overflow at the target position THEN the Grid_System SHALL find the nearest available position within boundaries
3. IF no valid position exists within boundaries THEN the Grid_System SHALL resize the item to fit (fallback to 1x1) or reject the operation
4. WHEN placing a dragged-out item THEN the Grid_System SHALL respect both column and row limits

### Requirement 3: 统一的边界验证工具函数

**User Story:** As a developer, I want a centralized boundary validation utility, so that all operations use consistent validation logic.

#### Acceptance Criteria

1. THE Grid_System SHALL provide a `canResizeItem` function that validates resize operations
2. THE Grid_System SHALL provide a `findValidPositionForSize` function that finds valid positions respecting boundaries
3. WHEN validating boundaries THEN the functions SHALL use the same logic as `getValidSizesForPosition`
4. THE validation functions SHALL be reusable across resize, drag-out, and any future operations

### Requirement 4: 保持现有 UI 反馈

**User Story:** As a user, I want to see visual feedback when a size option is unavailable, so that I understand why certain options are disabled.

#### Acceptance Criteria

1. THE Grid_System SHALL continue to show disabled layout buttons in the context menu for invalid sizes
2. WHEN a size is invalid due to boundary overflow THEN the button SHALL display a tooltip explaining the reason
3. THE UI feedback SHALL remain consistent with the data-level validation

</content>
</invoke>