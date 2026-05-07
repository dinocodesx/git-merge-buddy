import { describe, it, expect, vi, beforeEach } from "vitest";
import { reviewProcessor } from "./reviewProcessor";
import { Job } from "bullmq";

// Use vi.hoisted to define mock objects that need to be available to hoisted vi.mock calls
const mocks = vi.hoisted(() => ({
  mockRepo: { getRepoByGithubId: vi.fn() },
  mockReview: {
    createReview: vi.fn().mockResolvedValue({ id: "review-123" }),
    markReviewCompleted: vi.fn().mockResolvedValue(undefined),
    markReviewFailed: vi.fn().mockResolvedValue(undefined),
  },
  mockUser: { getUserById: vi.fn() },
  mockGemini: {
    generateReview: vi.fn().mockResolvedValue({
      reviews: [{ file: "test.ts", line: 10, comment: "Fixed bug" }],
    }),
  },
  mockOctokit: {
    getPrDiff: vi.fn().mockResolvedValue("diff"),
    getRepoConfig: vi.fn().mockResolvedValue(null),
    postReviewComments: vi.fn().mockResolvedValue(undefined),
  },
  mockEmail: {
    sendFailureNotification: vi.fn().mockResolvedValue(undefined),
  },
}));

// Mock @repo/core
vi.mock("@repo/core", () => ({
  GeminiService: class {
    generateReview = mocks.mockGemini.generateReview;
  },
  OctokitService: class {
    getPrDiff = mocks.mockOctokit.getPrDiff;
    getRepoConfig = mocks.mockOctokit.getRepoConfig;
    postReviewComments = mocks.mockOctokit.postReviewComments;
  },
  EmailService: class {
    sendFailureNotification = mocks.mockEmail.sendFailureNotification;
  },
  parseAndTruncateDiff: vi.fn((diff) => diff),
}));

// Mock @repo/database
vi.mock("@repo/database", () => ({
  RepoRepository: class {
    getRepoByGithubId = mocks.mockRepo.getRepoByGithubId;
  },
  ReviewRepository: class {
    createReview = mocks.mockReview.createReview;
    markReviewCompleted = mocks.mockReview.markReviewCompleted;
    markReviewFailed = mocks.mockReview.markReviewFailed;
  },
  UserRepository: class {
    getUserById = mocks.mockUser.getUserById;
  },
}));

// Mock logger
vi.mock("../utils/logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

describe("reviewProcessor", () => {
  let mockJob: Partial<Job>;

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset default values to avoid contamination
    mocks.mockOctokit.getPrDiff.mockResolvedValue("diff content");
    mocks.mockGemini.generateReview.mockResolvedValue({
      reviews: [{ file: "src/index.ts", line: 10, comment: "Test comment" }],
    });

    mockJob = {
      id: "job-1",
      data: {
        repoId: 12345,
        prNumber: 42,
        installationId: 6789,
        commitSha: "abc123sha",
      },
    };
  });

  it("should process a review successfully in a standard scenario", async () => {
    mocks.mockRepo.getRepoByGithubId.mockResolvedValue({
      id: "repo-id",
      fullName: "owner/repo",
      isActive: true,
      personaPrompt: "Be helpful",
    });

    const result = await reviewProcessor(mockJob as Job);

    expect(result).toEqual({ status: "success", commentCount: 1 });
    expect(mocks.mockReview.createReview).toHaveBeenCalled();
    expect(mocks.mockOctokit.getPrDiff).toHaveBeenCalledWith("owner", "repo", 42);
    expect(mocks.mockGemini.generateReview).toHaveBeenCalled();
    expect(mocks.mockOctokit.postReviewComments).toHaveBeenCalled();
    expect(mocks.mockReview.markReviewCompleted).toHaveBeenCalledWith("review-123", 0);
  });

  it("should skip processing if the repository is inactive", async () => {
    mocks.mockRepo.getRepoByGithubId.mockResolvedValue({
      id: "repo-id",
      fullName: "owner/repo",
      isActive: false,
    });

    const result = await reviewProcessor(mockJob as Job);

    expect(result).toEqual({ status: "skipped", reason: "inactive" });
    expect(mocks.mockReview.createReview).not.toHaveBeenCalled();
    expect(mocks.mockGemini.generateReview).not.toHaveBeenCalled();
  });

  it("should handle PRs with no diff content", async () => {
    mocks.mockRepo.getRepoByGithubId.mockResolvedValue({
      id: "repo-id",
      fullName: "owner/repo",
      isActive: true,
    });
    mocks.mockOctokit.getPrDiff.mockResolvedValue("");

    const result = await reviewProcessor(mockJob as Job);

    expect(result).toEqual({ status: "completed", reason: "no_diff" });
    expect(mocks.mockReview.markReviewCompleted).toHaveBeenCalledWith("review-123", 0);
    expect(mocks.mockGemini.generateReview).not.toHaveBeenCalled();
  });

  it("should mark review as failed and notify user on error", async () => {
    mocks.mockRepo.getRepoByGithubId.mockResolvedValue({
      id: "repo-id",
      fullName: "owner/repo",
      isActive: true,
      userId: "user-1",
    });
    mocks.mockUser.getUserById.mockResolvedValue({ email: "user@example.com" });
    mocks.mockGemini.generateReview.mockRejectedValue(new Error("AI error"));

    await expect(reviewProcessor(mockJob as Job)).rejects.toThrow("AI error");

    expect(mocks.mockReview.markReviewFailed).toHaveBeenCalledWith("review-123", "AI error");
    expect(mocks.mockEmail.sendFailureNotification).toHaveBeenCalledWith(
      "user@example.com",
      "owner/repo",
      42
    );
  });

  it("should handle missing repository in database", async () => {
    mocks.mockRepo.getRepoByGithubId.mockResolvedValue(null);

    await expect(reviewProcessor(mockJob as Job)).rejects.toThrow(
      "Repository with GitHub ID 12345 not found in database."
    );
  });
});
