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
      <div className="mb-5">
        <div className="text-sm text-gray-700 mb-3">默认搜索引擎</div>
        <div className="flex gap-3">
          {SEARCH_ENGINES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => updateSearchEngine(value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer ${
                searchEngine === value
                  ? 'border-2 border-blue-500 bg-blue-50'
                  : 'border border-gray-200 bg-white'
              }`}
            >
              <img src={SEARCH_ENGINE_ICONS[value]} alt={label} className="w-4 h-4" />
              <span className="text-sm text-gray-700">{label}</span>
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
        <div className="mt-4">
          <button
            onClick={clearSearchHistory}
            className="px-4 py-2 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg cursor-pointer"
          >
            清除搜索历史
          </button>
        </div>
      )}
    </div>
  );
}
