// Settings feature module - barrel export

// Types
export type { 
  SettingsTab, 
  SettingsPanelProps, 
  SettingsButtonProps, 
  SettingRowProps
} from './types';
export type { GeneralState } from './store';

// Components
export { SettingsButton } from './components/SettingsButton';
export { SettingsPanel } from './components/SettingsPanel';
export { SettingRow } from './components/SettingRow';

// Store
export { useGeneralStore } from './store';
