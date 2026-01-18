# Requirements Document

## Introduction

本文档定义了卡片位置存储方式重构的需求。当前系统使用像素坐标 (x, y) 存储卡片位置，这种方式在网格配置（单元格尺寸、间距）变化时会导致位置错乱。重构后将使用网格坐标 (col, row) 存储位置，使卡片位置与网格配置解耦，提高系统的灵活性和可维护性。

## Glossary

- **Grid_Position**: 网格坐标，使用列索引 (col) 和行索引 (row) 表示卡片在网格中的位置
- **Pixel_Position**: 像素坐标，使用 x 和 y 像素值表示卡片在容器中的绝对位置
- **Position_Storage**: 位置存储系统，负责持久化卡片位置数据到 localStorage
- **Position_Converter**: 位置转换器，负责网格坐标与像素坐标之间的相互转换
- **Data_Migrator**: 数据迁移器，负责将旧格式（像素坐标）的数据迁移到新格式（网格坐标）
- **Grid_Config**: 网格配置，包含列数、行数、单元格尺寸、间距等参数

## Requirements

### Requirement 1: 位置数据类型重构

**User Story:** As a developer, I want card positions stored as grid coordinates, so that positions remain valid when grid configuration changes.

#### Acceptance Criteria

1. THE Position_Storage SHALL store card positions using Grid_Position format (col, row) instead of Pixel_Position format (x, y)
2. WHEN a card position is read from storage, THE Position_Storage SHALL return Grid_Position with col and row properties
3. WHEN a card position is written to storage, THE Position_Storage SHALL persist Grid_Position with col and row properties

### Requirement 2: 渲染时位置计算

**User Story:** As a user, I want cards to display correctly regardless of grid configuration changes, so that my layout remains consistent.

#### Acceptance Criteria

1. WHEN rendering a card, THE Position_Converter SHALL convert Grid_Position to Pixel_Position using current Grid_Config
2. WHEN Grid_Config changes (unit size, gap), THE Position_Converter SHALL recalculate Pixel_Position for all cards
3. THE Position_Converter SHALL ensure cards align to grid cell boundaries after conversion

### Requirement 3: 拖拽结束位置转换

**User Story:** As a user, I want to drag cards to new positions and have them snap to the grid, so that my layout stays organized.

#### Acceptance Criteria

1. WHEN a drag operation ends, THE Position_Converter SHALL convert the drop Pixel_Position to Grid_Position
2. WHEN converting drop position, THE Position_Converter SHALL round to the nearest valid grid cell
3. WHEN the converted Grid_Position is valid, THE Position_Storage SHALL persist the new Grid_Position
4. WHEN the converted Grid_Position is out of bounds, THE Position_Converter SHALL clamp to valid grid boundaries

### Requirement 4: 数据迁移

**User Story:** As a user with existing data, I want my current card positions preserved after the update, so that I don't lose my customized layout.

#### Acceptance Criteria

1. WHEN loading data with Pixel_Position format, THE Data_Migrator SHALL detect the legacy format
2. WHEN legacy format is detected, THE Data_Migrator SHALL convert Pixel_Position to Grid_Position using default Grid_Config
3. WHEN migration completes, THE Data_Migrator SHALL persist the migrated data in Grid_Position format
4. WHEN data is already in Grid_Position format, THE Data_Migrator SHALL skip migration
5. IF migration fails for any card, THEN THE Data_Migrator SHALL assign a default position (0, 0) and log a warning

### Requirement 5: 向后兼容性

**User Story:** As a developer, I want the refactoring to maintain API compatibility, so that existing components continue to work without changes.

#### Acceptance Criteria

1. THE Position_Storage SHALL maintain the same external interface for position operations
2. WHEN components request card positions for rendering, THE Position_Converter SHALL return Pixel_Position
3. WHEN components update card positions after drag, THE Position_Converter SHALL accept Pixel_Position and convert to Grid_Position for storage
4. THE Grid_Config parameters (columns, rows, unit, gap) SHALL remain configurable at runtime

