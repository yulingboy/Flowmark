/**
 * Side Panel 入口文件
 * 
 * 初始化 Side Panel React 应用，包括：
 * 1. 检查并执行数据迁移（从 localStorage 到 chrome.storage）
 * 2. 初始化 Notes Store
 * 3. 渲染 React 应用
 * 
 * @module extension/sidepanel/main
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { migrationService } from '@/utils/migration';
import { initNotesStore } from '@/plugins/builtin/notes/store';
import App from './App';
import '@/index.css';

/**
 * 初始化 Side Panel 应用
 * 
 * 执行顺序：
 * 1. 检查是否需要数据迁移
 * 2. 如需迁移，执行迁移
 * 3. 初始化 Notes Store（加载数据 + 设置同步监听）
 * 4. 渲染 React 应用
 */
async function initSidePanel(): Promise<void> {
  try {
    // 1. 检查并执行数据迁移
    if (await migrationService.needsMigration()) {
      const result = await migrationService.migrate();
      if (result.success) {
        console.log(`[SidePanel] 数据迁移成功: ${result.migratedCount} 条笔记`);
      } else {
        console.error(`[SidePanel] 数据迁移失败: ${result.error}`);
      }
    }

    // 2. 初始化 Notes Store
    await initNotesStore();
    console.log('[SidePanel] Notes Store 初始化完成');

    // 3. 渲染 React 应用
    const rootElement = document.getElementById('root');
    
    if (!rootElement) {
      throw new Error('找不到 root 元素');
    }

    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>
    );

    console.log('[SidePanel] 应用启动完成');
  } catch (error) {
    console.error('[SidePanel] 应用初始化失败:', error);
  }
}

// 启动应用
initSidePanel();
