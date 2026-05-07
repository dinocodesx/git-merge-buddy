import "dotenv/config";
import { startWorker } from "./queues";
import { logger } from "./utils/logger";

/**
 * Main entry point for the GitMergeBuddy Worker.
 * Responsible for initializing the worker process and handling graceful shutdowns.
 */
async function main() {
  logger.info("Starting GitMergeBuddy Worker...");

  // Initialize and start the BullMQ worker
  const worker = startWorker();

  /**
   * Handles graceful shutdown by closing the worker connection
   * and ensuring all in-flight jobs are processed or safely paused.
   */
  const gracefulShutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Shutting down gracefully...`);
    await worker.close();
    process.exit(0);
  };

  // Listen for system termination signals
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));

  logger.info("Worker is running and listening for jobs.");
}

// Execute the main function and catch any startup errors
main().catch((error) => {
  logger.error("Worker failed to start", { error });
  process.exit(1);
});
