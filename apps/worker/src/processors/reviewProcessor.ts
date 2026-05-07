import { Job } from "bullmq";
import { logger } from "../utils/logger";
import {
  GeminiService,
  OctokitService,
  JobPayload,
  ReviewResponse,
  EmailService,
  parseAndTruncateDiff,
} from "@repo/core";
import {
  RepoRepository,
  ReviewRepository,
  UserRepository,
} from "@repo/database";

/**
 * Shared repository and service instances to avoid repeated instantiation.
 * In a more complex setup, these could be managed by a Dependency Injection container.
 */
const repoRepo = new RepoRepository();
const reviewRepo = new ReviewRepository();
const userRepo = new UserRepository();
const gemini = new GeminiService();
const mail = new EmailService();

/**
 * Core business logic for processing a "process-review" job.
 * This processor handles the end-to-end lifecycle of an AI PR review.
 *
 * Logic Steps:
 * 1. Resolve repository and check activity.
 * 2. Initialize review record in DB.
 * 3. Initialize Octokit for the specific installation.
 * 4. Fetch PR context (Diff and Config).
 * 5. Generate AI Review using Gemini.
 * 6. Post comments back to the GitHub PR.
 * 7. Finalize review status.
 *
 * @param job - The BullMQ Job object containing PR metadata.
 */
export const reviewProcessor = async (job: Job<JobPayload>) => {
  const { repoId: githubId, prNumber, installationId, commitSha } = job.data;

  let reviewId: string | undefined;

  try {
    logger.info(
      `[${job.id}] Starting review for GitHub Repo ${githubId}, PR #${prNumber}`,
    );

    // 1. Resolve repository and check activity
    const dbRepo = await repoRepo.getRepoByGithubId(githubId);
    if (!dbRepo) {
      throw new Error(
        `Repository with GitHub ID ${githubId} not found in database.`,
      );
    }

    if (!dbRepo.isActive) {
      logger.warn(
        `[${job.id}] Skipping: Repository ${dbRepo.fullName} is inactive.`,
      );
      return { status: "skipped", reason: "inactive" };
    }

    // 2. Initialize review record
    const review = await reviewRepo.createReview({
      repoId: dbRepo.id,
      commitSha,
      prNumber,
    });
    reviewId = review.id;

    // 3. Initialize Octokit for this specific installation
    // We instantiate OctokitService here because it is tied to an installationId
    const octokit = new OctokitService({ installationId });

    // 4. Fetch PR context (Diff and Config)
    const [owner, name] = dbRepo.fullName.split("/");
    if (!owner || !name) {
      throw new Error(`Invalid repository full name: ${dbRepo.fullName}`);
    }

    logger.debug(`[${job.id}] Fetching PR data from GitHub...`);
    let [rawDiff, repoConfig] = await Promise.all([
      octokit.getPrDiff(owner, name, prNumber),
      octokit.getRepoConfig(owner, name),
    ]);

    if (!rawDiff || rawDiff.trim().length === 0) {
      logger.info(`[${job.id}] PR #${prNumber} has no diff content.`);
      await reviewRepo.markReviewCompleted(reviewId, 0);
      return { status: "completed", reason: "no_diff" };
    }

    /**
     * Optimization: Truncate diff to fit within AI context limits.
     * Large diffs can cause timeouts or "Context Window Exceeded" errors.
     */
    const diff = parseAndTruncateDiff(rawDiff);

    // 5. Generate AI Review
    // Combine repo-level config with global/DB persona prompt if available
    const combinedPrompt = [
      dbRepo.personaPrompt,
      repoConfig ? `Repository-specific rules:\n${repoConfig}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    logger.info(`[${job.id}] Invoking Gemini AI for analysis...`);
    const aiResponse: ReviewResponse = await gemini.generateReview(
      diff,
      combinedPrompt,
    );

    // 6. Post comments to GitHub
    if (aiResponse.reviews?.length > 0) {
      logger.info(
        `[${job.id}] Posting ${aiResponse.reviews.length} comments to GitHub...`,
      );
      await octokit.postReviewComments(
        owner,
        name,
        prNumber,
        commitSha,
        aiResponse.reviews,
      );
    } else {
      logger.info(`[${job.id}] Gemini found no issues to report.`);
    }

    // 7. Finalize
    await reviewRepo.markReviewCompleted(reviewId, 0);
    logger.info(
      `[${job.id}] Successfully completed review for PR #${prNumber}`,
    );

    return { status: "success", commentCount: aiResponse.reviews?.length || 0 };
  } catch (error: any) {
    logger.error(`[${job.id}] Critical failure in reviewProcessor`, {
      message: error.message,
      stack: error.stack,
    });

    if (reviewId) {
      // Mark review as failed in DB
      await reviewRepo.markReviewFailed(reviewId, error.message);

      // Notify the repository owner via email
      try {
        const dbRepo = await repoRepo.getRepoByGithubId(githubId);
        if (dbRepo?.userId) {
          const user = await userRepo.getUserById(dbRepo.userId);
          if (user?.email) {
            await mail.sendFailureNotification(
              user.email,
              dbRepo.fullName,
              prNumber,
            );
          }
        }
      } catch (mailError) {
        logger.error(`[${job.id}] Failed to send failure notification email`, {
          error: mailError,
        });
      }
    }

    // Re-throw the error so BullMQ can handle the job lifecycle (e.g. retries)
    throw error;
  }
};
