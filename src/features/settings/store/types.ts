/**
 * Settings Store 类型定义
 */

export interface GeneralState {
  openInNewTab: boolean;
  showClock: boolean;
  showSearch: boolean;
  showShortcuts: boolean;
  language: 'zh-CN' | 'en-US';
  
  updateOpenInNewTab: (value: boolean) => void;
  updateShowClock: (value: boolean) => void;
  updateShowSearch: (value: boolean) => void;
  updateShowShortcuts: (value: boolean) => void;
  updateLanguage: (value: 'zh-CN' | 'en-US') => void;
  resetGeneral: () => void;
}
