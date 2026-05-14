import { describe, it, expect } from 'vitest';
import { cn } from '@/utils/cn';

describe('cn utility', () => {
  it('should combine class names', () => {
    const result = cn('class1', 'class2');
    expect(result).toBe('class1 class2');
  });

  it('should handle conditionals', () => {
    const result = cn('base', false && 'hidden', true && 'visible');
    expect(result).toBe('base visible');
  });

  it('should handle empty strings', () => {
    const result = cn('base', '', 'middle', '');
    expect(result).toBe('base middle');
  });

  it('should handle undefined and null', () => {
    const result = cn('base', undefined, null, 'end');
    expect(result).toBe('base end');
  });

  it('should handle arrays', () => {
    const result = cn(['a', 'b'], 'c');
    expect(result).toBe('a b c');
  });

  it('should handle objects with truthy values', () => {
    const result = cn('base', { active: true, disabled: false });
    expect(result).toBe('base active');
  });
});