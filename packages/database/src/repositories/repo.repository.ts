import { prisma, Repository } from "../client";

/**
 * Repository for managing Repository related database operations.
 */
export class RepoRepository {
  /**
   * Retrieves a repository by its unique GitHub ID.
   * @param githubId - The external ID assigned by GitHub.
   * @returns The Repository object if found, otherwise null.
   */
  async getRepoByGithubId(githubId: number): Promise<Repository | null> {
    return prisma.repository.findUnique({
      where: { githubId },
    });
  }

  /**
   * Checks if a repository is currently active for AI reviews.
   * @param githubId - The external ID assigned by GitHub.
   * @returns True if the repository is active, otherwise false.
   */
  async isRepoActive(githubId: number): Promise<boolean> {
    const repo = await this.getRepoByGithubId(githubId);
    return repo?.isActive ?? false;
  }

  /**
   * Updates the custom AI persona prompt for a repository.
   * @param id - The unique internal ID of the repository.
   * @param personaPrompt - The new instructions to pass to the AI model.
   * @returns The updated Repository object.
   */
  async updateRepoPersona(id: string, personaPrompt: string): Promise<Repository> {
    return prisma.repository.update({
      where: { id },
      data: { personaPrompt },
    });
  }
}
