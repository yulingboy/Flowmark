import { useCallback } from 'react';
import { usePluginStore } from '../../store';
import type { Note } from './types';
import { PLUGIN_ID } from './types';

export function useNotes() {
  // 直接用 selector 订阅，自动响应变化
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

  return { notes, addNote, updateNote, deleteNote, clearAllNotes };
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
