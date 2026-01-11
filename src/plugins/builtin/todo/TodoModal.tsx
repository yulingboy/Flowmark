import { useState } from 'react';
import { useTodos } from './useTodos';
import type { FilterType, Priority } from './types';

// 空状态图标
function EmptyIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="80" height="80" viewBox="0 0 80 80" fill="none">
      <path d="M20 25C20 22.2386 22.2386 20 25 20H40L45 25H55C57.7614 25 60 27.2386 60 30V55C60 57.7614 57.7614 60 55 60H25C22.2386 60 20 57.7614 20 55V25Z" fill="#f3f4f6" stroke="#e5e7eb" strokeWidth="2"/>
      <path d="M20 30H60V55C60 57.7614 57.7614 60 55 60H25C22.2386 60 20 57.7614 20 55V30Z" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="2"/>
    </svg>
  );
}

// 优先级颜色
const priorityColors: Record<Priority, string> = {
  low: 'bg-yellow-400',
  medium: 'bg-green-400',
  high: 'bg-red-400'
};

export function TodoModal() {
  const { todos, lists, addTodo, toggleTodo, deleteTodo, addList, deleteList, getTodayTodos, getWeekTodos } = useTodos();
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<FilterType | string>('all');
  const [selectedPriority, setSelectedPriority] = useState<Priority>('medium');
  const [showNewList, setShowNewList] = useState(false);
  const [newListName, setNewListName] = useState('');

  const handleAdd = () => {
    if (!input.trim()) return;
    const listId = filter === 'all' || filter === 'today' || filter === 'week' ? 'default' : filter;
    addTodo(input, listId, selectedPriority);
    setInput('');
  };

  const handleAddList = () => {
    if (!newListName.trim()) return;
    addList(newListName);
    setNewListName('');
    setShowNewList(false);
  };

  // 根据筛选条件获取待办
  const getFilteredTodos = () => {
    if (filter === 'today') return getTodayTodos();
    if (filter === 'week') return getWeekTodos();
    if (filter === 'all') return todos;
    return todos.filter(t => t.listId === filter);
  };

  const filteredTodos = getFilteredTodos().filter(t => !t.completed);
  const completedTodos = getFilteredTodos().filter(t => t.completed);

  // 获取各分类数量
  const allCount = todos.filter(t => !t.completed).length;
  const todayCount = getTodayTodos().filter(t => !t.completed).length;
  const weekCount = getWeekTodos().filter(t => !t.completed).length;

  const getListCount = (listId: string) => todos.filter(t => t.listId === listId && !t.completed).length;

  const getFilterTitle = () => {
    if (filter === 'all') return '所有待办';
    if (filter === 'today') return '今天';
    if (filter === 'week') return '最近七天';
    const list = lists.find(l => l.id === filter);
    return list?.name || '待办';
  };

  return (
    <div className="flex w-full h-full">
      {/* 左侧分类列表 */}
      <div className="w-[180px] flex-shrink-0 border-r border-gray-200 flex flex-col bg-white">
        {/* 搜索框 */}
        <div className="p-3">
          <input
            type="text"
            placeholder="搜索待办"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-gray-50"
          />
        </div>

        {/* 智能分类 */}
        <div className="px-2">
          <div
            onClick={() => setFilter('all')}
            className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer ${filter === 'all' ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
          >
            <div className="flex items-center gap-2">
              <span className={`w-1 h-4 rounded-full ${filter === 'all' ? 'bg-blue-500' : 'bg-transparent'}`} />
              <span className={filter === 'all' ? 'text-blue-500 font-medium' : 'text-gray-700'}>所有</span>
            </div>
            <span className={filter === 'all' ? 'text-blue-500' : 'text-gray-400'}>{allCount}</span>
          </div>
          <div
            onClick={() => setFilter('today')}
            className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer ${filter === 'today' ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
          >
            <span className={filter === 'today' ? 'text-blue-500 font-medium' : 'text-gray-700'}>今天</span>
            <span className={filter === 'today' ? 'text-blue-500' : 'text-gray-400'}>{todayCount}</span>
          </div>
          <div
            onClick={() => setFilter('week')}
            className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer ${filter === 'week' ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
          >
            <span className={filter === 'week' ? 'text-blue-500 font-medium' : 'text-gray-700'}>最近七天</span>
            <span className={filter === 'week' ? 'text-blue-500' : 'text-gray-400'}>{weekCount}</span>
          </div>
        </div>

        {/* 自定义列表 */}
        <div className="flex-1 overflow-y-auto px-2 mt-2">
          {lists.filter(l => l.id !== 'default').map(list => (
            <div
              key={list.id}
              onClick={() => setFilter(list.id)}
              className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer group ${filter === list.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
            >
              <span className={filter === list.id ? 'text-blue-500 font-medium' : 'text-gray-700'}>{list.name}</span>
              <div className="flex items-center gap-1">
                <span className={filter === list.id ? 'text-blue-500' : 'text-gray-400'}>{getListCount(list.id)}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteList(list.id); }}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 ml-1"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 新建列表 */}
        <div className="p-3 border-t border-gray-100">
          {showNewList ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={newListName}
                onChange={e => setNewListName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddList()}
                placeholder="列表名称"
                className="flex-1 px-2 py-1.5 text-sm border rounded"
                autoFocus
              />
              <button onClick={handleAddList} className="text-blue-500 text-sm">确定</button>
              <button onClick={() => setShowNewList(false)} className="text-gray-400 text-sm">取消</button>
            </div>
          ) : (
            <button
              onClick={() => setShowNewList(true)}
              className="w-full py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 flex items-center justify-center gap-1"
            >
              <span>+</span> 新建列表
            </button>
          )}
        </div>
      </div>

      {/* 右侧内容区 */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* 标题栏 */}
        <div className="px-4 py-3 bg-white border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-medium text-gray-800">{getFilterTitle()}</h3>
          <div className="flex items-center gap-3">
            <select
              value={selectedPriority}
              onChange={e => setSelectedPriority(e.target.value as Priority)}
              className="px-2 py-1 text-sm border rounded-lg text-gray-600"
            >
              <option value="low">低优先级</option>
              <option value="medium">中优先级</option>
              <option value="high">高优先级</option>
            </select>
            <div className="flex gap-1">
              {(['low', 'medium', 'high'] as Priority[]).map(p => (
                <button
                  key={p}
                  onClick={() => setSelectedPriority(p)}
                  className={`w-5 h-5 rounded-full ${priorityColors[p]} ${selectedPriority === p ? 'ring-2 ring-offset-1 ring-gray-400' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 待办列表 */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredTodos.length === 0 && completedTodos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <EmptyIcon />
              <span className="mt-2 text-sm">没有待办事项</span>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTodos.map(todo => (
                <div key={todo.id} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm group">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="flex-1 text-sm text-gray-700">{todo.text}</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${priorityColors[todo.priority]}`} />
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
              
              {/* 已完成 */}
              {completedTodos.length > 0 && (
                <div className="mt-4">
                  <div className="text-xs text-gray-400 mb-2">已完成 ({completedTodos.length})</div>
                  {completedTodos.map(todo => (
                    <div key={todo.id} className="flex items-center gap-3 p-3 bg-white/50 rounded-lg group mb-2">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="flex-1 text-sm text-gray-400 line-through">{todo.text}</span>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 底部输入框 */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus-within:border-blue-400">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="请输入待办内容"
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
            />
            <button
              onClick={handleAdd}
              className="text-gray-400 hover:text-blue-500"
            >
              ↵
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
