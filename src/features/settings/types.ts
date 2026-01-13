/**
 * 设置模块类型定义
 */

/** 设置面板标签页 */
export type SettingsTab = 'general' | 'search' | 'wallpaper' | 'datetime' | 'data' | 'about';

/** 设置面板 Props */
export interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

/** 设置按钮 Props */
export interface SettingsButtonProps {
  onClick: () => void;
  className?: string;
}

/** 设置行 Props */
export interface SettingRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

/** 壁纸弹窗 Props */
export interface WallpaperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/** 通用设置 Store 状态 */
export interface GeneralState {
  openInNewTab: boolean;
  showClock: boolean;
  showSearch: boolean;
  showShortcuts: boolean;
  
  updateOpenInNewTab: (value: boolean) => void;
  updateShowClock: (value: boolean) => void;
  updateShowSearch: (value: boolean) => void;
  updateShowShortcuts: (value: boolean) => void;
  resetGeneral: () => void;
}
