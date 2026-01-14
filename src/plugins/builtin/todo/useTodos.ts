import { useTodoStore } from './store';

export function useTodos() {
  const { todos, lists, addTodo, toggleTodo, deleteTodo, updateTodoPriority, addList, deleteList } = useTodoStore();

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
