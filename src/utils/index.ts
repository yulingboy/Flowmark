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
