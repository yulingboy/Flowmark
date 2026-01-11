import { useState, useCallback } from 'react';
import type { PluginAPI, PluginSize } from '../../types';

interface Note {
  id: string;
  content: string;
  color: string;
  createdAt: number;
  updatedAt: number;
}

interface NotesConfig {
  layout: 'grid' | 'list';
  defaultColor: string;
}

const COLORS = ['#fef08a', '#bbf7d0', '#bfdbfe', '#fecaca', '#e9d5ff', '#fed7aa'];

function useNotes(api: PluginAPI) {
  const config = api.getConfig<NotesConfig>();
  const [notes, setNotes] = useState<Note[]>(api.getStorage<Note[]>('notes') || []);

  const saveNotes = useCallback((newNotes: Note[]) => {
    setNotes(newNotes);
    api.setStorage('notes', newNotes);
  }, [api]);

  const addNote = useCallback(() => {
    const newNote: Note = {
      id: Date.now().toString(),
      content: '',
      color: config.defaultColor || COLORS[0],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    saveNotes([newNote, ...notes]);
    return newNote.id;
  }, [notes, config.defaultColor, saveNotes]);

  const updateNote = useCallback((id: string, content: string) => {
    saveNotes(notes.map(n => n.id === id ? { ...n, content, updatedAt: Date.now() } : n));
  }, [notes, saveNotes]);

  const updateNoteColor = useCallback((id: string, color: string) => {
    saveNotes(notes.map(n => n.id === id ? { ...n, color, updatedAt: Date.now() } : n));
  }, [notes, saveNotes]);

  const deleteNote = useCallback((id: string) => {
    saveNotes(notes.filter(n => n.id !== id));
  }, [notes, saveNotes]);

  return { notes, config, addNote, updateNote, updateNoteColor, deleteNote };
}

// 卡片视图
export function NotesCard({ api, size }: { api: PluginAPI; size: PluginSize }) {
  const { notes } = useNotes(api);

  if (size === '1x1') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-2">
        <span className="text-2xl">📝</span>
        <span className="text-lg font-bold text-gray-700">{notes.length}</span>
        <span className="text-xs text-gray-400">便签</span>
      </div>
    );
  }

  if (size === '2x2') {
    const recentNotes = notes.slice(0, 2);
    return (
      <div className="w-full h-full flex flex-col p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-gray-700">便签</span>
          <span className="text-xs text-gray-400">{notes.length} 条</span>
        </div>
        <div className="flex-1 space-y-1 overflow-hidden">
          {recentNotes.map(note => (
            <div key={note.id} className="text-sm text-gray-600 truncate p-1 rounded" style={{ backgroundColor: note.color + '80' }}>
              {note.content || '空便签'}
            </div>
          ))}
          {notes.length === 0 && <div className="text-sm text-gray-400">暂无便签</div>}
        </div>
      </div>
    );
  }

  const recentNotes = notes.slice(0, 4);
  return (
    <div className="w-full h-full flex flex-col p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="font-medium text-gray-700">便签</span>
        <span className="text-sm text-gray-400">{notes.length} 条</span>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-2 overflow-hidden">
        {recentNotes.map(note => (
          <div key={note.id} className="text-xs text-gray-700 p-2 rounded line-clamp-3" style={{ backgroundColor: note.color }}>
            {note.content || '空便签'}
          </div>
        ))}
        {notes.length === 0 && <div className="col-span-2 text-sm text-gray-400 text-center py-4">暂无便签</div>}
      </div>
    </div>
  );
}

// 弹窗视图
export function NotesModal({ api }: { api: PluginAPI }) {
  const { notes, config, addNote, updateNote, updateNoteColor, deleteNote } = useNotes(api);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = () => {
    const id = addNote();
    setEditingId(id);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">便签</h3>
        <button onClick={handleAdd} className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
          + 新建
        </button>
      </div>

      <div className={`${config.layout === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-3'} max-h-80 overflow-y-auto`}>
        {notes.map(note => (
          <div key={note.id} className="rounded-lg p-3 relative group min-h-[80px]" style={{ backgroundColor: note.color }}>
            {editingId === note.id ? (
              <textarea
                autoFocus
                value={note.content}
                onChange={e => updateNote(note.id, e.target.value)}
                onBlur={() => setEditingId(null)}
                className="w-full h-20 bg-transparent text-gray-800 text-sm resize-none outline-none"
                placeholder="输入内容..."
              />
            ) : (
              <div onClick={() => setEditingId(note.id)} className="text-gray-800 text-sm cursor-text whitespace-pre-wrap min-h-[60px]">
                {note.content || <span className="text-gray-500">点击编辑...</span>}
              </div>
            )}
            
            <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => updateNoteColor(note.id, c)}
                  className="w-4 h-4 rounded-full border border-gray-400 hover:scale-110 transition-transform"
                  style={{ backgroundColor: c }}
                />
              ))}
              <button onClick={() => deleteNote(note.id)} className="w-4 h-4 text-gray-600 hover:text-red-600 text-sm font-bold">
                ×
              </button>
            </div>
          </div>
        ))}
        {notes.length === 0 && <div className="col-span-2 text-center text-gray-400 py-8">点击"新建"创建便签</div>}
      </div>
    </div>
  );
}
