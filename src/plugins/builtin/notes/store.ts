import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Note } from './types';

interface NotesState {
  notes: Note[];
  addNote: () => string;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  clearAllNotes: () => void;
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set) => ({
      notes: [],

      addNote: () => {
        const newNote: Note = {
          id: Date.now().toString(),
          title: '',
          content: '',
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        set(state => ({ notes: [newNote, ...state.notes] }));
        return newNote.id;
      },

      updateNote: (id, updates) => {
        set(state => ({
          notes: state.notes.map(n => 
            n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n
          )
        }));
      },

      deleteNote: (id) => {
        set(state => ({ notes: state.notes.filter(n => n.id !== id) }));
      },

      clearAllNotes: () => {
        set({ notes: [] });
      }
    }),
    { name: 'notes-plugin-data' }
  )
);
