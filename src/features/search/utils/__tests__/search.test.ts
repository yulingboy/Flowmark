/**
 * Tests for search utility functions
 */
import { describe, it, expect } from 'vitest';
import { generateSearchUrl } from '../search';

describe('search utilities', () => {
  describe('generateSearchUrl', () => {
    it('should generate correct URL for bing', () => {
      const url = generateSearchUrl('test query', 'bing');
      expect(url).toBe('https://www.bing.com/search?q=test%20query');
    });

    it('should generate correct URL for google', () => {
      const url = generateSearchUrl('test query', 'google');
      expect(url).toBe('https://www.google.com/search?q=test%20query');
    });

    it('should generate correct URL for baidu', () => {
      const url = generateSearchUrl('test query', 'baidu');
      expect(url).toBe('https://www.baidu.com/s?wd=test%20query');
    });

    it('should encode special characters', () => {
      const url = generateSearchUrl('test & query = value', 'bing');
      expect(url).toContain('test%20%26%20query%20%3D%20value');
    });
  });
});
