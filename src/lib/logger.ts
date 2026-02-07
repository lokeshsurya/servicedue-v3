/**
 * Centralized logging utility
 * Removes console.logs in production automatically
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private isDevelopment = import.meta.env.DEV;

  /**
   * Debug logs - only shown in development
   */
  debug(message: string, ...args: any[]) {
    if (this.isDevelopment) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }

  /**
   * Info logs - only shown in development
   */
  info(message: string, ...args: any[]) {
    if (this.isDevelopment) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  /**
   * Warning logs - shown in all environments
   */
  warn(message: string, ...args: any[]) {
    console.warn(`[WARN] ${message}`, ...args);
  }

  /**
   * Error logs - shown in all environments
   * In production, this should be sent to error tracking service (Sentry)
   */
  error(message: string, error?: any, ...args: any[]) {
    console.error(`[ERROR] ${message}`, error, ...args);
    
    // TODO: Send to error tracking service in production
    if (!this.isDevelopment && import.meta.env.VITE_ENABLE_ERROR_TRACKING === 'true') {
      // Send to Sentry or similar service
      this.sendToErrorTracking(message, error);
    }
  }

  /**
   * Log API calls - useful for debugging
   */
  api(method: string, endpoint: string, data?: any) {
    if (this.isDevelopment) {
      console.log(`[API] ${method} ${endpoint}`, data);
    }
  }

  private sendToErrorTracking(message: string, error: any) {
    // TODO: Implement error tracking integration
    // Example: Sentry.captureException(error, { extra: { message } });
  }
}

export const logger = new Logger();
export default logger;
