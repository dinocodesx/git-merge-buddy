import { describe, it, expect, vi, beforeEach } from "vitest";
import { GeminiService } from "../ai/gemini.service";

/**
 * Tests for the GeminiService.
 * Mocks the Google Generative AI SDK to verify review generation logic
 * without making actual API calls.
 */

vi.mock("@google/generative-ai", () => {
  return {
    GoogleGenerativeAI: class {
      constructor() {}
      getGenerativeModel() {
        return {
          generateContent: vi.fn().mockResolvedValue({
            response: {
              text: () =>
                JSON.stringify({
                  reviews: [
                    { file: "test.ts", line: 10, comment: "Nice work" },
                  ],
                }),
            },
          }),
        };
      }
    },
  };
});

describe("GeminiService", () => {
  let service: GeminiService;

  beforeEach(() => {
    service = new GeminiService({ apiKey: "fake-api-key" });
  });

  it("should generate a review from a diff", async () => {
    const result = await service.generateReview("some diff");
    expect(result.reviews).toHaveLength(1);
    expect(result.reviews[0]?.comment).toBe("Nice work");
  });
});
