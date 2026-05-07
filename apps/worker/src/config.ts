import { z } from "zod";

/**
 * Zod schema for environment variable validation.
 * Ensures all required service keys and configuration options are present.
 */
const configSchema = z.object({
  // Environment type (development, production, etc.)
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  // Connection string for the Redis instance used by BullMQ
  REDIS_URL: z.string().url().default("redis://localhost:6379"),

  // Database connection string for Prisma
  DATABASE_URL: z.string().url(),

  // API key for Google Gemini AI services
  GEMINI_API_KEY: z.string().min(1),

  // GitHub App credentials
  GITHUB_APP_ID: z.string().min(1),
  GITHUB_APP_PRIVATE_KEY: z.string().min(1),
  GITHUB_WEBHOOK_SECRET: z.string().min(1),

  // Number of concurrent jobs the worker can process
  WORKER_CONCURRENCY: z.string().transform(Number).default("5"),
});

/**
 * Validates and exports the environment configuration.
 * Throws a descriptive error if required environment variables are missing or invalid.
 */
export const config = configSchema.parse(process.env);
