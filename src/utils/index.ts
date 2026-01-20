// Utils barrel export

// Grid utilities
export {
  TEXT_HEIGHT,
  ALL_SIZES,
  getGridSpan,
  getValidSizesForPosition,
  getItemSize,
  pixelToGrid,
  gridToPixel,
  canResizeItem,
  findValidPositionInBounds,
  GridManager,
} from './gridUtils';
export type { GridConfig } from './gridUtils';

// Image preloader
export { preloadImage } from './imagePreloader';

// Migration service
export { migrationService } from './migration';
export type { MigrationService, MigrationResult } from './migration';

// Chrome Storage service (re-export from extension)
export {
  chromeStorage,
  isExtensionEnvironment,
  clearAllListeners,
  getListenerCount,
} from '../extension/utils/chromeStorage';
export type { ChromeStorageService } from '../extension/utils/chromeStorage';
