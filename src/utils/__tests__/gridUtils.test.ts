/**
 * gridUtils 单元测试
 */
import { describe, it, expect } from 'vitest';
import {
  getGridSpan,
  pixelToGrid,
  gridToPixel,
  getItemSize,
  canResizeItem,
  findValidPositionInBounds,
  GridManager,
  TEXT_HEIGHT,
} from '../gridUtils';
import type { ShortcutSize, GridItem } from '@/types';

describe('gridUtils', () => {
  describe('getGridSpan', () => {
    it('应该正确解析 1x1 尺寸', () => {
      expect(getGridSpan('1x1')).toEqual({ colSpan: 1, rowSpan: 1 });
    });

    it('应该正确解析 2x2 尺寸', () => {
      expect(getGridSpan('2x2')).toEqual({ colSpan: 2, rowSpan: 2 });
    });

    it('应该正确解析 2x4 尺寸', () => {
      expect(getGridSpan('2x4')).toEqual({ colSpan: 2, rowSpan: 4 });
    });

    it('应该正确解析 1x2 尺寸', () => {
      expect(getGridSpan('1x2')).toEqual({ colSpan: 1, rowSpan: 2 });
    });

    it('应该正确解析 2x1 尺寸', () => {
      expect(getGridSpan('2x1')).toEqual({ colSpan: 2, rowSpan: 1 });
    });

    it('默认应该返回 1x1', () => {
      expect(getGridSpan()).toEqual({ colSpan: 1, rowSpan: 1 });
    });
  });

  describe('pixelToGrid', () => {
    const unit = 64;
    const gap = 16;

    it('应该将原点像素坐标转换为网格坐标', () => {
      expect(pixelToGrid(0, 0, unit, gap)).toEqual({ col: 0, row: 0 });
    });

    it('应该正确转换第一行第二列的坐标', () => {
      const hGap = gap + TEXT_HEIGHT;
      const cellWidth = unit + hGap;
      expect(pixelToGrid(cellWidth, 0, unit, gap)).toEqual({ col: 1, row: 0 });
    });

    it('应该正确转换第二行第一列的坐标', () => {
      const cellHeight = unit + TEXT_HEIGHT + gap;
      expect(pixelToGrid(0, cellHeight, unit, gap)).toEqual({ col: 0, row: 1 });
    });

    it('应该正确转换第二行第二列的坐标', () => {
      const hGap = gap + TEXT_HEIGHT;
      const cellWidth = unit + hGap;
      const cellHeight = unit + TEXT_HEIGHT + gap;
      expect(pixelToGrid(cellWidth, cellHeight, unit, gap)).toEqual({ col: 1, row: 1 });
    });
  });

  describe('gridToPixel', () => {
    const unit = 64;
    const gap = 16;

    it('应该将网格原点转换为像素坐标', () => {
      expect(gridToPixel(0, 0, unit, gap)).toEqual({ x: 0, y: 0 });
    });

    it('应该正确转换第一行第二列', () => {
      const hGap = gap + TEXT_HEIGHT;
      const cellWidth = unit + hGap;
      expect(gridToPixel(1, 0, unit, gap)).toEqual({ x: cellWidth, y: 0 });
    });

    it('应该正确转换第二行第一列', () => {
      const cellHeight = unit + TEXT_HEIGHT + gap;
      expect(gridToPixel(0, 1, unit, gap)).toEqual({ x: 0, y: cellHeight });
    });

    it('应该正确转换第二行第二列', () => {
      const hGap = gap + TEXT_HEIGHT;
      const cellWidth = unit + hGap;
      const cellHeight = unit + TEXT_HEIGHT + gap;
      expect(gridToPixel(1, 1, unit, gap)).toEqual({ x: cellWidth, y: cellHeight });
    });
  });

  describe('pixelToGrid 和 gridToPixel 往返', () => {
    const unit = 64;
    const gap = 16;

    it('应该能够往返转换 (0, 0)', () => {
      const pixel = gridToPixel(0, 0, unit, gap);
      const grid = pixelToGrid(pixel.x, pixel.y, unit, gap);
      expect(grid).toEqual({ col: 0, row: 0 });
    });

    it('应该能够往返转换 (2, 3)', () => {
      const pixel = gridToPixel(2, 3, unit, gap);
      const grid = pixelToGrid(pixel.x, pixel.y, unit, gap);
      expect(grid).toEqual({ col: 2, row: 3 });
    });
  });

  describe('getItemSize', () => {
    const unit = 64;
    const gap = 16;
    const hGap = gap + TEXT_HEIGHT;

    it('应该正确计算 1x1 卡片尺寸', () => {
      const item: GridItem = {
        id: 'test',
        name: 'Test',
        url: 'https://test.com',
        icon: '🔗',
        size: '1x1',
        position: { x: 0, y: 0 },
      };
      expect(getItemSize(item, unit, gap)).toEqual({
        width: unit,
        height: unit + TEXT_HEIGHT,
      });
    });

    it('应该正确计算 2x2 卡片尺寸', () => {
      const item: GridItem = {
        id: 'test',
        name: 'Test',
        url: 'https://test.com',
        icon: '🔗',
        size: '2x2',
        position: { x: 0, y: 0 },
      };
      expect(getItemSize(item, unit, gap)).toEqual({
        width: 2 * unit + hGap,
        height: 2 * (unit + TEXT_HEIGHT) + gap,
      });
    });

    it('应该正确计算 2x4 卡片尺寸', () => {
      const item: GridItem = {
        id: 'test',
        name: 'Test',
        url: 'https://test.com',
        icon: '🔗',
        size: '2x4',
        position: { x: 0, y: 0 },
      };
      expect(getItemSize(item, unit, gap)).toEqual({
        width: 2 * unit + hGap,
        height: 4 * (unit + TEXT_HEIGHT) + 3 * gap,
      });
    });
  });

  describe('canResizeItem', () => {
    const gridConfig = {
      columns: 4,
      rows: 4,
      unit: 64,
      gap: 16,
    };

    it('应该允许在边界内调整尺寸', () => {
      const position = { x: 0, y: 0 };
      expect(canResizeItem(position, '2x2', gridConfig)).toBe(true);
    });

    it('应该拒绝超出列边界的调整', () => {
      const position = gridToPixel(3, 0, gridConfig.unit, gridConfig.gap);
      expect(canResizeItem(position, '2x2', gridConfig)).toBe(false);
    });

    it('应该拒绝超出行边界的调整', () => {
      const position = gridToPixel(0, 3, gridConfig.unit, gridConfig.gap);
      expect(canResizeItem(position, '2x2', gridConfig)).toBe(false);
    });

    it('应该允许在角落调整为 1x1', () => {
      const position = gridToPixel(3, 3, gridConfig.unit, gridConfig.gap);
      expect(canResizeItem(position, '1x1', gridConfig)).toBe(true);
    });
  });

  describe('findValidPositionInBounds', () => {
    const gridConfig = {
      columns: 4,
      rows: 4,
      unit: 64,
      gap: 16,
    };

    it('应该返回目标位置（如果有效）', () => {
      const result = findValidPositionInBounds(0, 0, '1x1', gridConfig);
      expect(result).toEqual({ col: 0, row: 0 });
    });

    it('应该在目标位置无效时查找最近的有效位置', () => {
      const occupied = new Set(['0,0']);
      const result = findValidPositionInBounds(0, 0, '1x1', gridConfig, occupied);
      expect(result).not.toBeNull();
      expect(result).not.toEqual({ col: 0, row: 0 });
    });

    it('应该在没有足够空间时返回 null', () => {
      const occupied = new Set<string>();
      // 占满整个网格
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          occupied.add(`${c},${r}`);
        }
      }
      const result = findValidPositionInBounds(0, 0, '1x1', gridConfig, occupied);
      expect(result).toBeNull();
    });

    it('应该拒绝超出边界的尺寸', () => {
      const result = findValidPositionInBounds(0, 0, '2x4' as ShortcutSize, {
        ...gridConfig,
        rows: 3,
      });
      expect(result).toBeNull();
    });
  });

  describe('GridManager', () => {
    const columns = 4;
    const rows = 4;
    const unit = 64;
    const gap = 16;

    describe('canPlace', () => {
      it('应该允许在空网格中放置卡片', () => {
        const manager = new GridManager(columns, rows, unit, gap);
        expect(manager.canPlace(0, 0, 1, 1)).toBe(true);
      });

      it('应该拒绝超出列边界的放置', () => {
        const manager = new GridManager(columns, rows, unit, gap);
        expect(manager.canPlace(4, 0, 1, 1)).toBe(false);
      });

      it('应该拒绝超出行边界的放置', () => {
        const manager = new GridManager(columns, rows, unit, gap);
        expect(manager.canPlace(0, 4, 1, 1)).toBe(false);
      });

      it('应该拒绝负坐标', () => {
        const manager = new GridManager(columns, rows, unit, gap);
        expect(manager.canPlace(-1, 0, 1, 1)).toBe(false);
        expect(manager.canPlace(0, -1, 1, 1)).toBe(false);
      });

      it('应该拒绝在已占用位置放置', () => {
        const manager = new GridManager(columns, rows, unit, gap);
        manager.occupy(0, 0, 1, 1);
        expect(manager.canPlace(0, 0, 1, 1)).toBe(false);
      });

      it('应该检测与已占用区域的部分重叠', () => {
        const manager = new GridManager(columns, rows, unit, gap);
        manager.occupy(1, 1, 2, 2);
        expect(manager.canPlace(0, 0, 2, 2)).toBe(false); // 与 (1,1) 重叠
        expect(manager.canPlace(2, 2, 2, 2)).toBe(false); // 与 (2,2) 重叠
      });
    });

    describe('occupy', () => {
      it('应该正确标记单个单元格为已占用', () => {
        const manager = new GridManager(columns, rows, unit, gap);
        manager.occupy(0, 0, 1, 1);
        expect(manager.canPlace(0, 0, 1, 1)).toBe(false);
        expect(manager.canPlace(1, 0, 1, 1)).toBe(true);
      });

      it('应该正确标记多个单元格为已占用', () => {
        const manager = new GridManager(columns, rows, unit, gap);
        manager.occupy(0, 0, 2, 2);
        expect(manager.canPlace(0, 0, 1, 1)).toBe(false);
        expect(manager.canPlace(1, 0, 1, 1)).toBe(false);
        expect(manager.canPlace(0, 1, 1, 1)).toBe(false);
        expect(manager.canPlace(1, 1, 1, 1)).toBe(false);
        expect(manager.canPlace(2, 0, 1, 1)).toBe(true);
      });
    });

    describe('findNearestAvailable', () => {
      it('应该返回目标位置（如果可用）', () => {
        const manager = new GridManager(columns, rows, unit, gap);
        const result = manager.findNearestAvailable(0, 0, 1, 1);
        expect(result).toEqual({ col: 0, row: 0 });
      });

      it('应该在目标位置被占用时查找最近的位置', () => {
        const manager = new GridManager(columns, rows, unit, gap);
        manager.occupy(0, 0, 1, 1);
        const result = manager.findNearestAvailable(0, 0, 1, 1);
        expect(result).not.toBeNull();
        expect(result).not.toEqual({ col: 0, row: 0 });
      });

      it('应该在网格已满时返回 null', () => {
        const manager = new GridManager(columns, rows, unit, gap);
        // 占满整个网格
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < columns; c++) {
            manager.occupy(c, r, 1, 1);
          }
        }
        const result = manager.findNearestAvailable(0, 0, 1, 1);
        expect(result).toBeNull();
      });

      it('应该为大尺寸卡片查找足够的空间', () => {
        const manager = new GridManager(columns, rows, unit, gap);
        manager.occupy(0, 0, 1, 1);
        const result = manager.findNearestAvailable(0, 0, 2, 2);
        expect(result).not.toBeNull();
        if (result) {
          expect(manager.canPlace(result.col, result.row, 2, 2)).toBe(true);
        }
      });
    });

    describe('initFromItems', () => {
      it('应该从卡片列表初始化网格', () => {
        const manager = new GridManager(columns, rows, unit, gap);
        const items: GridItem[] = [
          {
            id: '1',
            name: 'Test 1',
            url: 'https://test.com',
            icon: '🔗',
            size: '1x1',
            position: { x: 0, y: 0 },
          },
          {
            id: '2',
            name: 'Test 2',
            url: 'https://test.com',
            icon: '🔗',
            size: '2x2',
            position: gridToPixel(1, 1, unit, gap),
          },
        ];
        manager.initFromItems(items);
        expect(manager.canPlace(0, 0, 1, 1)).toBe(false);
        expect(manager.canPlace(1, 1, 1, 1)).toBe(false);
        expect(manager.canPlace(2, 2, 1, 1)).toBe(false);
        expect(manager.canPlace(3, 3, 1, 1)).toBe(true);
      });

      it('应该排除指定 ID 的卡片', () => {
        const manager = new GridManager(columns, rows, unit, gap);
        const items: GridItem[] = [
          {
            id: '1',
            name: 'Test 1',
            url: 'https://test.com',
            icon: '🔗',
            size: '1x1',
            position: { x: 0, y: 0 },
          },
        ];
        manager.initFromItems(items, '1');
        expect(manager.canPlace(0, 0, 1, 1)).toBe(true);
      });

      it('应该忽略没有 position 的卡片', () => {
        const manager = new GridManager(columns, rows, unit, gap);
        const items: GridItem[] = [
          {
            id: '1',
            name: 'Test 1',
            url: 'https://test.com',
            icon: '🔗',
            size: '1x1',
          },
        ];
        manager.initFromItems(items);
        expect(manager.canPlace(0, 0, 1, 1)).toBe(true);
      });
    });

    describe('getOccupiedCells', () => {
      it('应该返回已占用单元格的副本', () => {
        const manager = new GridManager(columns, rows, unit, gap);
        manager.occupy(0, 0, 1, 1);
        manager.occupy(1, 1, 1, 1);
        const occupied = manager.getOccupiedCells();
        expect(occupied.has('0,0')).toBe(true);
        expect(occupied.has('1,1')).toBe(true);
        expect(occupied.size).toBe(2);
      });

      it('返回的集合应该是副本，不影响原始数据', () => {
        const manager = new GridManager(columns, rows, unit, gap);
        manager.occupy(0, 0, 1, 1);
        const occupied = manager.getOccupiedCells();
        occupied.add('2,2');
        expect(manager.canPlace(2, 2, 1, 1)).toBe(true);
      });
    });
  });
});
