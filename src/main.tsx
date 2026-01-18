/**
 * Newtab 入口文件
 * 
 * 初始化 Newtab React 应用，包括：
 * 1. 检查并执行数据迁移（从 localStorage 到 chrome.storage）
 * 2. 初始化 Notes Store
 * 3. 渲染 React 应用
 * 
 * @module main
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { migrationService } from './utils/migration';
import { initNotesStore } from './plugins/builtin/notes/store';
import App from './App';
import './index.css';

/**
 * 初始化 Newtab 应用
 * 
 * 执行顺序：
 * 1. 检查是否需要数据迁移
 * 2. 如需迁移，执行迁移
 * 3. 初始化 Notes Store（加载数据 + 设置同步监听）
 * 4. 渲染 React 应用
 */
async function initNewtab(): Promise<void> {
  try {
    // 1. 检查并执行数据迁移
    if (await migrationService.needsMigration()) {
      const result = await migrationService.migrate();
      if (result.success) {
        console.log(`[Newtab] 数据迁移成功: ${result.migratedCount} 条笔记`);
      } else {
        console.error(`[Newtab] 数据迁移失败: ${result.error}`);
      }
    }

    // 2. 初始化 Notes Store
    await initNotesStore();
    console.log('[Newtab] Notes Store 初始化完成');

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

    console.log('[Newtab] 应用启动完成');
  } catch (error) {
    console.error('[Newtab] 应用初始化失败:', error);
  }
}

// 启动应用
initNewtab();
