import IORedis from "ioredis";

/**
 * Singleton Redis connection for BullMQ.
 * All worker and queue instances share this connection to optimize resource usage.
 *
 * Note: BullMQ requires 'maxRetriesPerRequest' to be set to 'null' to function correctly
 * as it manages its own retry logic.
 */
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export const connection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null, // Required by BullMQ to avoid connection errors during long-running tasks
});
