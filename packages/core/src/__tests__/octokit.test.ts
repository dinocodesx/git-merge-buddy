import { describe, it, expect, vi, beforeEach } from "vitest";
import { OctokitService } from "../github/octokit.service";
import { Octokit } from "@octokit/rest";

const mockGetPulls = vi.fn();
const mockCreateReview = vi.fn();
const mockGetContent = vi.fn();

vi.mock("@octokit/rest", () => {
  return {
    Octokit: class {
      pulls = {
        get: mockGetPulls,
        createReview: mockCreateReview,
      };
      repos = {
        getContent: mockGetContent,
      };
    },
  };
});

vi.mock("@octokit/auth-app", () => ({
  createAppAuth: vi.fn(),
}));

describe("OctokitService", () => {
  let service: OctokitService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new OctokitService({
      appId: 123,
      privateKey: "fake-key",
      installationId: 456,
    });
  });

  it("should fetch a PR diff", async () => {
    mockGetPulls.mockResolvedValue({ data: "diff content" });

    const diff = await service.getPrDiff("owner", "repo", 1);

    expect(diff).toBe("diff content");
    expect(mockGetPulls).toHaveBeenCalledWith({
      owner: "owner",
      repo: "repo",
      pull_number: 1,
      mediaType: { format: "diff" },
    });
  });

  it("should post review comments", async () => {
    mockCreateReview.mockResolvedValue({});

    const comments = [
      { file: "index.ts", line: 10, comment: "Fix" },
      { file: "utils.ts", line: 5, comment: "Refactor" },
    ];

    await service.postReviewComments("owner", "repo", 1, "sha", comments);

    expect(mockCreateReview).toHaveBeenCalledWith({
      owner: "owner",
      repo: "repo",
      pull_number: 1,
      commit_id: "sha",
      event: "COMMENT",
      comments: [
        { path: "index.ts", line: 10, body: "Fix" },
        { path: "utils.ts", line: 5, body: "Refactor" },
      ],
    });
  });

  it("should fetch repo config if it exists", async () => {
    mockGetContent.mockResolvedValue({
      data: {
        content: Buffer.from("custom config").toString("base64"),
      },
    });

    const config = await service.getRepoConfig("owner", "repo");

    expect(config).toBe("custom config");
  });

  it("should return null if repo config does not exist", async () => {
    mockGetContent.mockRejectedValue(new Error("Not found"));

    const config = await service.getRepoConfig("owner", "repo");

    expect(config).toBeNull();
  });
});
