import { prisma, ReviewStatus, Review } from "../client";

/**
 * Repository for managing AI PR Review related database operations.
 */
export class ReviewRepository {
  /**
   * Creates a new review record in the database.
   * @param data - The basic review information.
   * @param data.repoId - The internal ID of the repository.
   * @param data.commitSha - The SHA of the commit being reviewed.
   * @param data.prNumber - The number of the pull request on GitHub.
   * @returns The newly created Review object.
   */
  async createReview(data: {
    repoId: string;
    commitSha: string;
    prNumber: number;
  }): Promise<Review> {
    return prisma.review.create({
      data: {
        ...data,
        status: ReviewStatus.PENDING,
      },
    });
  }

  /**
   * Marks a pending review as completed and records token usage.
   * @param id - The unique internal ID of the review.
   * @param tokensUsed - The number of AI tokens consumed by this review.
   * @returns The updated Review object.
   */
  async markReviewCompleted(id: string, tokensUsed: number): Promise<Review> {
    return prisma.review.update({
      where: { id },
      data: {
        status: ReviewStatus.COMPLETED,
        tokensUsed,
        completedAt: new Date(),
      },
    });
  }

  /**
   * Marks a pending review as failed and records the error reason.
   * @param id - The unique internal ID of the review.
   * @param errorReason - A description of why the review failed.
   * @returns The updated Review object.
   */
  async markReviewFailed(id: string, errorReason: string): Promise<Review> {
    return prisma.review.update({
      where: { id },
      data: {
        status: ReviewStatus.FAILED,
        errorReason,
        completedAt: new Date(),
      },
    });
  }
}
