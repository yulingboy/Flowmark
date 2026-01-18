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

// Chrome Storage service
export {
  chromeStorage,
  isExtensionEnvironment,
  clearAllListeners,
  getListenerCount,
} from './chromeStorage';
export type { ChromeStorageService } from './chromeStorage';

// Migration service
export { migrationService } from './migration';
export type { MigrationService, MigrationResult } from './migration';
