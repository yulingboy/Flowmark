import { useState } from 'react';
import { useTodos } from './useTodos';
import type { FilterType } from './types';

export function TodoModal() {
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();
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
