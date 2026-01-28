/**
 * Retry utility with exponential backoff for network resilience
 */

export interface RetryOptions {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  shouldRetry?: (error: any) => boolean;
  onRetry?: (attempt: number, error: any) => void;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2,
  shouldRetry: (error: any) => {
    // Retry on network errors, timeouts, and 5xx server errors
    if (error?.type === "network_error") return true;
    if (error?.status >= 500 && error?.status < 600) return true;
    if (error?.message?.includes("timeout")) return true;
    if (error?.message?.includes("ECONNREFUSED")) return true;
    return false;
  },
  onRetry: () => {},
};

/**
 * Retry a function with exponential backoff
 * @param fn Function to retry
 * @param options Retry configuration
 * @returns Promise with the result of the function
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: any;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry if we've exhausted attempts
      if (attempt === opts.maxAttempts) {
        throw error;
      }

      // Don't retry if error is not retryable
      if (!opts.shouldRetry(error)) {
        throw error;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        opts.initialDelay * Math.pow(opts.backoffMultiplier, attempt - 1),
        opts.maxDelay
      );

      // Call retry callback
      opts.onRetry(attempt, error);

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Create a retryable version of a function
 * @param fn Function to make retryable
 * @param options Retry configuration
 * @returns Wrapped function with retry logic
 */
export function withRetry<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: RetryOptions = {}
): T {
  return ((...args: Parameters<T>) =>
    retryWithBackoff(() => fn(...args), options)) as T;
}
