/**
 * Search engine selector dropdown component
 */
import React, { useState, useRef } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';
import { SEARCH_ENGINE_CONFIGS } from '../utils/search';
import type { SearchEngine } from '@/types';

export interface SearchEngineSelectorProps {
  currentEngine: SearchEngine;
  onEngineChange: (engine: SearchEngine) => void;
}

/**
 * Dropdown selector for switching search engines
 * 
 * @param currentEngine - Currently selected search engine
 * @param onEngineChange - Callback when engine is changed
 * @returns Search engine selector component
 */
export function SearchEngineSelector({
  currentEngine,
  onEngineChange,
}: SearchEngineSelectorProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const engines = Object.keys(SEARCH_ENGINE_CONFIGS) as SearchEngine[];
  const currentConfig = SEARCH_ENGINE_CONFIGS[currentEngine];
  
  useClickOutside(containerRef, () => setIsOpen(false));
  
  const handleEngineSelect = (engine: SearchEngine) => {
    onEngineChange(engine);
    setIsOpen(false);
  };
  
  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center p-1 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="选择搜索引擎"
        aria-expanded={isOpen}
        title={currentConfig.name}
      >
        <img 
          src={currentConfig.faviconUrl} 
          alt={currentConfig.name}
          style={{ width: 20, height: 20 }}
          onError={(e) => {
            // Fallback to text if favicon fails to load
            e.currentTarget.style.display = 'none';
          }}
        />
      </button>
      
      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-2"
          style={{ zIndex: 30, minWidth: '120px', minHeight: '40px' }}
          role="menu"
        >
          <div className="flex items-center gap-2">
            {engines.map((engine) => {
              const config = SEARCH_ENGINE_CONFIGS[engine];
              const isSelected = engine === currentEngine;
              
              return (
                <button
                  key={engine}
                  onClick={() => handleEngineSelect(engine)}
                  className={`flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 transition-colors ${
                    isSelected ? 'bg-blue-50 ring-2 ring-blue-400' : ''
                  }`}
                  role="menuitem"
                  aria-label={`切换到 ${config.name}`}
                  title={config.name}
                >
                  <img 
                    src={config.faviconUrl} 
                    alt={config.name}
                    width="20"
                    height="20"
                    style={{ display: 'block' }}
                    onError={(e) => {
                      console.log('Favicon failed to load:', config.name, config.faviconUrl);
                      // Fallback: show first letter
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector('span')) {
                        const span = document.createElement('span');
                        span.textContent = config.name[0];
                        span.className = 'text-sm font-semibold text-gray-700';
                        parent.appendChild(span);
                      }
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
