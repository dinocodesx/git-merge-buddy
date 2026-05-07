import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@repo/database";

/**
 * Shared Better Auth configuration for the entire application.
 * 
 * This instance is used to manage:
 * 1. Database persistence via the Prisma adapter.
 * 2. OAuth social providers (GitHub and Google).
 * 3. Session management across apps/client and apps/web.
 * 
 * Note: Ensure environment variables for CLIENT_ID and CLIENT_SECRET are correctly set
 * in the application using this service.
 */
export const auth = betterAuth({
  /** Uses the shared Prisma instance from @repo/database */
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  /** Social Login Providers */
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});
