/**
 * Tests for search history utility functions
 */
import { describe, it, expect } from 'vitest';
import { addToHistory, removeFromHistory } from '../searchHistory';

describe('searchHistory utilities', () => {
  describe('addToHistory', () => {
    it('should add new query to beginning of history', () => {
      const history = ['old query'];
      const result = addToHistory(history, 'new query');
      expect(result[0]).toBe('new query');
      expect(result).toHaveLength(2);
    });

    it('should move existing query to top', () => {
      const history = ['query1', 'query2', 'query3'];
      const result = addToHistory(history, 'query2');
      expect(result[0]).toBe('query2');
      expect(result).toHaveLength(3);
    });

    it('should not add empty query', () => {
      const history = ['query1'];
      const result = addToHistory(history, '');
      expect(result).toEqual(history);
    });

    it('should trim whitespace from query', () => {
      const history: string[] = [];
      const result = addToHistory(history, '  query  ');
      expect(result[0]).toBe('query');
    });

    it('should limit history to max items', () => {
      const history = Array.from({ length: 10 }, (_, i) => `query${i}`);
      const result = addToHistory(history, 'new query');
      expect(result).toHaveLength(10);
      expect(result[0]).toBe('new query');
    });
  });

  describe('removeFromHistory', () => {
    it('should remove specified query', () => {
      const history = ['query1', 'query2', 'query3'];
      const result = removeFromHistory(history, 'query2');
      expect(result).toEqual(['query1', 'query3']);
    });

    it('should return same array if query not found', () => {
      const history = ['query1', 'query2'];
      const result = removeFromHistory(history, 'query3');
      expect(result).toEqual(history);
    });

    it('should handle empty history', () => {
      const history: string[] = [];
      const result = removeFromHistory(history, 'query');
      expect(result).toEqual([]);
    });
  });
});
