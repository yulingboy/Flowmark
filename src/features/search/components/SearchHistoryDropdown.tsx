/**
 * 支持虚拟化的搜索历史下拉组件
 */
import React from 'react';
import { ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { HighlightedText } from './HighlightedText';

export interface SearchHistoryDropdownProps {
  items: string[];
  query: string;
  selectedIndex: number;
  onSelect: (item: string) => void;
  onRemove: (item: string) => void;
  onClearAll: () => void;
  maxDisplay?: number;
}

/**
 * 显示搜索历史的下拉组件
 * 
 * @param props - 组件属性
 * @returns 搜索历史下拉组件
 */
export function SearchHistoryDropdown({
  items,
  query,
  selectedIndex,
  onSelect,
  onRemove,
  onClearAll,
  maxDisplay = 20,
}: SearchHistoryDropdownProps): React.ReactElement {
  // 如果超过 maxDisplay，只显示前 maxDisplay 项（简化的虚拟化）
  const displayItems = items.slice(0, maxDisplay);
  
  return (
    <div 
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg overflow-hidden z-10"
      role="listbox"
      aria-label="搜索历史"
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
        <span className="text-xs text-gray-500">搜索历史</span>
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            onClearAll(); 
          }}
          className="text-xs text-gray-400 hover:text-gray-600"
          aria-label="清除所有历史记录"
        >
          清除全部
        </button>
      </div>
      <ul>
        {displayItems.map((item: string, index: number) => (
          <li 
            key={item}
            role="option"
            aria-selected={index === selectedIndex}
            id={`search-history-item-${index}`}
          >
            <div 
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer group ${
                index === selectedIndex ? 'bg-gray-100' : ''
              }`}
              onClick={() => onSelect(item)}
            >
              <ClockCircleOutlined style={{ color: '#9ca3af', flexShrink: 0 }} />
              <span className="text-gray-700 flex-1 truncate">
                <HighlightedText text={item} query={query} />
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(item);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
                title="删除此记录"
                aria-label={`删除 ${item}`}
              >
                <CloseCircleOutlined style={{ color: '#9ca3af', fontSize: 12 }} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
