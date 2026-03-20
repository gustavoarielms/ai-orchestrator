export class MetricsService {
  private static requestCount = 0;
  private static errorCount = 0;
  private static retryCount = 0;
  private static totalLatencyMs = 0;
  private static latencySamples = 0;
  private static errorByCode: Record<string, number> = {};

  static incrementRequest() {
    this.requestCount++;
  }

  static incrementError(code = "unknown_error") {
    this.errorCount++;
    this.errorByCode[code] = (this.errorByCode[code] ?? 0) + 1;
  }

  static incrementRetry() {
    this.retryCount++;
  }

  static recordLatency(durationMs: number) {
    this.totalLatencyMs += durationMs;
    this.latencySamples++;
  }

  static getMetrics() {
    return {
      requests: this.requestCount,
      errors: this.errorCount,
      retries: this.retryCount,
      avgLatencyMs:
        this.latencySamples > 0
          ? Number((this.totalLatencyMs / this.latencySamples).toFixed(2))
          : 0,
      errorByCode: this.errorByCode
    };
  }
}