export interface MetricsSnapshot {
  requests: number;
  errors: number;
  retries: number;
  fallbacks: number;
  avgLatencyMs: number;
  errorByCode: Record<string, number>;
}

export interface MetricsRecorder {
  incrementRequest(): void;
  incrementError(code?: string): void;
  incrementRetry(): void;
  incrementFallback(): void;
  recordLatency(durationMs: number): void;
  getMetrics(): MetricsSnapshot;
}