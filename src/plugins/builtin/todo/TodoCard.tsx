import { Badge, List, Tag, Empty } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import type { PluginSize } from '../../types';
import { useTodos } from './useTodos';

export function TodoCard({ size }: { size: PluginSize }) {
  const { todos } = useTodos();
  const completedCount = todos.filter(t => t.completed).length;
  const activeCount = todos.length - completedCount;

  if (size === '1x1') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-2">
        <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />
        <Badge count={activeCount} showZero color="#3b82f6" style={{ marginTop: 4 }} />
        <span className="text-xs text-gray-400 mt-1">待办</span>
      </div>
    );
  }

  if (size === '2x2') {
    const activeTodos = todos.filter(t => !t.completed).slice(0, 3);
    return (
      <div className="w-full h-full flex flex-col p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-gray-700">待办事项</span>
          <Tag color="blue">{completedCount}/{todos.length}</Tag>
        </div>
        <div className="flex-1 overflow-hidden">
          {activeTodos.length === 0 ? (
            <Empty description="暂无待办" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <List
              size="small"
              dataSource={activeTodos}
              renderItem={(todo) => (
                <List.Item className="!py-1 !px-0">
                  <span className="text-sm text-gray-600 truncate">• {todo.text}</span>
                </List.Item>
              )}
            />
          )}
          {activeCount > 3 && (
            <div className="text-xs text-gray-400 mt-1">还有 {activeCount - 3} 项...</div>
          )}
        </div>
      </div>
    );
  }

  // 2x4 尺寸
  const activeTodos = todos.filter(t => !t.completed).slice(0, 6);
  return (
    <div className="w-full h-full flex flex-col p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="font-medium text-gray-700">待办事项</span>
        <Tag color="green">{completedCount}/{todos.length} 已完成</Tag>
      </div>
      <div className="flex-1 overflow-hidden">
        {activeTodos.length === 0 ? (
          <Empty description="暂无待办事项" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <List
            size="small"
            dataSource={activeTodos}
            renderItem={(todo) => (
              <List.Item className="!py-1.5 !px-0">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border rounded flex-shrink-0 border-gray-300" />
                  <span className="text-sm text-gray-600 truncate">{todo.text}</span>
                </div>
              </List.Item>
            )}
          />
        )}
      </div>
    </div>
  );
}
