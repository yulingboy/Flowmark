export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface NotesConfig {
  // 暂无配置项
}

export const PLUGIN_ID = 'notes';
