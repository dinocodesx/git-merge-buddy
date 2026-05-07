import "dotenv/config";
import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
import { ReviewComment } from "../types";

/**
 * Service for interacting with the GitHub API via Octokit.
 * Specifically configured to act as a GitHub App installation.
 */
export class OctokitService {
  private octokit: Octokit;

  /**
   * Initializes the Octokit service with GitHub App credentials.
   * 
   * Prioritizes values passed in the `options` object, falling back to 
   * GITHUB_APP_ID, GITHUB_PRIVATE_KEY, and GITHUB_INSTALLATION_ID from the environment.
   * 
   * @param options - Optional overrides for GitHub App configuration.
   * @param options.appId - The unique ID of your GitHub App.
   * @param options.privateKey - The RSA private key of your GitHub App.
   * @param options.installationId - The specific installation ID to act upon.
   */
  constructor(options?: { appId?: number; privateKey?: string; installationId?: number }) {
    const appId = options?.appId ?? Number(process.env.GITHUB_APP_ID);
    const privateKey = options?.privateKey ?? process.env.GITHUB_PRIVATE_KEY;
    const installationId = options?.installationId ?? Number(process.env.GITHUB_INSTALLATION_ID);

    if (!appId || !privateKey || !installationId) {
      throw new Error(
        "GitHub App credentials (appId, privateKey, installationId) are required. " +
        "Set them in .env or pass them to the constructor."
      );
    }

    this.octokit = new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId,
        privateKey,
        installationId,
      },
    });
  }

  /**
   * Fetches the raw diff of a pull request.
   * @param owner - The repository owner (user or organization).
   * @param repo - The repository name.
   * @param pull_number - The pull request number.
   * @returns The diff content as a string.
   */
  async getPrDiff(owner: string, repo: string, pull_number: number): Promise<string> {
    const { data } = await this.octokit.pulls.get({
      owner,
      repo,
      pull_number,
      mediaType: {
        format: "diff",
      },
    });
    return data as unknown as string;
  }

  /**
   * Posts AI-generated review comments back to a GitHub pull request.
   * Creates a single review event with multiple line-level comments.
   * 
   * @param owner - The repository owner.
   * @param repo - The repository name.
   * @param pull_number - The pull request number.
   * @param commit_id - The SHA of the commit to attach the review to.
   * @param comments - Array of review comments including file path, line, and body.
   */
  async postReviewComments(
    owner: string,
    repo: string,
    pull_number: number,
    commit_id: string,
    comments: ReviewComment[]
  ): Promise<void> {
    await this.octokit.pulls.createReview({
      owner,
      repo,
      pull_number,
      commit_id,
      event: "COMMENT",
      comments: comments.map((c) => ({
        path: c.file,
        line: c.line,
        body: c.comment,
      })),
    });
  }

  /**
   * Attempts to fetch a custom configuration file (.ai-reviewer.md) from the target repository.
   * This allows users to define repo-specific review rules.
   * 
   * @param owner - The repository owner.
   * @param repo - The repository name.
   * @returns The content of the config file if found, otherwise null.
   */
  async getRepoConfig(owner: string, repo: string): Promise<string | null> {
    try {
      const { data } = await this.octokit.repos.getContent({
        owner,
        repo,
        path: ".ai-reviewer.md",
      });

      if ("content" in data) {
        return Buffer.from(data.content, "base64").toString();
      }
      return null;
    } catch (error) {
      // Return null if the file doesn't exist or is inaccessible
      return null;
    }
  }
}
