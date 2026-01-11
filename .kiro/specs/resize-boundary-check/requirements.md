# Requirements Document

## Introduction

本功能用于在调整快捷方式/插件卡片/文件夹的尺寸时，检查当前位置是否有足够的空间容纳新尺寸。如果空间不足（会超出网格边界），则禁用该尺寸选项或提示用户。

## Glossary

- **Grid_System**: 网格布局系统，由列数(columns)和行数(rows)定义，当前配置为12列4行
- **Grid_Item**: 网格中的项目，包括快捷方式(ShortcutItem)、插件卡片(PluginCardItem)和文件夹(ShortcutFolder)
- **Item_Size**: 项目尺寸，格式为"列x行"，如1x1、2x2、2x4
- **Item_Position**: 项目在网格中的位置，以像素坐标表示，可转换为网格坐标(col, row)
- **Resize_Operation**: 调整尺寸操作，通过右键菜单的布局选项触发

## Requirements

### Requirement 1: 尺寸调整边界检查

**User Story:** As a user, I want the system to prevent me from resizing items to sizes that would exceed the grid boundaries, so that my layout remains within the configured limits.

#### Acceptance Criteria

1. WHEN a user opens the layout menu for a Grid_Item, THE Grid_System SHALL calculate which sizes are valid based on the item's current position and the grid boundaries
2. WHEN a size option would cause the Grid_Item to exceed the maximum row limit (4 rows), THE Grid_System SHALL disable that size option in the layout menu
3. WHEN a size option would cause the Grid_Item to exceed the maximum column limit (12 columns), THE Grid_System SHALL disable that size option in the layout menu
4. WHEN a disabled size option is displayed, THE Grid_System SHALL provide visual feedback indicating the option is unavailable
5. THE Grid_System SHALL allow the currently selected size to remain selectable even if it would normally be disabled

### Requirement 2: 边界检查计算

**User Story:** As a developer, I want a utility function to calculate valid sizes for an item at a given position, so that the boundary check logic is reusable and testable.

#### Acceptance Criteria

1. THE Grid_System SHALL provide a function that accepts item position, current size, and grid dimensions as inputs
2. THE Grid_System SHALL return a list of valid sizes that fit within the grid boundaries from the given position
3. WHEN calculating valid sizes, THE Grid_System SHALL consider both column and row boundaries
4. THE Grid_System SHALL handle edge cases where the item is positioned at the grid boundary
