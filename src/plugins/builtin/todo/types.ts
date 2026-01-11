export const PLUGIN_ID = 'todo';

export type Priority = 'low' | 'medium' | 'high';

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  listId: string;  // 所属列表
  priority: Priority;
}

export interface TodoList {
  id: string;
  name: string;
  createdAt: number;
}

export type FilterType = 'all' | 'today' | 'week';
