import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import path, { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({ open: false, filename: 'stats.html' }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // 扩展打包输出目录
    outDir: 'dist',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      // 多入口配置：newtab、sidepanel、background 和 content script
      input: {
        main: resolve(__dirname, 'index.html'),
        sidepanel: resolve(__dirname, 'sidepanel.html'),
        background: resolve(__dirname, 'src/extension/background/index.ts'),
        content: resolve(__dirname, 'src/extension/content/index.ts'),
      },
      output: {
        // 扩展需要固定的文件名，不带 hash
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
        // 公共依赖分块，newtab 和 sidepanel 复用
        // 将 React 和 Antd 合并到一个 vendor 块中避免循环依赖
        manualChunks: (id) => {
          // Content script 和 background 不应该分块，需要独立打包
          if (id.includes('src/extension/content/') || id.includes('src/extension/background/')) {
            return undefined;
          }
          
          // React + Antd 合并为一个 vendor 块，避免循环依赖
          if (
            id.includes('node_modules/react') || 
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/antd') || 
            id.includes('node_modules/@ant-design')
          ) {
            return 'vendor';
          }
          
          // 其他工具库
          if (id.includes('node_modules/zustand') || id.includes('node_modules/react-draggable')) {
            return 'vendor-utils';
          }
          
          return undefined;
        },
      },
    },
    // CSS 代码分割配置
    cssCodeSplit: true,
  },
})
