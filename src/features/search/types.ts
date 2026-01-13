/**
 * 搜索模块类型定义
 */

/** 搜索组件 Props */
export interface SearchProps {
  placeholder?: string;
  className?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

/** 搜索建议项 */
export interface SearchSuggestion {
  type: 'history' | 'suggestion' | 'url';
  text: string;
  url?: string;
}

// SearchState 定义在 store/types.ts 中
