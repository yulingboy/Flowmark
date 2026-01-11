import { Badge, List, Card, Empty } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import type { PluginSize } from '../../types';
import { useNotes } from './useNotes';

// 卡片视图
export function NotesCard({ size }: { size: PluginSize }) {
  const { notes } = useNotes();

  if (size === '1x1') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-2">
        <FileTextOutlined style={{ fontSize: 24, color: '#3b82f6' }} />
        <Badge count={notes.length} showZero color="#3b82f6" style={{ marginTop: 4 }} />
        <span className="text-xs text-gray-400 mt-1">笔记</span>
      </div>
    );
  }

  if (size === '2x2') {
    const recentNotes = notes.slice(0, 3);
    return (
      <div className="w-full h-full flex flex-col p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <FileTextOutlined style={{ fontSize: 16, color: '#3b82f6' }} />
            <span className="font-medium text-gray-700">记事本</span>
          </div>
          <Badge count={notes.length} size="small" color="#9ca3af" />
        </div>
        <div className="flex-1 overflow-hidden">
          {notes.length === 0 ? (
            <Empty description="暂无笔记" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <List
              size="small"
              dataSource={recentNotes}
              renderItem={(note) => (
                <List.Item className="!py-1.5 !px-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors mb-1">
                  <span className="text-sm text-gray-700 truncate text-left">
                    {note.title || note.content || '空笔记'}
                  </span>
                </List.Item>
              )}
            />
          )}
          {notes.length > 3 && (
            <div className="text-xs text-gray-400 text-center mt-1">
              还有 {notes.length - 3} 条笔记...
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2x4 尺寸
  const recentNotes = notes.slice(0, 6);
  return (
    <div className="w-full h-full flex flex-col p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileTextOutlined style={{ fontSize: 18, color: '#3b82f6' }} />
          <span className="font-medium text-gray-700">记事本</span>
        </div>
        <Badge count={`${notes.length} 条`} color="#9ca3af" />
      </div>
      <div className="flex-1 overflow-hidden">
        {notes.length === 0 ? (
          <Empty description="暂无笔记" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {recentNotes.map(note => (
              <Card 
                key={note.id} 
                size="small"
                className="bg-blue-50"
                styles={{ body: { padding: 10 } }}
              >
                <div className="text-xs font-medium text-gray-700 truncate">
                  {note.title || '无标题'}
                </div>
                <div className="text-xs text-gray-600 line-clamp-2 mt-1">
                  {note.content || '暂无内容'}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      {notes.length > 6 && (
        <div className="text-xs text-gray-400 text-center mt-2">
          还有 {notes.length - 6} 条笔记...
        </div>
      )}
    </div>
  );
}
