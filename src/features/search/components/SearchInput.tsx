/**
 * 带搜索引擎图标和 URL 指示器的搜索输入组件
 */
import React, { type KeyboardEvent } from 'react';
import { SearchOutlined, LinkOutlined } from '@ant-design/icons';
import { SearchEngineSelector } from './SearchEngineSelector';
import type { SearchEngine } from '@/types';

export interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
  placeholder: string;
  searchEngine: SearchEngine;
  onEngineChange: (engine: SearchEngine) => void;
  isUrl: boolean;
  isFocused: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

/**
 * 带搜索引擎选择器和 URL 指示器的搜索输入框
 * 
 * @param props - 组件属性
 * @returns 搜索输入组件
 */
export function SearchInput({
  value,
  onChange,
  onSearch,
  onKeyDown,
  onFocus,
  onBlur,
  placeholder,
  searchEngine,
  onEngineChange,
  isUrl,
  isFocused,
  inputRef,
}: SearchInputProps): React.ReactElement {
  return (
    <div 
      className={`flex items-center bg-white/90 backdrop-blur-md rounded-full shadow-lg transition-all ${
        isFocused ? 'ring-2 ring-blue-400/50 shadow-xl' : ''
      }`}
      style={{ width: 560, height: 40, padding: '0 8px 0 14px', gap: '6px' }}
    >
      <SearchEngineSelector 
        currentEngine={searchEngine}
        onEngineChange={onEngineChange}
      />
      
      <input 
        ref={inputRef}
        type="text" 
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 14 }}
        aria-label="搜索输入框"
        role="searchbox"
      />
      
      {/* URL 指示器 */}
      {isUrl && value.trim() && (
        <LinkOutlined 
          style={{ fontSize: 16, color: '#3B82F6' }} 
          title="按 Enter 直接访问"
          aria-label="检测到 URL"
        />
      )}
      
      <button 
        onClick={onSearch} 
        className="p-1 hover:bg-gray-100 rounded-full transition"
        aria-label="搜索"
      >
        <SearchOutlined style={{ fontSize: 20, color: '#9CA3AF' }} />
      </button>
    </div>
  );
}
