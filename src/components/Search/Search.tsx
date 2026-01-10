import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { performSearch, SEARCH_ENGINE_ICONS } from '@/utils/search';
import { useSettingsStore } from '@/stores/settingsStore';

interface SearchProps {
  placeholder?: string;
  className?: string;
}

export function Search({
  placeholder = '搜索内容',
  className = '',
}: SearchProps) {
  const { searchEngine, searchHistory, addSearchHistory, clearSearchHistory } = useSettingsStore();
  
  const [query, setQuery] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 点击外部关闭历史记录
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowHistory(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (!query.trim()) return;
    addSearchHistory(query.trim());
    performSearch(query, searchEngine);
    setShowHistory(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < searchHistory.length) {
        setQuery(searchHistory[selectedIndex]);
        setShowHistory(false);
        setSelectedIndex(-1);
      } else {
        handleSearch();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < searchHistory.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Escape') {
      setShowHistory(false);
      setSelectedIndex(-1);
    }
  };

  const handleHistoryClick = (item: string) => {
    setQuery(item);
    setShowHistory(false);
    inputRef.current?.focus();
  };

  const handleClearHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearSearchHistory();
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div
        className="flex items-center bg-white/90 backdrop-blur-md rounded-full shadow-lg"
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
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowHistory(true)}
          placeholder={placeholder}
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 14, color: '#374151' }}
        />
        {/* 搜索图标 */}
        <button onClick={handleSearch} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
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
        </button>
      </div>

      {/* 搜索历史下拉 */}
      {showHistory && searchHistory.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg overflow-hidden z-10">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
            <span className="text-xs text-gray-500">搜索历史</span>
            <button
              onClick={handleClearHistory}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              清除
            </button>
          </div>
          <ul>
            {searchHistory.map((item, index) => (
              <li key={item}>
                <button
                  onClick={() => handleHistoryClick(item)}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 ${
                    index === selectedIndex ? 'bg-gray-100' : ''
                  }`}
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700 truncate">{item}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
