import { Injectable } from "@nestjs/common";
import { MetricsRecorder, MetricsSnapshot } from "../ports/metrics-recorder";

@Injectable()
export class InMemoryMetricsService implements MetricsRecorder {
  private requestCount = 0;
  private errorCount = 0;
  private retryCount = 0;
  private fallbackCount = 0;
  private totalLatencyMs = 0;
  private latencySamples = 0;
  private errorByCode: Record<string, number> = {};

  incrementRequest(): void {
    this.requestCount++;
  }

  incrementError(code = "unknown_error"): void {
    this.errorCount++;
    this.errorByCode[code] = (this.errorByCode[code] ?? 0) + 1;
  }

  incrementRetry(): void {
    this.retryCount++;
  }

  incrementFallback(): void {
    this.fallbackCount++;
  }

  recordLatency(durationMs: number): void {
    this.totalLatencyMs += durationMs;
    this.latencySamples++;
  }

  getMetrics(): MetricsSnapshot {
    return {
      requests: this.requestCount,
      errors: this.errorCount,
      retries: this.retryCount,
      fallbacks: this.fallbackCount,
      avgLatencyMs:
        this.latencySamples > 0
          ? Number((this.totalLatencyMs / this.latencySamples).toFixed(2))
          : 0,
      errorByCode: this.errorByCode
    };
  }
}