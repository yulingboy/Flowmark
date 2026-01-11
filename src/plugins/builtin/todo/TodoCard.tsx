import type { PluginSize } from '../../types';
import { useTodos } from './useTodos';

export function TodoCard({ size }: { size: PluginSize }) {
  const { todos } = useTodos();
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
