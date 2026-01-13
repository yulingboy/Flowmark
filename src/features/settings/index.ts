// Settings feature module - barrel export

// Types
export type { 
  SettingsTab, 
  SettingsPanelProps, 
  SettingsButtonProps, 
  SettingRowProps, 
  WallpaperModalProps,
  GeneralState 
} from './types';

// Components
export { SettingsButton } from './components/SettingsButton';
export { SettingsPanel } from './components/SettingsPanel';
export { SettingRow } from './components/SettingRow';
export { WallpaperModal } from './components/WallpaperModal';

// Stores
export { useGeneralStore } from './store/generalStore';
