import type { PluginSize } from '../../types';
import { useNotes } from './useNotes';

// 卡片视图
export function NotesCard({ size }: { size: PluginSize }) {
  const { notes } = useNotes();

  if (size === '1x1') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-2">
        <span className="text-2xl">📝</span>
        <span className="text-lg font-bold text-gray-700">{notes.length}</span>
        <span className="text-xs text-gray-400">笔记</span>
      </div>
    );
  }

  if (size === '2x2') {
    const recentNotes = notes.slice(0, 3);
    return (
      <div className="w-full h-full flex flex-col p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-base">📝</span>
            <span className="font-medium text-gray-700">记事本</span>
          </div>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{notes.length}</span>
        </div>
        <div className="flex-1 space-y-1.5 overflow-hidden">
          {recentNotes.map(note => (
            <div 
              key={note.id} 
              className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="text-sm text-gray-700 truncate text-left">
                {note.title || note.content || '空笔记'}
              </div>
            </div>
          ))}
          {notes.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <span className="text-2xl mb-1">📝</span>
              <span className="text-xs">暂无笔记</span>
            </div>
          )}
          {notes.length > 3 && (
            <div className="text-xs text-gray-400 text-center">
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
          <span className="text-lg">📝</span>
          <span className="font-medium text-gray-700">记事本</span>
        </div>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{notes.length} 条</span>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-2 overflow-hidden">
        {recentNotes.map(note => (
          <div 
            key={note.id} 
            className="p-2.5 rounded-xl shadow-sm flex flex-col bg-blue-50"
          >
            <div className="text-xs font-medium text-gray-700 truncate">
              {note.title || '无标题'}
            </div>
            <div className="text-xs text-gray-600 line-clamp-2 mt-1 flex-1">
              {note.content || '暂无内容'}
            </div>
          </div>
        ))}
        {notes.length === 0 && (
          <div className="col-span-2 flex flex-col items-center justify-center h-full text-gray-400">
            <span className="text-3xl mb-2">📝</span>
            <span className="text-sm">暂无笔记</span>
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
