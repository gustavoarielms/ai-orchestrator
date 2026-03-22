import { InMemoryMetricsService } from "./in-memory-metrics.service";

describe("InMemoryMetricsService", () => {
  let service: InMemoryMetricsService;

  beforeEach(() => {
    service = new InMemoryMetricsService();
  });

  it("should start with zeroed metrics", () => {
    expect(service.getMetrics()).toEqual({
      requests: 0,
      errors: 0,
      retries: 0,
      fallbacks: 0,
      avgLatencyMs: 0,
      errorByCode: {}
    });
  });

  it("should increment request, retry and fallback counters", () => {
    service.incrementRequest();
    service.incrementRetry();
    service.incrementFallback();

    expect(service.getMetrics()).toEqual({
      requests: 1,
      errors: 0,
      retries: 1,
      fallbacks: 1,
      avgLatencyMs: 0,
      errorByCode: {}
    });
  });

  it("should accumulate errorByCode and total errors", () => {
    service.incrementError("openai_timeout");
    service.incrementError("openai_timeout");
    service.incrementError("provider_circuit_open");

    expect(service.getMetrics()).toEqual({
      requests: 0,
      errors: 3,
      retries: 0,
      fallbacks: 0,
      avgLatencyMs: 0,
      errorByCode: {
        openai_timeout: 2,
        provider_circuit_open: 1
      }
    });
  });

  it("should use unknown_error by default", () => {
    service.incrementError();

    expect(service.getMetrics()).toEqual({
      requests: 0,
      errors: 1,
      retries: 0,
      fallbacks: 0,
      avgLatencyMs: 0,
      errorByCode: {
        unknown_error: 1
      }
    });
  });

  it("should calculate average latency", () => {
    service.recordLatency(100);
    service.recordLatency(200);
    service.recordLatency(300);

    expect(service.getMetrics().avgLatencyMs).toBe(200);
  });
});