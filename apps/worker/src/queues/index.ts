import { Worker } from "bullmq";
import { connection } from "./connection";
import { reviewProcessor } from "../processors/reviewProcessor";
import { logger } from "../utils/logger";

/**
 * Initializes and starts the BullMQ Worker.
 * The worker listens for incoming jobs on the 'review-queue' and delegates them to the reviewProcessor.
 */
export const startWorker = () => {
  const worker = new Worker(
    "review-queue", // The name of the queue to listen to. Must match the producer's queue name.
    async (job) => {
      logger.info(`Processing job ${job.id}`, { name: job.name });
      // Execute the business logic for the job
      return reviewProcessor(job);
    },
    {
      connection,
      // Concurrency determines how many jobs can be processed in parallel by this worker instance.
      concurrency: parseInt(process.env.WORKER_CONCURRENCY || "5", 10),
    },
  );

  /**
   * Event listener triggered when a job is successfully processed.
   */
  worker.on("completed", (job) => {
    logger.info(`Job ${job.id} completed successfully`);
  });

  /**
   * Event listener triggered when a job fails after all retry attempts.
   */
  worker.on("failed", (job, err) => {
    logger.error(`Job ${job?.id} failed after retries`, { error: err.message });
  });

  return worker;
};
