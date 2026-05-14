import { describe, it, expect } from 'vitest';
import { extractFromQuery, EXAMPLE_QUERIES, getTagColor } from '@/utils/nlp';

describe('NLP Utilities', () => {
  describe('extractFromQuery', () => {
    it('should extract destination from query', () => {
      const result = extractFromQuery('I want to go to Goa');
      expect(result.destination).toBe('Goa');
    });

    it('should extract duration from query', () => {
      const result = extractFromQuery('3 day trip to Goa');
      expect(result.duration).toBe(3);
    });

    it('should extract beach tag from query', () => {
      const result = extractFromQuery('beach vacation in Goa');
      expect(result.tags).toContain('beach');
    });

    it('should extract adventure tag from query', () => {
      const result = extractFromQuery('adventure trip to Manali');
      expect(result.tags).toContain('adventure');
    });

    it('should extract numeric duration', () => {
      const result = extractFromQuery('3 day trip');
      expect(result.duration).toBe(3);
    });

    it('should extract 7 days for week trip', () => {
      const result = extractFromQuery('week trip');
      expect(result.duration).toBe(7);
    });

    it('should extract 7 days for week trip with number', () => {
      const result = extractFromQuery('2 week trip');
      expect(result.duration).toBe(14);
    });

    it('should return empty tags for generic query', () => {
      const result = extractFromQuery('I want a nice trip');
      expect(result.tags).toEqual([]);
    });

    it('should handle empty query', () => {
      const result = extractFromQuery('');
      expect(result.originalQuery).toBe('');
      expect(result.tags).toEqual([]);
    });

    it('should extract multiple tags', () => {
      const result = extractFromQuery('beach and adventure trip in Goa');
      expect(result.tags).toContain('beach');
      expect(result.tags).toContain('adventure');
    });

    it('should extract budget from query', () => {
      const result = extractFromQuery('budget trip to Goa');
      expect(result.budget).toBe('budget-friendly');
    });

    it('should extract group type from query', () => {
      const result = extractFromQuery('couple trip to Goa');
      expect(result.groupType).toBe('couple');
    });
  });

  describe('getTagColor', () => {
    it('should return green color for beach tag (environment category)', () => {
      const color = getTagColor('beach');
      expect(color).toContain('green');
    });

    it('should return rose color for adventure tag (activity category)', () => {
      const color = getTagColor('adventure');
      expect(color).toContain('rose');
    });

    it('should return eucalyptus color for unknown tag', () => {
      const color = getTagColor('unknown-tag');
      expect(color).toContain('eucalyptus');
    });
  });

  describe('EXAMPLE_QUERIES', () => {
    it('should have at least 4 example queries', () => {
      expect(EXAMPLE_QUERIES.length).toBeGreaterThanOrEqual(4);
    });

    it('should have non-empty query strings', () => {
      EXAMPLE_QUERIES.forEach(query => {
        expect(query.trim().length).toBeGreaterThan(0);
      });
    });
  });
});