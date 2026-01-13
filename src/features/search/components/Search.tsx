import { useRef, useState, useCallback, useMemo, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { SearchOutlined, ClockCircleOutlined, CloseCircleOutlined, LinkOutlined } from '@ant-design/icons';
import { performSearch, SEARCH_ENGINE_ICONS } from '../utils/search';
import { useSearchStore } from '../store/searchStore';
import { useDebounce } from '@/hooks/useDebounce';
import { useClickOutside } from '@/hooks/useClickOutside';

interface SearchProps {
  placeholder?: string;
  className?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  debounceMs?: number;
}

// URL 模式检测正则
const URL_PATTERN = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/\S*)?$/i;

// 高亮匹配文本组件
function HighlightedText({ text, query }: { text: string; query: string }): React.ReactElement {
  if (!query.trim()) return <span>{text}</span>;
  
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);
  
  if (index === -1) return <span>{text}</span>;
  
  return (
    <span>
      {text.slice(0, index)}
      <mark className="bg-yellow-200 text-yellow-900 rounded px-0.5">{text.slice(index, index + query.length)}</mark>
      {text.slice(index + query.length)}
    </span>
  );
}

export function Search({ placeholder = '搜索...', className = '', inputRef, debounceMs = 300 }: SearchProps) {
  const {
    searchEngine,
    searchInNewTab,
    searchHistoryEnabled,
    searchHistory,
    addSearchHistory,
    removeSearchHistoryItem,
    clearSearchHistory,
  } = useSearchStore();
  
  const [query, setQuery] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const internalInputRef = useRef<HTMLInputElement>(null);
  const actualInputRef = inputRef || internalInputRef;

  // 防抖后的查询值（用于过滤历史记录）
  const debouncedQuery = useDebounce(query, debounceMs);
  
  // 检测是否为 URL
  const isUrl = useMemo(() => URL_PATTERN.test(query.trim()), [query]);
  
  // 过滤并排序历史记录（匹配项排在前面）
  const filteredHistory = useMemo(() => {
    if (!debouncedQuery.trim()) return searchHistory;
    const lowerQuery = debouncedQuery.toLowerCase();
    return searchHistory
      .filter(item => item.toLowerCase().includes(lowerQuery))
      .sort((a, b) => {
        const aIndex = a.toLowerCase().indexOf(lowerQuery);
        const bIndex = b.toLowerCase().indexOf(lowerQuery);
        return aIndex - bIndex;
      });
  }, [searchHistory, debouncedQuery]);

  // 点击外部关闭历史记录
  const closeHistory = useCallback(() => setShowHistory(false), []);
  useClickOutside(containerRef, closeHistory);

  // 执行搜索
  const handleSearch = useCallback(() => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;
    
    // 如果是 URL，直接导航
    if (isUrl) {
      const url = trimmedQuery.startsWith('http') ? trimmedQuery : `https://${trimmedQuery}`;
      window.open(url, searchInNewTab ? '_blank' : '_self');
      setShowHistory(false);
      return;
    }
    
    addSearchHistory(trimmedQuery);
    performSearch(query, searchEngine, searchInNewTab);
    setShowHistory(false);
  }, [query, isUrl, searchEngine, searchInNewTab, addSearchHistory]);

  // 键盘导航
  const handleKeyDown = useCallback((e: ReactKeyboardEvent<HTMLInputElement>) => {
    const historyLength = filteredHistory.length;
    
    if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < historyLength) {
        setQuery(filteredHistory[selectedIndex]);
        setShowHistory(false);
        setSelectedIndex(-1);
      } else {
        handleSearch();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => prev < historyLength - 1 ? prev + 1 : prev);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Escape') {
      setShowHistory(false);
      setSelectedIndex(-1);
    }
  }, [filteredHistory, selectedIndex, handleSearch]);

  // 处理输入变化
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedIndex(-1);
  }, []);

  // 处理焦点
  const handleFocus = useCallback(() => {
    setIsFocused(true);
    setShowHistory(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  // 选择历史记录项
  const handleSelectHistory = useCallback((item: string) => {
    setQuery(item);
    setShowHistory(false);
    actualInputRef.current?.focus();
  }, [actualInputRef]);

  // 删除单条历史记录
  const handleRemoveHistoryItem = useCallback((e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    removeSearchHistoryItem(item);
  }, [removeSearchHistoryItem]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div 
        className={`flex items-center bg-white/90 backdrop-blur-md rounded-full shadow-lg transition-all ${
          isFocused ? 'ring-2 ring-blue-400/50 shadow-xl' : ''
        }`}
        style={{ width: 560, height: 40, padding: '0 14px', gap: '6px' }}
      >
        <img 
          src={SEARCH_ENGINE_ICONS[searchEngine]} 
          alt={searchEngine} 
          style={{ width: 20, height: 20, flexShrink: 0 }}
        />
        
        <input 
          ref={actualInputRef}
          type="text" 
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 14 }}
        />
        
        {/* URL 指示器 */}
        {isUrl && query.trim() && (
          <LinkOutlined 
            style={{ fontSize: 16, color: '#3B82F6' }} 
            title="按 Enter 直接访问"
          />
        )}
        
        <button onClick={handleSearch} className="p-1 hover:bg-gray-100 rounded-full transition">
          <SearchOutlined style={{ fontSize: 20, color: '#9CA3AF' }} />
        </button>
      </div>

      {/* 历史记录下拉 */}
      {showHistory && searchHistoryEnabled && filteredHistory.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg overflow-hidden z-10">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
            <span className="text-xs text-gray-500">搜索历史</span>
            <button 
              onClick={(e) => { e.stopPropagation(); clearSearchHistory(); }}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              清除全部
            </button>
          </div>
          <ul>
            {filteredHistory.map((item, index) => (
              <li key={item}>
                <div 
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer group ${
                    index === selectedIndex ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => handleSelectHistory(item)}
                >
                  <ClockCircleOutlined style={{ color: '#9ca3af', flexShrink: 0 }} />
                  <span className="text-gray-700 flex-1 truncate">
                    <HighlightedText text={item} query={debouncedQuery} />
                  </span>
                  <button
                    onClick={(e) => handleRemoveHistoryItem(e, item)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
                    title="删除此记录"
                  >
                    <CloseCircleOutlined style={{ color: '#9ca3af', fontSize: 12 }} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
