/**
 * 扩展工具函数导出
 * 
 * @module extension/utils
 */

export { chromeStorage, isExtensionEnvironment, clearAllListeners, getListenerCount } from './chromeStorage';
export type { ChromeStorageService } from './chromeStorage';

export { noteFormatter, createNoteFormatter } from './noteFormatter';
export type { FormattedNote, NoteFormatter } from './noteFormatter';
