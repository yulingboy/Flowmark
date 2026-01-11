export const PLUGIN_ID = 'todo';

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export type FilterType = 'all' | 'active' | 'completed';
