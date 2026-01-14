# Design Document: Project Optimization

## Overview

本设计文档描述了 AI Nav 项目的优化方案，涵盖 Store 模式统一化、类型定义优化、错误处理增强、插件系统增强、性能优化、测试覆盖增强、代码组织优化和数据持久化增强等方面。

## Architecture

### 整体架构优化

```
src/
├── components/           # 通用组件（保持不变）
├── features/             # 功能模块
│   ├── [feature]/
│   │   ├── components/   # 功能组件
│   │   ├── hooks/        # 功能 hooks
│   │   ├── store/        # 统一的 store 结构
│   │   │   ├── index.ts  # 统一导出
│   │   │   ├── store.ts  # store 实现
│   │   │   └── types.ts  # 类型定义
│   │   ├── utils/        # 功能工具函数
│   │   └── index.ts      # 功能入口
├── hooks/                # 全局 hooks（按类别组织）
│   ├── state/            # 状态相关 hooks
│   ├── behavior/         # 行为相关 hooks
│   └── utility/          # 工具 hooks
├── plugins/              # 插件系统（增强）
│   ├── core/
│   │   ├── pluginManager.ts  # 增强的插件管理器
│   │   ├── pluginAPI.ts      # 增强的插件 API
│   │   └── pluginLifecycle.ts # 新增：生命周期管理
│   └── ...
├── services/             # 新增：服务层
│   ├── backup/           # 备份服务
│   └── storage/          # 存储服务
├── types/                # 统一类型定义
├── utils/                # 工具函数
└── constants/            # 常量（可拆分）
    ├── grid.ts
    ├── defaults.ts
    └── wallpapers.ts
```

## Components and Interfaces

### 1. Store 模式统一化

#### 统一的 Store 结构

```typescript
// features/[feature]/store/types.ts
export interface FeatureState {
  // 状态字段
  data: DataType;
  // 操作方法
  updateData: (data: DataType) => void;
  resetFeature: () => void;
}

// features/[feature]/store/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FeatureState } from './types';

const DEFAULT_STATE = {
  data: initialValue,
};

export const useFeatureStore = create<FeatureState>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,
      updateData: (data) => set({ data }),
      resetFeature: () => set(DEFAULT_STATE),
    }),
    { name: 'feature-storage' }
  )
);

// features/[feature]/store/index.ts
export { useFeatureStore } from './store';
export type { FeatureState } from './types';
```

### 2. 类型定义优化

#### 统一类型导出结构

```typescript
// src/types/index.ts - 作为唯一的类型导出入口
export type { CardSize, OpenMode, Position } from './core';
export type { ShortcutItem, ShortcutFolder, ShortcutEntry } from './shortcuts';
export type { Plugin, PluginAPI, PluginConfig, PluginMetadata } from './plugins';
export type { GridItem } from './grid';

// 类型守卫统一导出
export { isShortcutFolder, isShortcutItem, isPluginCard } from './guards';
```

### 3. 错误处理增强

#### 增强的 ErrorBoundary

```typescript
// src/components/ErrorBoundary/ErrorBoundary.tsx
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}
```

#### 插件错误处理

```typescript
// src/plugins/core/pluginManager.ts
class PluginManager {
  register(plugin: Plugin): PluginRegistrationResult {
    try {
      // 验证插件结构
      const validationResult = this.validatePlugin(plugin);
      if (!validationResult.isValid) {
        console.error(`Plugin validation failed: ${validationResult.errors.join(', ')}`);
        return { success: false, errors: validationResult.errors };
      }
      // 注册插件
      this.plugins.set(plugin.metadata.id, plugin);
      return { success: true };
    } catch (error) {
      console.error(`Failed to register plugin ${plugin.metadata.id}:`, error);
      return { success: false, errors: [String(error)] };
    }
  }

  private validatePlugin(plugin: Plugin): ValidationResult {
    const errors: string[] = [];
    if (!plugin.metadata?.id) errors.push('Missing plugin id');
    if (!plugin.metadata?.name) errors.push('Missing plugin name');
    if (!plugin.metadata?.version) errors.push('Missing plugin version');
    return { isValid: errors.length === 0, errors };
  }
}
```

### 4. 插件系统增强

#### 插件生命周期接口

```typescript
// src/types/plugins.ts
export interface PluginLifecycle {
  onMount?: () => void | Promise<void>;
  onUnmount?: () => void | Promise<void>;
  onConfigChange?: (oldConfig: PluginConfig, newConfig: PluginConfig) => void;
  onEnable?: () => void;
  onDisable?: () => void;
}

export interface Plugin extends PluginLifecycle {
  metadata: PluginMetadata;
  // ... 其他字段
}
```

#### 生命周期管理器

```typescript
// src/plugins/core/pluginLifecycle.ts
export class PluginLifecycleManager {
  private mountedPlugins = new Set<string>();

  async mountPlugin(pluginId: string): Promise<void> {
    const plugin = pluginManager.getPlugin(pluginId);
    if (!plugin || this.mountedPlugins.has(pluginId)) return;
    
    try {
      await plugin.onMount?.();
      this.mountedPlugins.add(pluginId);
    } catch (error) {
      console.error(`Failed to mount plugin ${pluginId}:`, error);
    }
  }

  async unmountPlugin(pluginId: string): Promise<void> {
    const plugin = pluginManager.getPlugin(pluginId);
    if (!plugin || !this.mountedPlugins.has(pluginId)) return;
    
    try {
      await plugin.onUnmount?.();
      this.mountedPlugins.delete(pluginId);
    } catch (error) {
      console.error(`Failed to unmount plugin ${pluginId}:`, error);
    }
  }
}
```

### 5. 性能优化

#### 虚拟化网格组件

```typescript
// src/features/shortcuts/components/VirtualizedGrid.tsx
interface VirtualizedGridProps {
  items: GridItem[];
  columns: number;
  rows: number;
  unit: number;
  gap: number;
  renderItem: (item: GridItem) => React.ReactNode;
}

// 使用 Intersection Observer 实现懒加载
export function VirtualizedGrid({ items, renderItem, ...config }: VirtualizedGridProps) {
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  // 实现虚拟化逻辑
}
```

#### 图片渐进加载

```typescript
// src/components/Image/ProgressiveImage.tsx
interface ProgressiveImageProps {
  src: string;
  placeholder?: string;
  blurAmount?: number;
  onLoad?: () => void;
}
```

### 6. 数据持久化增强

#### 备份服务

```typescript
// src/services/backup/backupService.ts
export interface BackupData {
  version: string;
  timestamp: number;
  shortcuts: GridItem[];
  settings: {
    general: GeneralState;
    clock: ClockState;
    search: SearchState;
    background: BackgroundState;
  };
  plugins: {
    configs: Record<string, PluginConfig>;
    data: Record<string, unknown>;
  };
}

export class BackupService {
  private readonly BACKUP_KEY = 'ai-nav-backup';
  private readonly CURRENT_VERSION = '1.0.0';

  export(): BackupData {
    return {
      version: this.CURRENT_VERSION,
      timestamp: Date.now(),
      shortcuts: useShortcutsStore.getState().shortcuts,
      settings: {
        general: useGeneralStore.getState(),
        clock: useClockStore.getState(),
        search: useSearchStore.getState(),
        background: useBackgroundStore.getState(),
      },
      plugins: {
        configs: usePluginStore.getState().pluginConfigs,
        data: usePluginStore.getState().pluginData,
      },
    };
  }

  import(data: BackupData): ImportResult {
    try {
      // 版本检查和迁移
      const migratedData = this.migrateIfNeeded(data);
      // 恢复数据
      this.restoreData(migratedData);
      return { success: true };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  private migrateIfNeeded(data: BackupData): BackupData {
    // 版本迁移逻辑
    if (data.version !== this.CURRENT_VERSION) {
      return this.migrate(data, data.version, this.CURRENT_VERSION);
    }
    return data;
  }
}
```

## Data Models

### BackupData 模型

```typescript
interface BackupData {
  version: string;           // 数据版本号
  timestamp: number;         // 备份时间戳
  shortcuts: GridItem[];     // 快捷方式数据
  settings: SettingsData;    // 设置数据
  plugins: PluginData;       // 插件数据
}

interface SettingsData {
  general: GeneralState;
  clock: ClockState;
  search: SearchState;
  background: BackgroundState;
}

interface PluginData {
  configs: Record<string, PluginConfig>;
  data: Record<string, unknown>;
}
```

### ValidationResult 模型

```typescript
interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

interface PluginRegistrationResult {
  success: boolean;
  errors?: string[];
}

interface ImportResult {
  success: boolean;
  error?: string;
  migratedFrom?: string;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Plugin Error Isolation

*For any* set of plugins where one plugin has invalid structure, when registering all plugins, the Plugin_Manager SHALL successfully register all valid plugins and report errors only for the invalid plugin.

**Validates: Requirements 3.1, 4.4**

### Property 2: Storage Data Recovery

*For any* corrupted localStorage data, when the Store attempts to load data, it SHALL either recover to a valid state or reset to defaults without throwing exceptions.

**Validates: Requirements 3.2**

### Property 3: Plugin Lifecycle Management

*For any* plugin with lifecycle hooks, when the plugin is mounted, its onMount hook SHALL be called exactly once, and when unmounted, its onUnmount hook SHALL be called exactly once.

**Validates: Requirements 4.1, 4.2**

### Property 4: Plugin API Consistency

*For any* plugin using the Plugin_API, calling setConfig followed by getConfig SHALL return the updated configuration values.

**Validates: Requirements 4.3**

### Property 5: Data Export/Import Round Trip

*For any* valid application state, exporting the data and then importing it SHALL restore the application to an equivalent state.

**Validates: Requirements 8.1**

### Property 6: Automatic Backup Creation

*For any* configured backup interval, the Backup_System SHALL create backups at approximately the specified intervals (within reasonable tolerance).

**Validates: Requirements 8.3**

### Property 7: Data Version Migration

*For any* backup data from a previous version, when importing, the System SHALL successfully migrate the data to the current version format without data loss.

**Validates: Requirements 8.4**

## Error Handling

### 插件错误处理策略

1. **注册时验证**: 在插件注册时验证结构完整性
2. **运行时隔离**: 插件运行时错误不影响其他插件
3. **优雅降级**: 插件加载失败时显示占位符

### 数据错误处理策略

1. **数据验证**: 加载数据时进行结构验证
2. **自动修复**: 尝试修复可修复的数据问题
3. **回退默认**: 无法修复时回退到默认值
4. **用户通知**: 数据问题时通知用户

### 存储错误处理策略

1. **配额检测**: 写入前检测存储配额
2. **压缩存储**: 配额不足时尝试压缩数据
3. **清理建议**: 提供数据清理建议

## Testing Strategy

### 单元测试

使用 Vitest 进行单元测试，重点覆盖：

1. **gridUtils.ts** - 所有网格计算函数
2. **validation.ts** - 数据验证函数
3. **pluginManager.ts** - 插件注册和管理
4. **backupService.ts** - 数据导入导出

### 属性测试

使用 fast-check 进行属性测试：

1. **Property 1**: 生成随机的有效/无效插件组合，验证错误隔离
2. **Property 2**: 生成随机的损坏数据，验证恢复能力
3. **Property 3**: 生成随机的插件生命周期操作序列，验证钩子调用
4. **Property 4**: 生成随机的配置更新序列，验证 API 一致性
5. **Property 5**: 生成随机的应用状态，验证导入导出往返
6. **Property 6**: 模拟时间流逝，验证备份创建
7. **Property 7**: 生成不同版本的备份数据，验证迁移

### 测试配置

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
```

### 属性测试示例

```typescript
// src/plugins/core/__tests__/pluginManager.property.test.ts
import { fc } from 'fast-check';
import { pluginManager } from '../pluginManager';

describe('PluginManager Properties', () => {
  // Feature: project-optimization, Property 1: Plugin Error Isolation
  it('should isolate plugin registration errors', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryPlugin()),
        (plugins) => {
          const validPlugins = plugins.filter(isValidPlugin);
          const results = plugins.map(p => pluginManager.register(p));
          
          // All valid plugins should be registered
          validPlugins.forEach(p => {
            expect(pluginManager.getPlugin(p.metadata.id)).toBeDefined();
          });
          
          // Invalid plugins should have error results
          const invalidResults = results.filter((r, i) => !isValidPlugin(plugins[i]));
          invalidResults.forEach(r => {
            expect(r.success).toBe(false);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
```
