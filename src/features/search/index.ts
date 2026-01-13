// Search feature module - barrel export
export { Search } from './components/Search';
export { performSearch, generateSearchUrl, SEARCH_ENGINE_ICONS } from './utils/search';
export { addToHistory, removeFromHistory } from './utils/searchHistory';

// Store
export { useSearchStore } from './store/searchStore';
