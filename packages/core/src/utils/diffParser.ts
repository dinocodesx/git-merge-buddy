/**
 * Utility for parsing and preparing Git diffs for AI analysis.
 */

/**
 * Truncates a diff string if it exceeds the maximum character limit.
 * 
 * Large diffs can exceed the context window of AI models. This function
 * ensures the diff stays within reasonable limits while keeping as much 
 * context as possible from the beginning of the diff.
 * 
 * @param diff - The raw Git diff string.
 * @param maxChars - Maximum number of characters allowed (defaults to 40,000).
 * @returns The (potentially truncated) diff string.
 */
export function parseAndTruncateDiff(diff: string, maxChars: number = 40000): string {
  if (diff.length <= maxChars) {
    return diff;
  }

  const lines = diff.split('\n');
  let truncatedDiff = '';
  let currentChars = 0;

  for (const line of lines) {
    // Check if adding this line would exceed the limit
    if (currentChars + line.length + 1 > maxChars) {
      truncatedDiff += '\n... [Diff truncated due to length limit] ...';
      break;
    }
    truncatedDiff += line + '\n';
    currentChars += line.length + 1;
  }

  return truncatedDiff;
}
