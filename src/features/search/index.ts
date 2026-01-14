// Search feature module - barrel export

// Types
export type { SearchProps, SearchSuggestion } from './types';
export type { SearchState } from './store';
export type { SearchInputProps } from './components/SearchInput';
export type { SearchHistoryDropdownProps } from './components/SearchHistoryDropdown';
export type { HighlightedTextProps } from './components/HighlightedText';
export type { SearchEngineSelectorProps } from './components/SearchEngineSelector';

// Components
export { Search } from './components/Search';
export { SearchInput } from './components/SearchInput';
export { SearchHistoryDropdown } from './components/SearchHistoryDropdown';
export { HighlightedText } from './components/HighlightedText';
export { SearchEngineSelector } from './components/SearchEngineSelector';

// Hooks
export * from './hooks';

// Utils
export { performSearch, generateSearchUrl, SEARCH_ENGINE_ICONS, SEARCH_ENGINE_CONFIGS } from './utils/search';
export type { SearchEngineConfig } from './utils/search';
export { addToHistory, removeFromHistory } from './utils/searchHistory';
export { isValidUrl, normalizeUrl } from './utils/urlValidation';
export { sanitizeInput, truncateInput, normalizeWhitespace, validateAndSanitize } from './utils/sanitization';

// Store
export { useSearchStore } from './store';
export * from './store/selectors';

