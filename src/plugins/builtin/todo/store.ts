import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TodoItem, TodoList } from './types';

const DEFAULT_LIST: TodoList = { id: 'default', name: '默认列表', createdAt: 0 };

interface TodoState {
  todos: TodoItem[];
  lists: TodoList[];
  addTodo: (text: string, listId?: string, priority?: 'low' | 'medium' | 'high') => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  updateTodoPriority: (id: string, priority: 'low' | 'medium' | 'high') => void;
  addList: (name: string) => void;
  deleteList: (id: string) => void;
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      todos: [],
      lists: [DEFAULT_LIST],

      addTodo: (text, listId = 'default', priority = 'medium') => {
        if (!text.trim()) return;
        const newTodo: TodoItem = {
          id: Date.now().toString(),
          text: text.trim(),
          completed: false,
          createdAt: Date.now(),
          listId,
          priority
        };
        set(state => ({ todos: [...state.todos, newTodo] }));
      },

      toggleTodo: (id) => {
        set(state => ({
          todos: state.todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
        }));
      },

      deleteTodo: (id) => {
        set(state => ({ todos: state.todos.filter(t => t.id !== id) }));
      },

      updateTodoPriority: (id, priority) => {
        set(state => ({
          todos: state.todos.map(t => t.id === id ? { ...t, priority } : t)
        }));
      },

      addList: (name) => {
        if (!name.trim()) return;
        const newList: TodoList = {
          id: Date.now().toString(),
          name: name.trim(),
          createdAt: Date.now()
        };
        set(state => ({ lists: [...state.lists, newList] }));
      },

      deleteList: (id) => {
        if (id === 'default') return;
        set(state => ({
          lists: state.lists.filter(l => l.id !== id),
          todos: state.todos.filter(t => t.listId !== id)
        }));
      }
    }),
    { name: 'todo-plugin-data' }
  )
);
