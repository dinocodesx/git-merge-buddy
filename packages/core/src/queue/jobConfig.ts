/**
 * Generates a unique key for deduplicating pull request review jobs in BullMQ.
 * 
 * Prevents processing the same commit multiple times if multiple webhooks 
 * (e.g., 'synchronize' and 'labeled') are fired simultaneously.
 * 
 * @param repoId - The unique GitHub ID of the repository.
 * @param prNumber - The pull request number.
 * @param commitSha - The specific commit SHA being reviewed.
 * @returns A formatted string key: `pr-{repoId}-{prNumber}-{commitSha}`.
 */
export function generateJobDeduplicationKey(
  repoId: number,
  prNumber: number,
  commitSha: string
): string {
  return `pr-${repoId}-${prNumber}-${commitSha}`;
}
