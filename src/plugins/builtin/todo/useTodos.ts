import { useShallow } from 'zustand/react/shallow';
import { usePluginStore } from '../../store';
import type { TodoItem, TodoList, Priority } from './types';
import { PLUGIN_ID } from './types';

const DEFAULT_LIST: TodoList = { id: 'default', name: '默认列表', createdAt: 0 };

export function useTodos() {
  const todos = usePluginStore(
    useShallow(state => (state.pluginData[PLUGIN_ID]?.todos as TodoItem[]) || [])
  );
  const lists = usePluginStore(
    useShallow(state => (state.pluginData[PLUGIN_ID]?.lists as TodoList[]) || [DEFAULT_LIST])
  );

  const addTodo = (text: string, listId: string = 'default', priority: Priority = 'medium') => {
    if (!text.trim()) return;
    const currentTodos = usePluginStore.getState().pluginData[PLUGIN_ID]?.todos as TodoItem[] || [];
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      createdAt: Date.now(),
      listId,
      priority
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

  const updateTodoPriority = (id: string, priority: Priority) => {
    const currentTodos = usePluginStore.getState().pluginData[PLUGIN_ID]?.todos as TodoItem[] || [];
    usePluginStore.getState().setPluginData(PLUGIN_ID, 'todos', currentTodos.map(t => t.id === id ? { ...t, priority } : t));
  };

  const addList = (name: string) => {
    if (!name.trim()) return;
    const currentLists = usePluginStore.getState().pluginData[PLUGIN_ID]?.lists as TodoList[] || [DEFAULT_LIST];
    const newList: TodoList = {
      id: Date.now().toString(),
      name: name.trim(),
      createdAt: Date.now()
    };
    usePluginStore.getState().setPluginData(PLUGIN_ID, 'lists', [...currentLists, newList]);
  };

  const deleteList = (id: string) => {
    if (id === 'default') return;
    const currentLists = usePluginStore.getState().pluginData[PLUGIN_ID]?.lists as TodoList[] || [];
    const currentTodos = usePluginStore.getState().pluginData[PLUGIN_ID]?.todos as TodoItem[] || [];
    usePluginStore.getState().setPluginData(PLUGIN_ID, 'lists', currentLists.filter(l => l.id !== id));
    usePluginStore.getState().setPluginData(PLUGIN_ID, 'todos', currentTodos.filter(t => t.listId !== id));
  };

  // 获取今天的待办
  const getTodayTodos = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return todos.filter(t => t.createdAt >= today.getTime());
  };

  // 获取最近7天的待办
  const getWeekTodos = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);
    return todos.filter(t => t.createdAt >= weekAgo.getTime());
  };

  return { 
    todos, 
    lists, 
    addTodo, 
    toggleTodo, 
    deleteTodo, 
    updateTodoPriority,
    addList, 
    deleteList,
    getTodayTodos,
    getWeekTodos
  };
}
