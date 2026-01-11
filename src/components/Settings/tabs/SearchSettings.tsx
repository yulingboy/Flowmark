import { useSettingsStore } from '@/stores/settingsStore';
import { SEARCH_ENGINE_ICONS } from '@/utils/search';
import type { SearchEngine } from '@/types';
import { ToggleSwitch } from '../components/ToggleSwitch';

const SEARCH_ENGINES: { value: SearchEngine; label: string }[] = [
  { value: 'bing', label: 'Bing' },
  { value: 'google', label: 'Google' },
  { value: 'baidu', label: '百度' },
];

export function SearchSettings() {
  const {
    searchEngine,
    searchInNewTab,
    autoFocusSearch,
    showSearchSuggestions,
    searchHistoryEnabled,
    updateSearchEngine,
    updateSearchInNewTab,
    updateAutoFocusSearch,
    updateShowSearchSuggestions,
    updateSearchHistoryEnabled,
    clearSearchHistory,
  } = useSettingsStore();

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '14px', color: '#374151', marginBottom: '12px' }}>默认搜索引擎</div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {SEARCH_ENGINES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => updateSearchEngine(value)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: searchEngine === value ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                backgroundColor: searchEngine === value ? '#eff6ff' : 'white',
                cursor: 'pointer',
              }}
            >
              <img src={SEARCH_ENGINE_ICONS[value]} alt={label} style={{ width: '16px', height: '16px' }} />
              <span style={{ fontSize: '14px', color: '#374151' }}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <ToggleSwitch
        checked={searchInNewTab}
        onChange={updateSearchInNewTab}
        label="搜索新页面打开"
      />
      <ToggleSwitch
        checked={autoFocusSearch}
        onChange={updateAutoFocusSearch}
        label="进入程序自动聚焦搜索"
      />
      <ToggleSwitch
        checked={showSearchSuggestions}
        onChange={updateShowSearchSuggestions}
        label="搜索词联想功能"
      />
      <ToggleSwitch
        checked={searchHistoryEnabled}
        onChange={updateSearchHistoryEnabled}
        label="搜索历史"
        description="仅本地生效"
      />

      {searchHistoryEnabled && (
        <div style={{ marginTop: '16px' }}>
          <button
            onClick={clearSearchHistory}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              color: '#ef4444',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            清除搜索历史
          </button>
        </div>
      )}
    </div>
  );
}
