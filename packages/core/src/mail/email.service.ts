import "dotenv/config";
import { Resend } from "resend";

/**
 * Service for sending transactional emails via Resend.
 */
export class EmailService {
  private resend: Resend;

  /**
   * Initializes the email service.
   * @param apiKey - The Resend API key. Defaults to RESEND_API_KEY from environment.
   */
  constructor(apiKey: string = process.env.RESEND_API_KEY!) {
    if (!apiKey) {
      throw new Error("Resend API key is required. Set RESEND_API_KEY in .env or pass it to the constructor.");
    }
    this.resend = new Resend(apiKey);
  }

  /**
   * Notifies a user that an AI review has failed for a specific PR.
   * 
   * @param to - Recipient email address.
   * @param repoName - Full name of the repository.
   * @param prNumber - Pull request number.
   */
  async sendFailureNotification(to: string, repoName: string, prNumber: number): Promise<void> {
    await this.resend.emails.send({
      from: "AI Reviewer <noreply@gitmergebuddy.com>",
      to,
      subject: `Review Failed: ${repoName} PR #${prNumber}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
          <h2>Review Failed</h2>
          <p>Hello,</p>
          <p>The AI review for your pull request <strong>${repoName} #${prNumber}</strong> has failed.</p>
          <p>This could be due to a malformed diff, rate limits, or an internal AI error.</p>
          <p>Please check the worker logs or try triggering the review again by pushing a new commit.</p>
          <hr />
          <p style="font-size: 0.8em; color: #666;">This is an automated notification from Git Merge Buddy.</p>
        </div>
      `,
    });
  }
}
