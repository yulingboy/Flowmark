import { useCallback } from 'react';
import { usePluginStore } from '../../store';
import type { TodoItem } from './types';
import { PLUGIN_ID } from './types';

export function useTodos() {
  // 直接用 selector 订阅，自动响应变化
  const todos = usePluginStore(
    state => (state.pluginData[PLUGIN_ID]?.todos as TodoItem[]) || []
  );
  const setPluginData = usePluginStore(state => state.setPluginData);

  const saveTodos = useCallback((newTodos: TodoItem[]) => {
    setPluginData(PLUGIN_ID, 'todos', newTodos);
  }, [setPluginData]);

  const addTodo = useCallback((text: string) => {
    if (!text.trim()) return;
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      createdAt: Date.now()
    };
    saveTodos([...todos, newTodo]);
  }, [todos, saveTodos]);

  const toggleTodo = useCallback((id: string) => {
    saveTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }, [todos, saveTodos]);

  const deleteTodo = useCallback((id: string) => {
    saveTodos(todos.filter(t => t.id !== id));
  }, [todos, saveTodos]);

  return { todos, addTodo, toggleTodo, deleteTodo };
}
