export interface RetryOptions {
  maxAttempts: number;
  delay: number;
  backoffMultiplier?: number;
  maxDelay?: number;
}

export const retry = async <T>(
  fn: () => Promise<T>,
  options: RetryOptions = {
    maxAttempts: 3,
    delay: 1000,
    backoffMultiplier: 2,
    maxDelay: 10000
  }
): Promise<T> => {
  let lastError: Error;
  let delay = options.delay;

  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === options.maxAttempts) {
        throw lastError;
      }

      // 지수 백오프 적용
      await new Promise(resolve => setTimeout(resolve, delay));
      delay = Math.min(
        delay * (options.backoffMultiplier || 2),
        options.maxDelay || 10000
      );
    }
  }

  throw lastError!;
};
