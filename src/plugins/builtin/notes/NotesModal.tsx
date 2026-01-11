import { useState } from 'react';
import type { PluginAPI } from '../../types';
import { useNotes, formatFullTime } from './useNotes';

// 空文件夹图标
function EmptyFolderIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 16C8 13.7909 9.79086 12 12 12H24L28 16H52C54.2091 16 56 17.7909 56 20V48C56 50.2091 54.2091 52 52 52H12C9.79086 52 8 50.2091 8 48V16Z" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2"/>
      <path d="M8 20H56V48C56 50.2091 54.2091 52 52 52H12C9.79086 52 8 50.2091 8 48V20Z" fill="#f9fafb" stroke="#d1d5db" strokeWidth="2"/>
    </svg>
  );
}

// 弹窗视图 - 左右分栏布局
export function NotesModal({ api }: { api: PluginAPI }) {
  const { notes, addNote, updateNote, deleteNote, clearAllNotes } = useNotes(api);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedNote = notes.find(n => n.id === selectedId);

  // 过滤笔记
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    const id = addNote();
    setSelectedId(id);
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleDelete = (id: string) => {
    deleteNote(id);
    if (selectedId === id) {
      setSelectedId(null);
    }
  };

  return (
    <div className="flex w-full h-full">
      {/* 左侧列表 */}
      <div className="w-[260px] flex-shrink-0 border-r border-gray-200 flex flex-col bg-white">
        {/* 搜索和新建 */}
        <div className="p-3 border-b border-gray-100">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="搜索笔记标题"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-gray-50"
            />
            <button
              onClick={handleAdd}
              className="w-10 h-10 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <span className="text-xl">+</span>
            </button>
          </div>
        </div>

        {/* 笔记列表 */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <EmptyFolderIcon className="mb-2 opacity-50" />
              <span className="text-sm">暂无数据</span>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {filteredNotes.map(note => (
                <div
                  key={note.id}
                  onClick={() => handleSelect(note.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors group ${
                    selectedId === note.id 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-blue-500 truncate text-sm">
                        {note.title || '未命名笔记'}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        更新时间：{formatFullTime(note.updatedAt)}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(note.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center text-red-400 hover:text-red-500 rounded transition-all"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 底部操作 */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={clearAllNotes}
            disabled={notes.length === 0}
            className="w-full py-2 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            清除所有内容
          </button>
        </div>
      </div>

      {/* 右侧编辑区 */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {selectedNote ? (
          <>
            {/* 标题栏 */}
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <input
                type="text"
                placeholder="未命名笔记"
                value={selectedNote.title}
                onChange={e => updateNote(selectedNote.id, { title: e.target.value })}
                className="flex-1 text-gray-700 font-medium bg-transparent outline-none placeholder-gray-400"
              />
              <button
                onClick={() => setSelectedId(null)}
                className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 ml-2"
              >
                ✕
              </button>
            </div>
            
            {/* 内容编辑区 */}
            <div className="flex-1 p-4 overflow-hidden">
              <textarea
                placeholder="笔记内容（最大5000字符）"
                value={selectedNote.content}
                onChange={e => {
                  if (e.target.value.length <= 5000) {
                    updateNote(selectedNote.id, { content: e.target.value });
                  }
                }}
                className="w-full h-full resize-none bg-gray-50 rounded-lg p-4 outline-none text-gray-600 placeholder-gray-400 border border-gray-200 focus:border-blue-300"
              />
            </div>
            
            {/* 底部状态栏 */}
            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>3s 延迟自动保存</span>
                <span>字数：{selectedNote.content.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedId(null)}
                  className="px-4 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取 消
                </button>
                <button
                  onClick={() => setSelectedId(null)}
                  className="px-4 py-1.5 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  保 存
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <EmptyFolderIcon className="mb-3 opacity-50" />
            <span className="text-sm">暂无内容，请先创建/选中笔记</span>
          </div>
        )}
      </div>
    </div>
  );
}
