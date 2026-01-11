import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { SearchOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { performSearch, SEARCH_ENGINE_ICONS } from '@/utils/search';
import { useSettingsStore } from '@/stores/settingsStore';

interface SearchProps {
  placeholder?: string;
  className?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export function Search({ placeholder = '搜索内容', className = '', inputRef }: SearchProps) {
  const { searchEngine, searchHistory, searchInNewTab, searchHistoryEnabled, addSearchHistory, clearSearchHistory } = useSettingsStore();
  const [query, setQuery] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const internalInputRef = useRef<HTMLInputElement>(null);
  const actualInputRef = inputRef || internalInputRef;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setShowHistory(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (!query.trim()) return;
    addSearchHistory(query.trim());
    performSearch(query, searchEngine, searchInNewTab);
    setShowHistory(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < searchHistory.length) {
        setQuery(searchHistory[selectedIndex]); setShowHistory(false); setSelectedIndex(-1);
      } else handleSearch();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault(); setSelectedIndex(prev => prev < searchHistory.length - 1 ? prev + 1 : prev);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault(); setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Escape') {
      setShowHistory(false); setSelectedIndex(-1);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="flex items-center bg-white/90 backdrop-blur-md rounded-full shadow-lg" style={{ width: 560, height: 40, padding: '0 16px', gap: 12 }}>
        <img src={SEARCH_ENGINE_ICONS[searchEngine]} alt={searchEngine} style={{ width: 20, height: 20, flexShrink: 0 }} />
        <input ref={actualInputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown}
          onFocus={() => setShowHistory(true)} placeholder={placeholder}
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 14, color: '#374151' }} />
        <button onClick={handleSearch} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <SearchOutlined style={{ fontSize: 20, color: '#9CA3AF' }} />
        </button>
      </div>

      {showHistory && searchHistoryEnabled && searchHistory.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg overflow-hidden z-10">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
            <span className="text-xs text-gray-500">搜索历史</span>
            <button onClick={(e) => { e.stopPropagation(); clearSearchHistory(); }} className="text-xs text-gray-400 hover:text-gray-600">清除</button>
          </div>
          <ul>
            {searchHistory.map((item, index) => (
              <li key={item}>
                <button onClick={() => { setQuery(item); setShowHistory(false); actualInputRef.current?.focus(); }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 ${index === selectedIndex ? 'bg-gray-100' : ''}`}>
                  <ClockCircleOutlined style={{ color: '#9ca3af' }} />
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
