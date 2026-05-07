import { describe, it, expect } from 'vitest';
import { parseAndTruncateDiff } from '../utils/diffParser';
import { generateJobDeduplicationKey } from '../queue/jobConfig';

/**
 * Tests for core utility functions.
 */

describe('utils/diffParser', () => {
  it('should not truncate diff if under limit', () => {
    const diff = 'small diff';
    expect(parseAndTruncateDiff(diff, 100)).toBe(diff);
  });

  it('should truncate diff if over limit', () => {
    const diff = 'a'.repeat(200);
    const result = parseAndTruncateDiff(diff, 100);
    expect(result.length).toBeLessThan(200);
    expect(result).toContain('[Diff truncated due to length limit]');
  });
});

describe('queue/jobConfig', () => {
  it('should generate a correct deduplication key', () => {
    const key = generateJobDeduplicationKey(1, 123, 'sha123');
    expect(key).toBe('pr-1-123-sha123');
  });
});
