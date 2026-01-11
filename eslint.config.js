import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // 允许在 effect 中调用 setState（常见模式，如初始化、同步外部状态）
      'react-hooks/set-state-in-effect': 'off',
      // 允许在渲染期间访问 ref（某些场景需要）
      'react-hooks/refs': 'off',
      // 保留手动 memoization 警告为 warning
      'react-hooks/preserve-manual-memoization': 'warn',
    },
  },
])
