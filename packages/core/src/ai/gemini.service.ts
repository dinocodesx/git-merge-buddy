import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ReviewResponse } from "../types";

/**
 * Service for interacting with Google's Gemini AI model to perform code reviews.
 */
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private modelName: string;

  /**
   * Initializes the Gemini AI service.
   * @param options - Configuration options.
   */
  constructor(options?: { apiKey?: string; model?: string }) {
    const apiKey = options?.apiKey ?? process.env.GEMINI_API_KEY!;
    if (!apiKey) {
      throw new Error("Gemini API key is required. Set GEMINI_API_KEY in .env or pass it to the constructor.");
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.modelName = options?.model ?? "gemini-1.5-flash";
  }

  /**
   * Generates a structured code review based on a Git diff.
   * 
   * Uses a fast, cost-effective model for analysis by default.
   * The output is strictly enforced as JSON to allow automated posting of comments back to GitHub.
   */
  async generateReview(diff: string, personaPrompt: string = ""): Promise<ReviewResponse> {
    const model = this.genAI.getGenerativeModel({ model: this.modelName });

    const systemInstruction = `
      You are an expert code reviewer. Your goal is to provide high-quality, concise, and actionable feedback.
      Review the following Git diff and identify bugs, security vulnerabilities, performance bottlenecks, or significant stylistic issues.
      
      ${personaPrompt ? `Follow these specific persona guidelines:\n${personaPrompt}\n` : ""}
      
      CRITICAL RULES:
      - Return ONLY a valid JSON object. No prose, no conversational text.
      - If you find no issues, return { "reviews": [] }.
      - Each review object must contain:
        "file": (string) The relative file path.
        "line": (number) The specific line number in the NEW version of the file.
        "comment": (string) Clear feedback in Markdown format.
      
      RESPONSE SCHEMA:
      {
        "reviews": [
          { "file": "src/index.ts", "line": 42, "comment": "Found a potential null pointer here..." }
        ]
      }
    `;

    const result = await model.generateContent([systemInstruction, diff]);
    const response = await result.response;
    const text = response.text();

    try {
      // Robust JSON extraction (handles markdown blocks if AI includes them)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : text;
      
      return JSON.parse(jsonStr) as ReviewResponse;
    } catch (error) {
      console.error("Failed to parse Gemini response. Raw output:", text);
      throw new Error(`AI generated an invalid JSON response. Please check the logs.`);
    }
  }
}
