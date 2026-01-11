import { useState, useCallback } from 'react';
import type { PluginAPI, PluginSize } from '../../types';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

type FilterType = 'all' | 'active' | 'completed';

function useTodos(api: PluginAPI) {
  const [todos, setTodos] = useState<TodoItem[]>(
    api.getStorage<TodoItem[]>('todos') || []
  );

  const saveTodos = useCallback((newTodos: TodoItem[]) => {
    setTodos(newTodos);
    api.setStorage('todos', newTodos);
  }, [api]);

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

// 卡片视图
export function TodoCard({ api, size }: { api: PluginAPI; size: PluginSize }) {
  const { todos } = useTodos(api);
  const completedCount = todos.filter(t => t.completed).length;
  const activeCount = todos.length - completedCount;

  if (size === '1x1') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-2">
        <span className="text-2xl">✅</span>
        <span className="text-lg font-bold text-gray-700">{activeCount}</span>
        <span className="text-xs text-gray-400">待办</span>
      </div>
    );
  }

  if (size === '2x2') {
    const activeTodos = todos.filter(t => !t.completed).slice(0, 3);
    return (
      <div className="w-full h-full flex flex-col p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-gray-700">待办事项</span>
          <span className="text-xs text-gray-400">{completedCount}/{todos.length}</span>
        </div>
        <div className="flex-1 space-y-1 overflow-hidden">
          {activeTodos.map(todo => (
            <div key={todo.id} className="text-sm text-gray-600 truncate">• {todo.text}</div>
          ))}
          {activeTodos.length === 0 && <div className="text-sm text-gray-400">暂无待办</div>}
          {activeCount > 3 && <div className="text-xs text-gray-400">还有 {activeCount - 3} 项...</div>}
        </div>
      </div>
    );
  }

  const activeTodos = todos.filter(t => !t.completed).slice(0, 6);
  return (
    <div className="w-full h-full flex flex-col p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="font-medium text-gray-700">待办事项</span>
        <span className="text-sm text-gray-400">{completedCount}/{todos.length} 已完成</span>
      </div>
      <div className="flex-1 space-y-2 overflow-hidden">
        {activeTodos.map(todo => (
          <div key={todo.id} className="text-sm text-gray-600 truncate flex items-center gap-2">
            <span className="w-4 h-4 border rounded flex-shrink-0" />
            {todo.text}
          </div>
        ))}
        {activeTodos.length === 0 && <div className="text-sm text-gray-400 text-center py-4">暂无待办事项</div>}
      </div>
    </div>
  );
}

// 弹窗视图
export function TodoModal({ api }: { api: PluginAPI }) {
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos(api);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const handleAdd = () => {
    addTodo(input);
    setInput('');
  };

  const filteredTodos = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">待办事项</h3>
        <span className="text-sm text-gray-500">{completedCount}/{todos.length}</span>
      </div>
      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="添加任务..."
          className="flex-1 px-3 py-2 border rounded-lg text-sm"
        />
        <button onClick={handleAdd} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600">
          添加
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        {(['all', 'active', 'completed'] as FilterType[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 text-sm rounded ${filter === f ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            {f === 'all' ? '全部' : f === 'active' ? '进行中' : '已完成'}
          </button>
        ))}
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {filteredTodos.map(todo => (
          <div key={todo.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 group">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="w-4 h-4 rounded"
            />
            <span className={`flex-1 text-sm ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100"
            >
              ×
            </button>
          </div>
        ))}
        {filteredTodos.length === 0 && <div className="text-center text-gray-400 py-8">暂无任务</div>}
      </div>
    </div>
  );
}
