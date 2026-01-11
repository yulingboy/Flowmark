export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface NotesConfig {
  /** 预留配置项 */
  placeholder?: string;
}

export const PLUGIN_ID = 'notes';
