import { useState, type KeyboardEvent } from 'react';
import { performSearch, SEARCH_ENGINE_ICONS } from '@/utils/search';
import type { SearchEngine } from '@/types';

interface SearchProps {
  placeholder?: string;
  searchEngine?: SearchEngine;
  className?: string;
}

export function Search({
  placeholder = '搜索内容',
  searchEngine = 'bing',
  className = '',
}: SearchProps) {
  const [query, setQuery] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      performSearch(query, searchEngine);
    }
  };

  return (
    <div
      className={`flex items-center bg-white/90 backdrop-blur-md rounded-full shadow-lg ${className}`}
      style={{ width: 560, height: 40, padding: '0 16px', gap: 12 }}
    >
      {/* 搜索引擎图标 */}
      <img
        src={SEARCH_ENGINE_ICONS[searchEngine]}
        alt={searchEngine}
        style={{ width: 20, height: 20, flexShrink: 0 }}
      />
      {/* 搜索输入框 */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 14, color: '#374151' }}
      />
      {/* 搜索图标 */}
      <svg
        style={{ width: 20, height: 20, flexShrink: 0, color: '#9CA3AF' }}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
}
