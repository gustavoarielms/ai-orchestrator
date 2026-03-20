export class MetricsService {
  private static requestCount = 0;
  private static errorCount = 0;
  private static retryCount = 0;

  static incrementRequest() {
    this.requestCount++;
  }

  static incrementError() {
    this.errorCount++;
  }

  static incrementRetry() {
    this.retryCount++;
  }

  static getMetrics() {
    return {
      requests: this.requestCount,
      errors: this.errorCount,
      retries: this.retryCount
    };
  }
}