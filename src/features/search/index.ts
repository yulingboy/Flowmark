// Search feature module - barrel export

// Types
export type { SearchProps, SearchSuggestion } from './types';
export type { SearchState } from './store';

// Components
export { Search } from './components/Search';

// Utils
export { performSearch, generateSearchUrl, SEARCH_ENGINE_ICONS } from './utils/search';
export { addToHistory, removeFromHistory } from './utils/searchHistory';

// Store
export { useSearchStore } from './store';
