/**
 * Chrome 扩展模块入口
 * 
 * 导出扩展相关的类型和工具函数。
 * 删除此目录即可完全移除扩展功能。
 * 
 * @module extension
 */

// 类型导出
export type {
  ClipType,
  ClipData,
  ClipRequest,
  StartPickerRequest,
  ClipResult,
  ShowNotification,
  ClipDataResponse,
  ClipperMessage,
} from './types';

export { CONTEXT_MENU_IDS, COMMAND_IDS } from './types';

// 工具函数导出
export { chromeStorage, isExtensionEnvironment } from './utils';
export type { ChromeStorageService } from './utils';

export { noteFormatter } from './utils';
export type { FormattedNote, NoteFormatter } from './utils';
