import { useState } from 'react';
import { Input, Select, Checkbox, Button, Empty, List, Tag, Badge } from 'antd';
import { PlusOutlined, DeleteOutlined, EnterOutlined } from '@ant-design/icons';
import { useTodos } from './useTodos';
import type { FilterType, Priority } from './types';

// 优先级颜色映射到 antd Tag 颜色
const priorityTagColors: Record<Priority, string> = {
  low: 'gold',
  medium: 'green',
  high: 'red'
};

const priorityLabels: Record<Priority, string> = {
  low: '低',
  medium: '中',
  high: '高'
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
          <Input
            placeholder="搜索待办"
            allowClear
            size="small"
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
            <Badge count={allCount} size="small" color={filter === 'all' ? '#3b82f6' : '#9ca3af'} />
          </div>
          <div
            onClick={() => setFilter('today')}
            className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer ${filter === 'today' ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
          >
            <span className={filter === 'today' ? 'text-blue-500 font-medium' : 'text-gray-700'}>今天</span>
            <Badge count={todayCount} size="small" color={filter === 'today' ? '#3b82f6' : '#9ca3af'} />
          </div>
          <div
            onClick={() => setFilter('week')}
            className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer ${filter === 'week' ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
          >
            <span className={filter === 'week' ? 'text-blue-500 font-medium' : 'text-gray-700'}>最近七天</span>
            <Badge count={weekCount} size="small" color={filter === 'week' ? '#3b82f6' : '#9ca3af'} />
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
                <Badge count={getListCount(list.id)} size="small" color={filter === list.id ? '#3b82f6' : '#9ca3af'} />
                <Button
                  type="text"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={(e) => { e.stopPropagation(); deleteList(list.id); }}
                  className="opacity-0 group-hover:opacity-100"
                />
              </div>
            </div>
          ))}
        </div>

        {/* 新建列表 */}
        <div className="p-3 border-t border-gray-100">
          {showNewList ? (
            <div className="flex gap-2">
              <Input
                value={newListName}
                onChange={e => setNewListName(e.target.value)}
                onPressEnter={handleAddList}
                placeholder="列表名称"
                size="small"
                autoFocus
              />
              <Button type="link" size="small" onClick={handleAddList}>确定</Button>
              <Button type="text" size="small" onClick={() => setShowNewList(false)}>取消</Button>
            </div>
          ) : (
            <Button
              type="primary"
              block
              icon={<PlusOutlined />}
              onClick={() => setShowNewList(true)}
            >
              新建列表
            </Button>
          )}
        </div>
      </div>

      {/* 右侧内容区 */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* 标题栏 */}
        <div className="px-4 py-3 bg-white border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-medium text-gray-800">{getFilterTitle()}</h3>
          <div className="flex items-center gap-3">
            <Select
              value={selectedPriority}
              onChange={setSelectedPriority}
              size="small"
              style={{ width: 100 }}
              options={[
                { value: 'low', label: '低优先级' },
                { value: 'medium', label: '中优先级' },
                { value: 'high', label: '高优先级' },
              ]}
            />
          </div>
        </div>

        {/* 待办列表 */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredTodos.length === 0 && completedTodos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Empty description="没有待办事项" />
            </div>
          ) : (
            <div className="space-y-2">
              <List
                dataSource={filteredTodos}
                renderItem={(todo) => (
                  <List.Item
                    className="!px-3 !py-2 bg-white rounded-lg shadow-sm mb-2"
                    actions={[
                      <Tag key="priority" color={priorityTagColors[todo.priority]}>{priorityLabels[todo.priority]}</Tag>,
                      <Button
                        key="delete"
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => deleteTodo(todo.id)}
                      />
                    ]}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id)}
                      />
                      <span className="text-sm text-gray-700">{todo.text}</span>
                    </div>
                  </List.Item>
                )}
              />
              
              {/* 已完成 */}
              {completedTodos.length > 0 && (
                <div className="mt-4">
                  <div className="text-xs text-gray-400 mb-2">已完成 ({completedTodos.length})</div>
                  <List
                    dataSource={completedTodos}
                    renderItem={(todo) => (
                      <List.Item
                        className="!px-3 !py-2 bg-white/50 rounded-lg mb-2"
                        actions={[
                          <Button
                            key="delete"
                            type="text"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => deleteTodo(todo.id)}
                          />
                        ]}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={todo.completed}
                            onChange={() => toggleTodo(todo.id)}
                          />
                          <span className="text-sm text-gray-400 line-through">{todo.text}</span>
                        </div>
                      </List.Item>
                    )}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* 底部输入框 */}
        <div className="p-4 bg-white border-t border-gray-200">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onPressEnter={handleAdd}
            placeholder="请输入待办内容"
            suffix={
              <Button
                type="text"
                icon={<EnterOutlined />}
                onClick={handleAdd}
              />
            }
          />
        </div>
      </div>
    </div>
  );
}
