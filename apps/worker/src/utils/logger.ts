/**
 * Centralized logging utility for the worker.
 * Provides a consistent interface for logging information, warnings, and errors.
 *
 * In a production environment, this could be easily swapped or extended
 * to send logs to external services like Winston, Pino, or Datadog.
 */
export const logger = {
  /**
   * Logs general informational messages.
   */
  info: (message: string, meta?: any) => {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`, meta || "");
  },

  /**
   * Logs error messages, including stack traces or failure metadata.
   */
  error: (message: string, meta?: any) => {
    console.error(
      `[ERROR] ${new Date().toISOString()}: ${message}`,
      meta || "",
    );
  },

  /**
   * Logs warning messages for non-fatal issues.
   */
  warn: (message: string, meta?: any) => {
    console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, meta || "");
  },

  /**
   * Logs detailed debugging information.
   * Only active if the DEBUG environment variable is set.
   */
  debug: (message: string, meta?: any) => {
    if (process.env.DEBUG) {
      console.debug(
        `[DEBUG] ${new Date().toISOString()}: ${message}`,
        meta || "",
      );
    }
  },
};
