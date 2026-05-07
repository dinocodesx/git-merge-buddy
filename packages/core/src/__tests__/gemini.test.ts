import { describe, it, expect, vi, beforeEach } from "vitest";
import { GeminiService } from "../ai/gemini.service";

/**
 * Enhanced tests for the GeminiService.
 * Mocks the Google Generative AI SDK to verify edge cases in review generation.
 */

const mockGenerateContent = vi.fn();

vi.mock("@google/generative-ai", () => {
  return {
    GoogleGenerativeAI: class {
      constructor() {}
      getGenerativeModel() {
        return {
          generateContent: mockGenerateContent,
        };
      }
    },
  };
});

describe("GeminiService", () => {
  let service: GeminiService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new GeminiService({ apiKey: "fake-api-key" });
  });

  it("should generate a review from a clean JSON response", async () => {
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => JSON.stringify({
          reviews: [{ file: "test.ts", line: 10, comment: "Nice" }],
        }),
      },
    });

    const result = await service.generateReview("some diff");
    expect(result.reviews).toHaveLength(1);
    expect(result.reviews[0]?.file).toBe("test.ts");
  });

  it("should extract JSON even if wrapped in markdown code blocks", async () => {
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => "Here is your review:\n```json\n{\"reviews\": [{\"file\": \"app.js\", \"line\": 5, \"comment\": \"Fix this\"}]}\n```\nHope this helps!",
      },
    });

    const result = await service.generateReview("some diff");
    expect(result.reviews).toHaveLength(1);
    expect(result.reviews[0]?.comment).toBe("Fix this");
  });

  it("should throw an error if the response is not valid JSON", async () => {
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => "This is not JSON at all.",
      },
    });

    await expect(service.generateReview("some diff")).rejects.toThrow(
      "AI generated an invalid JSON response"
    );
  });

  it("should pass the persona prompt to the model", async () => {
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => JSON.stringify({ reviews: [] }),
      },
    });

    const persona = "Review like a pirate";
    await service.generateReview("diff", persona);

    expect(mockGenerateContent).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.stringContaining(persona),
        "diff"
      ])
    );
  });
});
