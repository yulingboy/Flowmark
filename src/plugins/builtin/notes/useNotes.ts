import { useShallow } from 'zustand/react/shallow';
import { usePluginStore } from '../../store';
import type { Note } from './types';
import { PLUGIN_ID } from './types';

export function useNotes() {
  const notes = usePluginStore(
    useShallow(state => (state.pluginData[PLUGIN_ID]?.notes as Note[]) || [])
  );

  const addNote = () => {
    const currentNotes = usePluginStore.getState().pluginData[PLUGIN_ID]?.notes as Note[] || [];
    const newNote: Note = {
      id: Date.now().toString(),
      title: '',
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    usePluginStore.getState().setPluginData(PLUGIN_ID, 'notes', [newNote, ...currentNotes]);
    return newNote.id;
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    const currentNotes = usePluginStore.getState().pluginData[PLUGIN_ID]?.notes as Note[] || [];
    usePluginStore.getState().setPluginData(PLUGIN_ID, 'notes', currentNotes.map(n => n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n));
  };

  const deleteNote = (id: string) => {
    const currentNotes = usePluginStore.getState().pluginData[PLUGIN_ID]?.notes as Note[] || [];
    usePluginStore.getState().setPluginData(PLUGIN_ID, 'notes', currentNotes.filter(n => n.id !== id));
  };

  const clearAllNotes = () => {
    usePluginStore.getState().setPluginData(PLUGIN_ID, 'notes', []);
  };

  return { notes, addNote, updateNote, deleteNote, clearAllNotes };
}

export function formatFullTime(timestamp: number): string {
  try {
    const date = new Date(timestamp);
    return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  } catch {
    return '未知时间';
  }
}
