# Technical Specification: AI PR Review SaaS (Development Perspective)

## 1. System Architecture Overview

The system is designed as a **decoupled, event-driven Monorepo**. This ensures that the user-facing web application (Next.js) remains fast and responsive, while the resource-intensive AI processing (Worker) runs in an isolated environment.

### 1.1 High-Level Logic Flow
1. **Trigger:** User pushes code to GitHub.
2. **Ingress:** `apps/web` receives a Webhook, validates it, and pushes to Redis.
3. **Queue:** BullMQ manages the job lifecycle (retries, concurrency).
4. **Execution:** `apps/worker` consumes the job, interacts with `packages/core` to talk to Gemini and GitHub.
5. **Persistence:** `packages/database` tracks the review status and user credits.

---

## 2. Monorepo Structure & File Logic

### 2.1 `apps/web` (Frontend & API Gateway)
This is the entry point for both users and GitHub.

*   **`app/api/webhooks/github/route.ts`**
    *   *Logic:* Verifies `x-hub-signature-256` using the `GITHUB_WEBHOOK_SECRET`.
    *   *Logic:* Filters for `pull_request` actions (`opened`, `synchronize`).
    *   *Logic:* Queries `packages/database` to ensure the repository is "Active" and the user has "Credits/Subscription".
    *   *Logic:* Enqueues a job into BullMQ with `installationId`, `repository`, and `pullRequestNumber`.
*   **`app/(dashboard)/repos/page.tsx`**
    *   *Logic:* Lists all repositories the user has granted the GitHub App access to.
    *   *Logic:* Provides "Enable/Disable" toggles which update the `Repository` table in the DB.
*   **`middleware.ts`**
    *   *Logic:* Protects dashboard routes using NextAuth session checks.

### 2.2 `apps/worker` (The Heavy Lifter)
A standalone Node.js process designed for high-memory AI operations.

*   **`src/index.ts`**
    *   *Logic:* Initializes the BullMQ `Worker` instance.
    *   *Logic:* Handles graceful shutdown (`SIGTERM`) to ensure no jobs are lost mid-process.
*   **`src/processors/reviewProcessor.ts`**
    *   *Logic:* The main state machine for a single review.
    *   *Step 1:* Auth as GitHub App -> Get Installation Token.
    *   *Step 2:* Call `core/github/getDiff()` to get the PR changes.
    *   *Step 3:* Call `core/ai/generateReview()` with the diff.
    *   *Step 4:* Call `core/github/postComments()` with Gemini's response.
*   **`src/queues/connection.ts`**
    *   *Logic:* Manages the IORedis connection shared across the worker.

### 2.3 `packages/core` (Shared Business Logic)
Internal library used by both the Web App and the Worker.

*   **`src/ai/gemini.service.ts`**
    *   *Logic:* Configures `GoogleGenerativeAI`.
    *   *Logic:* Implements a `systemInstruction` that forces Gemini to return JSON only.
    *   *Code:*
        ```typescript
        const prompt = `Review this diff. Return JSON: { reviews: [{ file: string, line: number, comment: string }] }`;
        ```
*   **`src/github/octokit.service.ts`**
    *   *Logic:* Wraps `@octokit/rest` and `@octokit/auth-app`.
    *   *Logic:* Handles fetching the `.ai-reviewer.md` config from the target repo to pass to the AI.
*   **`src/utils/diffParser.ts`**
    *   *Logic:* Truncates extremely large diffs that might exceed token limits, prioritizing changed lines over context lines.

### 2.4 `packages/database` (Data Layer)
*   **`prisma/schema.prisma`**
    *   `User`: (id, email, stripeCustomerId)
    *   `Repository`: (id, githubId, name, isActive, personaPrompt)
    *   `Review`: (id, repoId, status, tokensUsed, commitSha)
*   **`src/client.ts`**
    *   *Logic:* Exports a singleton PrismaClient to prevent "too many connections" in serverless environments.

---

## 3. Data Flow Diagram (Logic Sequence)

```text
[GitHub] --(Webhook)--> [apps/web]
                           |
                    (Validate HMAC)
                           |
                    [Redis / BullMQ] <---- (Store Job)
                           |
              (Worker picks up job)
                           |
                    [apps/worker]
                    /      |      \
        (Get Diff)  (Consult DB)  (Get Custom Persona)
             |             |               |
             +-------------+---------------+
                           |
                  [packages/core/AI] --(Diff + Rules)--> [Google Gemini]
                                                               |
              (Post Review) <--- (Parsed JSON Feedback) <------+
                    |
              [GitHub API]
```

---

## 4. Key Implementation Logic (File-by-File)

### 4.1 The Webhook Ingestor (`apps/web/api/webhook`)
```typescript
// Pseudocode for high-level logic
export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get("x-hub-signature-256");
  
  if (!verifySignature(payload, signature)) return Error(401);

  const event = JSON.parse(payload);
  if (event.action === "opened" || event.action === "synchronize") {
    await reviewQueue.add("process-review", {
      repoId: event.repository.id,
      prNumber: event.number,
      installationId: event.installation.id
    });
  }
  return Response.json({ received: true });
}
```

### 4.2 The Review Logic (`packages/core/ai`)
The prompt engineering is the "Secret Sauce".
*   **Input:** System Prompt + Repo Rules + PR Diff.
*   **Constraint:** "Output MUST be a valid JSON array of objects. Do not include markdown formatting outside the JSON."
*   **Context Injection:** Before sending to Gemini, we search the repo for `package.json` to tell Gemini the project type (e.g., "This is a Next.js project using Tailwind").

### 4.3 The Worker Persistence (`apps/worker`)
The worker needs to be robust.
*   **Logic:** It logs the start of a review in the `Review` table with status `PENDING`.
*   **Logic:** On success, it updates to `COMPLETED` and records `tokensUsed`.
*   **Logic:** On error, it updates to `FAILED` and notifies the user via email (`packages/core/mail`).

---

## 5. Local Development POV

### 5.1 Prerequisites
*   **Docker:** For running Redis and PostgreSQL locally.
*   **Ngrok/Cloudflared:** To tunnel GitHub webhooks to your local `localhost:3000`.
*   **GitHub App:** A "Dev" version of your GitHub app pointed at your tunnel URL.

### 5.2 Commands
*   `npx turbo dev`: Starts both the Next.js app and the Worker simultaneously.
*   `npx prisma studio`: To visualize the local database.

### 5.3 Environment Variables (`.env`)
*   `DATABASE_URL`: Local Postgres.
*   `REDIS_URL`: Local Redis.
*   `GEMINI_API_KEY`: Your Google AI key.
*   `GITHUB_APP_PRIVATE_KEY`: For authenticating as the app.

---

## 6. Logic for Handling Edge Cases

### 6.1 Massive Diffs
*   **Logic:** If a diff is > 50,000 characters, we split the review into multiple calls to Gemini (one per file) or use the "Deep Context" approach where we only send the 10 most "impactful" files determined by a pre-processing pass.

### 6.2 Concurrent Webhooks
*   **Logic:** GitHub often sends multiple webhooks (e.g., `labeled` and `synchronize` at the same time).
*   **Logic:** We use a **Job Deduplication Key** in BullMQ: `pr-${repoId}-${prNumber}-${commitSha}`. This ensures we don't review the exact same commit twice if webhooks double up.

### 6.3 Rate Limiting
*   **Logic:** The worker checks the remaining GitHub API rate limit in the headers of every response.
*   **Logic:** If remaining < 100, the worker pauses its queue for 5 minutes.

---

## 7. Scaling Logic
*   **Horizontal Scaling:** Since the Worker is stateless (logic-wise), you can spin up 10 instances of `apps/worker` connecting to the same Redis to process 10x the PRs.
*   **Database Partitioning:** As the `Review` table grows to millions of rows, we plan to partition it by `createdAt` (monthly).
