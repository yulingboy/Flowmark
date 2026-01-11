// Shortcuts feature module - barrel export

// Components
export { ShortcutCard } from './components/ShortcutCard';
export { ShortcutFolder } from './components/ShortcutFolder';
export { ShortcutsContainer } from './components/ShortcutsContainer';
export { FolderPopup } from './components/FolderPopup';
export { AddShortcutModal } from './components/AddShortcutModal';
export { AddFolderModal } from './components/AddFolderModal';
export { BatchEditToolbar } from './components/BatchEditToolbar';
export { DraggableItem } from './components/DraggableItem';

// Store
export { useShortcutsStore } from './store';
export type { ShortcutsState, ValidationResult } from './store/types';
export { SHORTCUTS_LIMIT } from './store/types';

// Utils
export { getFaviconUrl, getFaviconUrlAsync, generatePlaceholder, preloadFavicons, clearFaviconCache, getCacheStats } from './utils/faviconService';
export { extractSiteInfo, SITE_INFO } from './utils/siteInfo';
export { getGridSpan, getItemSize, pixelToGrid, gridToPixel, GridManager, getValidSizesForPosition, ALL_SIZES, TEXT_HEIGHT } from './utils/gridUtils';

// Hooks
export { useShortcutItems } from './hooks/useShortcutItems';
export { createDragHandlers } from './hooks/useDragHandlers';
export { createFolderHandlers } from './hooks/useFolderHandlers';
