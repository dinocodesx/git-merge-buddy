import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ReviewResponse } from "../types";

/**
 * Service for interacting with Google's Gemini AI model to perform code reviews.
 */
export class GeminiService {
  private genAI: GoogleGenerativeAI;

  /**
   * Initializes the Gemini AI service.
   * @param apiKey - The Google AI API key. Defaults to GEMINI_API_KEY from environment.
   */
  constructor(apiKey: string = process.env.GEMINI_API_KEY!) {
    if (!apiKey) {
      throw new Error("Gemini API key is required. Set GEMINI_API_KEY in .env or pass it to the constructor.");
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  /**
   * Generates a structured code review based on a Git diff.
   * 
   * Uses the `gemini-1.5-flash` model for fast, cost-effective analysis.
   * The output is strictly enforced as JSON to allow automated posting of comments back to GitHub.
   * 
   * @param diff - The standard Git diff string to analyze.
   * @param personaPrompt - Optional custom instructions to guide the AI's review style (e.g., "be extremely critical of security").
   * @returns A ReviewResponse containing an array of specific file/line comments.
   * @throws Error if the AI response cannot be parsed or is in an invalid format.
   */
  async generateReview(diff: string, personaPrompt: string = ""): Promise<ReviewResponse> {
    const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemInstruction = `
      You are an expert code reviewer. Review the following code diff.
      ${personaPrompt ? `Follow this specific persona/rules: ${personaPrompt}` : ""}
      
      Output MUST be a valid JSON object with a single key "reviews" which is an array of objects.
      Each object must have: "file" (string), "line" (number), and "comment" (string).
      Do not include any markdown formatting or text outside the JSON.
    `;

    const result = await model.generateContent([systemInstruction, diff]);
    const response = await result.response;
    const text = response.text();

    try {
      // Basic sanitization in case Gemini wraps in ```json ... ``` despite instructions
      const jsonStr = text.replace(/```json|```/g, "").trim();
      return JSON.parse(jsonStr) as ReviewResponse;
    } catch (error) {
      console.error("Failed to parse Gemini response:", text);
      throw new Error("Invalid AI response format");
    }
  }
}
