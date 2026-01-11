import { useState, useCallback, useEffect } from 'react';
import { usePluginStore } from '../../store';
import type { TodoItem } from './types';
import { PLUGIN_ID } from './types';

export function useTodos() {
  const [todos, setTodos] = useState<TodoItem[]>(
    () => usePluginStore.getState().getPluginData<TodoItem[]>(PLUGIN_ID, 'todos') || []
  );

  // 订阅 store 变化
  useEffect(() => {
    const unsubscribe = usePluginStore.subscribe((state) => {
      const storedTodos = state.pluginData[PLUGIN_ID]?.['todos'] as TodoItem[] || [];
      setTodos(storedTodos);
    });
    return unsubscribe;
  }, []);

  const saveTodos = useCallback((newTodos: TodoItem[]) => {
    usePluginStore.getState().setPluginData(PLUGIN_ID, 'todos', newTodos);
  }, []);

  const addTodo = useCallback((text: string) => {
    if (!text.trim()) return;
    const currentTodos = usePluginStore.getState().getPluginData<TodoItem[]>(PLUGIN_ID, 'todos') || [];
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      createdAt: Date.now()
    };
    saveTodos([...currentTodos, newTodo]);
  }, [saveTodos]);

  const toggleTodo = useCallback((id: string) => {
    const currentTodos = usePluginStore.getState().getPluginData<TodoItem[]>(PLUGIN_ID, 'todos') || [];
    saveTodos(currentTodos.map((t: TodoItem) => t.id === id ? { ...t, completed: !t.completed } : t));
  }, [saveTodos]);

  const deleteTodo = useCallback((id: string) => {
    const currentTodos = usePluginStore.getState().getPluginData<TodoItem[]>(PLUGIN_ID, 'todos') || [];
    saveTodos(currentTodos.filter((t: TodoItem) => t.id !== id));
  }, [saveTodos]);

  return { todos, addTodo, toggleTodo, deleteTodo };
}
