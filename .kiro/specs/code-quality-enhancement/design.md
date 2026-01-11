# Design Document

## Overview

本设计文档描述了对浏览器新标签页应用现有代码的质量优化方案。优化涵盖图标服务、搜索组件、天气插件、设置存储、快捷方式管理、时钟组件、右键菜单、弹窗组件、类型安全和性能监控等方面。

## Architecture

### 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                        App.tsx                               │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌──────────────────┐            │
│  │  Clock  │  │ Search  │  │ ShortcutsContainer│            │
│  └─────────┘  └─────────┘  └──────────────────┘            │
├─────────────────────────────────────────────────────────────┤
│                     Stores (Zustand)                         │
│  ┌─────────────────┐  ┌──────────────────┐                  │
│  │  settingsStore  │  │  shortcutsStore  │                  │
│  └─────────────────┘  └──────────────────┘                  │
├─────────────────────────────────────────────────────────────┤
│                     Utils & Services                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │ favicon  │  │  clock   │  │  search  │                   │
│  └──────────┘  └──────────┘  └──────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

### 优化后的服务层架构

```
┌─────────────────────────────────────────────────────────────┐
│                    FaviconService                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ MemoryCache │  │ FallbackChain│  │ Preloader   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. FaviconService 图标服务

```typescript
interface FaviconCache {
  url: string;
  timestamp: number;
  blob?: Blob;
}

interface FaviconServiceConfig {
  cacheTTL: number;        // 缓存过期时间（毫秒）
  maxCacheSize: number;    // 最大缓存数量
  defaultSize: number;     // 默认图标尺寸
}

interface FaviconService {
  // 获取图标 URL，支持多源回退
  getFaviconUrl(url: string, size?: number): Promise<string>;
  
  // 预加载多个图标
  preloadFavicons(urls: string[]): Promise<void>;
  
  // 清除缓存
  clearCache(): void;
  
  // 生成占位符
  generatePlaceholder(name: string, size: number): string;
}

// 图标源优先级
const FAVICON_SOURCES = [
  'https://www.google.com/s2/favicons?domain={domain}&sz={size}',
  'https://icons.duckduckgo.com/ip3/{domain}.ico',
  '{origin}/favicon.ico',
];
```

### 2. SearchComponent 搜索组件增强

```typescript
interface SearchState {
  query: string;
  isHistoryVisible: boolean;
  selectedIndex: number;
  isFocused: boolean;
}

interface SearchEnhancedProps extends SearchProps {
  debounceMs?: number;           // 防抖延迟
  highlightMatches?: boolean;    // 高亮匹配文本
  detectUrls?: boolean;          // 检测 URL 模式
}

// URL 检测正则
const URL_PATTERN = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/\S*)?$/i;

// 高亮匹配文本组件
function HighlightedText({ text, query }: { text: string; query: string }): JSX.Element;
```

### 3. WeatherPlugin 天气插件稳定性

```typescript
interface WeatherCache {
  data: WeatherData;
  timestamp: number;
  location: string;
}

interface RetryConfig {
  maxRetries: number;
  baseDelay: number;      // 基础延迟（毫秒）
  maxDelay: number;       // 最大延迟（毫秒）
}

interface WeatherServiceEnhanced {
  // 带重试的获取天气
  fetchWithRetry(location: string, config: RetryConfig): Promise<WeatherData>;
  
  // 获取缓存的天气数据
  getCachedWeather(): WeatherCache | null;
  
  // 验证位置输入
  validateLocation(location: string): boolean;
  
  // 获取当前地理位置
  getCurrentLocation(): Promise<GeolocationPosition>;
}

// 指数退避计算
function calculateBackoff(attempt: number, baseDelay: number, maxDelay: number): number {
  return Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
}
```

### 4. SettingsStore 设置存储增强

```typescript
interface SettingsVersion {
  version: number;
  migratedAt: number;
}

interface SettingsValidation {
  isValid: boolean;
  errors: string[];
}

// 版本迁移函数类型
type MigrationFn = (oldState: unknown) => Partial<SettingsState>;

interface SettingsStoreEnhanced {
  // 验证设置数据
  validateSettings(data: unknown): SettingsValidation;
  
  // 执行版本迁移
  migrateSettings(fromVersion: number): void;
  
  // 获取当前版本
  getVersion(): number;
}

// 迁移注册表
const MIGRATIONS: Record<number, MigrationFn> = {
  1: (state) => ({ ...state, /* v0 -> v1 迁移 */ }),
  2: (state) => ({ ...state, /* v1 -> v2 迁移 */ }),
};
```

### 5. ShortcutsStore 快捷方式数据完整性

```typescript
interface ShortcutValidation {
  isValid: boolean;
  repairedFields: string[];
  removedItems: string[];
}

interface UndoAction {
  type: 'delete';
  items: GridItem[];
  timestamp: number;
}

interface ShortcutsStoreEnhanced {
  // 验证并修复快捷方式数据
  validateAndRepair(): ShortcutValidation;
  
  // 检查是否达到限制
  isAtLimit(): boolean;
  
  // 撤销删除
  undoDelete(): boolean;
  
  // 获取撤销状态
  canUndo(): boolean;
}

const SHORTCUTS_LIMIT = 200;
const UNDO_TIMEOUT = 5000; // 5秒
```

### 6. ClockComponent 时钟组件优化

```typescript
interface ClockOptimizations {
  // 可见性状态
  isVisible: boolean;
  
  // 农历缓存
  lunarCache: Map<string, string>;
  
  // 上次更新时间
  lastUpdate: number;
}

// 农历缓存键生成
function getLunarCacheKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

// 使用 Page Visibility API
function usePageVisibility(): boolean;
```

### 7. ContextMenu 右键菜单改进

```typescript
interface ContextMenuA11y {
  role: 'menu';
  'aria-label': string;
  'aria-activedescendant'?: string;
}

interface ContextMenuItemA11y {
  role: 'menuitem';
  'aria-disabled'?: boolean;
  'aria-haspopup'?: boolean;
  tabIndex: number;
}

interface ContextMenuEnhanced extends ContextMenuProps {
  // 键盘导航
  onKeyDown: (e: KeyboardEvent) => void;
  
  // 触摸支持
  onTouchStart?: (e: TouchEvent) => void;
  onTouchEnd?: (e: TouchEvent) => void;
}

// 长按检测配置
const LONG_PRESS_DURATION = 500; // 毫秒
```

### 8. IframeModal 弹窗组件统一

```typescript
interface ModalPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ModalPositionCache {
  [url: string]: ModalPosition;
}

interface IframeModalEnhanced extends IframeModalProps {
  // 最小/最大尺寸约束
  minSize?: { width: number; height: number };
  maxSize?: { width: number; height: number };
  
  // 记住位置
  rememberPosition?: boolean;
}

// 使用共享的拖拽 Hook
function useDraggableModal(options: DraggableOptions): DraggableState;
```

## Data Models

### 缓存数据结构

```typescript
// 图标缓存
interface FaviconCacheEntry {
  url: string;
  dataUrl: string;
  fetchedAt: number;
  size: number;
}

// 天气缓存
interface WeatherCacheEntry {
  data: WeatherData;
  location: string;
  fetchedAt: number;
  expiresAt: number;
}

// 弹窗位置缓存
interface ModalPositionEntry {
  url: string;
  position: ModalPosition;
  savedAt: number;
}
```

### 验证 Schema

```typescript
// 快捷方式验证 Schema
const ShortcutItemSchema = {
  id: { type: 'string', required: true },
  name: { type: 'string', required: true, maxLength: 50 },
  url: { type: 'string', required: true, pattern: URL_PATTERN },
  icon: { type: 'string', required: true },
  size: { type: 'enum', values: ['1x1', '1x2', '2x1', '2x2', '2x4'], default: '1x1' },
  openMode: { type: 'enum', values: ['tab', 'popup'], default: 'tab' },
};

// 设置验证 Schema
const SettingsSchema = {
  version: { type: 'number', required: true },
  openInNewTab: { type: 'boolean', default: true },
  showClock: { type: 'boolean', default: true },
  showSearch: { type: 'boolean', default: true },
  showShortcuts: { type: 'boolean', default: true },
  // ... 其他字段
};
```



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Favicon Service Caching and Fallback

*For any* URL, calling `getFaviconUrl` twice with the same URL should return the same result, and if the primary source fails, the service should try alternative sources in order until one succeeds or all fail.

**Validates: Requirements 1.1, 1.2**

### Property 2: Favicon Placeholder Generation

*For any* site name string, when all favicon sources fail, the generated placeholder should contain the uppercase first character of the name and be a valid data URL.

**Validates: Requirements 1.3**

### Property 3: Favicon Size Support

*For any* valid icon size (16, 32, 64, 128), the returned favicon URL should include the requested size parameter.

**Validates: Requirements 1.5**

### Property 4: Search Input Debounce

*For any* sequence of rapid input changes within the debounce window, the number of state updates should be less than or equal to the number of debounce windows elapsed.

**Validates: Requirements 2.2**

### Property 5: Search History Highlight

*For any* search query and history item that contains the query as a substring, the rendered output should contain the query wrapped in highlight markup.

**Validates: Requirements 2.3**

### Property 6: Search History Removal

*For any* history list and item in that list, removing the item should result in a list that does not contain that item and has length reduced by one.

**Validates: Requirements 2.4**

### Property 7: URL Pattern Detection

*For any* string matching the URL pattern (with or without protocol), the search component should offer direct navigation option.

**Validates: Requirements 2.5**

### Property 8: Search Engine Switch Preserves Query

*For any* non-empty search query and any search engine change, the query should remain unchanged after the engine switch.

**Validates: Requirements 2.6**

### Property 9: Weather Retry Exponential Backoff

*For any* retry attempt number n, the delay should equal `min(baseDelay * 2^n, maxDelay)`.

**Validates: Requirements 3.1**

### Property 10: Weather Cache Timestamp

*For any* successful weather fetch, the cache should contain the weather data with a timestamp within 1 second of the current time.

**Validates: Requirements 3.2**

### Property 11: Weather Cache Age Display

*For any* cached weather data with timestamp T, the displayed "Updated X ago" text should correctly represent the time difference between now and T.

**Validates: Requirements 3.3**

### Property 12: Weather Location Validation

*For any* location string that is empty or contains only whitespace/special characters, validation should return false.

**Validates: Requirements 3.4**

### Property 13: Settings Data Validation

*For any* settings object, validation should return true if and only if all required fields are present with correct types.

**Validates: Requirements 4.1**

### Property 14: Settings Version Migration

*For any* settings data with version N, migration should produce valid settings data with version equal to the current schema version.

**Validates: Requirements 4.3**

### Property 15: Shortcuts Validation and Repair

*For any* shortcut with missing required fields (id, name, url, icon), the validation should either repair the shortcut with defaults or mark it for removal.

**Validates: Requirements 5.1, 5.2**

### Property 16: Shortcuts Duplicate Prevention

*For any* shortcuts list, after adding a shortcut with an existing ID, the list should contain exactly one shortcut with that ID.

**Validates: Requirements 5.3**

### Property 17: Shortcuts Limit Enforcement

*For any* shortcuts list at the maximum limit, attempting to add a new shortcut should fail and the list length should remain unchanged.

**Validates: Requirements 5.4**

### Property 18: Shortcuts Delete Undo Round-Trip

*For any* shortcuts list and deleted item, calling undo within the timeout period should restore the list to its original state.

**Validates: Requirements 5.6**

### Property 19: Lunar Date Memoization

*For any* date, calling `getLunarDate` twice with the same date should return the same result without recalculating.

**Validates: Requirements 6.5**

### Property 20: Context Menu Keyboard Navigation

*For any* menu with N items and current index I, pressing ArrowDown should set index to min(I+1, N-1), and pressing ArrowUp should set index to max(I-1, 0).

**Validates: Requirements 7.1**

### Property 21: Context Menu ARIA Attributes

*For any* context menu, the container should have role="menu" and each item should have role="menuitem".

**Validates: Requirements 7.2**

### Property 22: Context Menu Viewport Flip

*For any* menu position where the menu would extend beyond the viewport edge, the menu should flip to the opposite side to remain fully visible.

**Validates: Requirements 7.3**

### Property 23: Modal Position Persistence

*For any* URL, closing and reopening a modal should restore the last saved position and size for that URL.

**Validates: Requirements 8.2**

### Property 24: Modal Z-Index Stacking

*For any* sequence of modal opens, each subsequently opened modal should have a higher z-index than previously opened modals.

**Validates: Requirements 8.3**

### Property 25: Modal Size Constraints

*For any* resize operation, the resulting modal size should be clamped between minSize and maxSize.

**Validates: Requirements 8.5**

### Property 26: Modal Body Scroll Lock

*For any* open modal, the document body should have overflow set to 'hidden', and closing the modal should restore the original overflow value.

**Validates: Requirements 8.6**

## Error Handling

### Favicon Service Errors

1. **Network Failure**: Try fallback sources in order, generate placeholder if all fail
2. **Invalid URL**: Return placeholder immediately without network request
3. **Cache Corruption**: Clear corrupted entries and refetch

### Weather Plugin Errors

1. **API Failure**: Retry with exponential backoff, show cached data with age indicator
2. **Invalid Location**: Show validation error with suggestions
3. **Geolocation Denied**: Fall back to manual location input

### Settings Store Errors

1. **Corrupted Data**: Reset to defaults, notify user
2. **Migration Failure**: Keep old data, log error, notify user
3. **Storage Full**: Warn user, suggest clearing old data

### Shortcuts Store Errors

1. **Invalid Data**: Repair or remove invalid entries
2. **Duplicate IDs**: Keep first occurrence, remove duplicates
3. **Limit Exceeded**: Prevent addition, warn user

## Testing Strategy

### Unit Tests

Unit tests will cover specific examples and edge cases:

- Favicon placeholder generation with various name inputs
- URL pattern matching edge cases
- Weather location validation edge cases
- Settings migration from specific old versions
- Shortcuts validation with various invalid data patterns

### Property-Based Tests

Property-based tests will use `fast-check` library to verify universal properties:

- Each property test will run minimum 100 iterations
- Tests will be tagged with format: **Feature: code-quality-enhancement, Property N: {property_text}**
- Generators will be designed to produce realistic test data

### Test Configuration

```typescript
// vitest.config.ts additions
export default defineConfig({
  test: {
    // ... existing config
    testTimeout: 10000, // Allow time for property tests
  },
});
```

### Property Test Examples

```typescript
import { fc } from 'fast-check';

// Property 3: Favicon Size Support
test('favicon URL includes requested size', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(16, 32, 64, 128),
      fc.webUrl(),
      (size, url) => {
        const faviconUrl = getFaviconUrl(url, size);
        return faviconUrl.includes(`sz=${size}`) || faviconUrl.includes(`size=${size}`);
      }
    ),
    { numRuns: 100 }
  );
});

// Property 9: Exponential Backoff
test('retry delay follows exponential backoff', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 0, max: 10 }),
      fc.integer({ min: 100, max: 1000 }),
      fc.integer({ min: 5000, max: 30000 }),
      (attempt, baseDelay, maxDelay) => {
        const delay = calculateBackoff(attempt, baseDelay, maxDelay);
        const expected = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
        return delay === expected;
      }
    ),
    { numRuns: 100 }
  );
});
```
