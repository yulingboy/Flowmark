import { usePluginStore } from '../../store';
import type { TodoItem } from './types';
import { PLUGIN_ID } from './types';

export function useTodos() {
  const todos = usePluginStore(
    state => (state.pluginData[PLUGIN_ID]?.todos as TodoItem[]) || []
  );

  const addTodo = (text: string) => {
    if (!text.trim()) return;
    const currentTodos = usePluginStore.getState().pluginData[PLUGIN_ID]?.todos as TodoItem[] || [];
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      createdAt: Date.now()
    };
    usePluginStore.getState().setPluginData(PLUGIN_ID, 'todos', [...currentTodos, newTodo]);
  };

  const toggleTodo = (id: string) => {
    const currentTodos = usePluginStore.getState().pluginData[PLUGIN_ID]?.todos as TodoItem[] || [];
    usePluginStore.getState().setPluginData(PLUGIN_ID, 'todos', currentTodos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    const currentTodos = usePluginStore.getState().pluginData[PLUGIN_ID]?.todos as TodoItem[] || [];
    usePluginStore.getState().setPluginData(PLUGIN_ID, 'todos', currentTodos.filter(t => t.id !== id));
  };

  return { todos, addTodo, toggleTodo, deleteTodo };
}
