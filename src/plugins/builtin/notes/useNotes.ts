import { useCallback } from 'react';
import type { PluginAPI } from '../../types';
import { usePluginStore } from '../../store';
import type { Note, NotesConfig } from './types';
import { PLUGIN_ID } from './types';

// 直接订阅 store，实现实时同步
export function useNotes(api: PluginAPI) {
  const config = api.getConfig<NotesConfig>();
  
  // 直接从 store 订阅数据，任何组件修改都会触发所有订阅者更新
  const notes = usePluginStore(
    state => (state.pluginData[PLUGIN_ID]?.notes as Note[]) || []
  );
  
  const setPluginData = usePluginStore(state => state.setPluginData);

  const saveNotes = useCallback((newNotes: Note[]) => {
    setPluginData(PLUGIN_ID, 'notes', newNotes);
  }, [setPluginData]);

  const addNote = useCallback(() => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: '',
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    saveNotes([newNote, ...notes]);
    return newNote.id;
  }, [notes, saveNotes]);

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    saveNotes(notes.map(n => n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n));
  }, [notes, saveNotes]);

  const deleteNote = useCallback((id: string) => {
    saveNotes(notes.filter(n => n.id !== id));
  }, [notes, saveNotes]);

  const clearAllNotes = useCallback(() => {
    saveNotes([]);
  }, [saveNotes]);

  return { notes, config, addNote, updateNote, deleteNote, clearAllNotes };
}

// 格式化完整时间
export function formatFullTime(timestamp: number): string {
  try {
    const date = new Date(timestamp);
    return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  } catch {
    return '未知时间';
  }
}
