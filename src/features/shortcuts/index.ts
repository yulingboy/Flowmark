// Shortcuts feature module - barrel export

// Types
export type { GridConfig } from './types';
export type { ValidationResult } from './store/types';
export { SHORTCUTS_LIMIT } from './store/types';

// Components
export { ShortcutCard } from './components/ShortcutCard';
export { ShortcutFolder } from './components/ShortcutFolder';
export { ShortcutsContainer } from './components/ShortcutsContainer';
export { FolderPopup } from './components/FolderPopup';
export { AddShortcutModal } from './components/AddShortcutModal';
export { AddFolderModal } from './components/AddFolderModal';
export { DraggableItem } from './components/DraggableItem';

// Store
export { useShortcutsStore } from './store';
export type { ShortcutsState } from './store/types';

// Utils
export { getFaviconUrl, getFaviconUrlAsync, generatePlaceholder, preloadFavicons } from './utils/faviconService';
export { extractSiteInfo, SITE_INFO } from './utils/siteInfo';
export { getGridSpan, getItemSize, pixelToGrid, gridToPixel, GridManager, getValidSizesForPosition, ALL_SIZES, TEXT_HEIGHT } from '@/utils/gridUtils';

// Hooks
export { useShortcutItems } from './hooks/useShortcutItems';
export { createDragHandlers } from './hooks/useDragHandlers';
export { createFolderHandlers } from './hooks/useFolderHandlers';
export { useCardBehavior } from './hooks/useCardBehavior';
export type { UseCardBehaviorOptions, UseCardBehaviorResult } from './hooks/useCardBehavior';
