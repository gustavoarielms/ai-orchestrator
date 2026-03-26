import { HealthService } from "./health.service";
import { MetricsRecorder } from "../../../shared/metrics/ports/metrics-recorder";

describe("HealthService", () => {
  let service: HealthService;
  let metricsRecorder: jest.Mocked<MetricsRecorder>;

  beforeEach(() => {
    metricsRecorder = {
      incrementRequest: jest.fn(),
      incrementError: jest.fn(),
      incrementRetry: jest.fn(),
      incrementFallback: jest.fn(),
      recordLatency: jest.fn(),
      getMetrics: jest.fn().mockReturnValue({
        requests: 10,
        errors: 2,
        retries: 1,
        fallbacks: 0,
        avgLatencyMs: 150,
        errorByCode: {
          openai_timeout: 1
        }
      })
    };

    service = new HealthService(metricsRecorder);
  });

  it("should return basic health", () => {
    expect(service.getBasicHealth()).toEqual({
      status: "ok",
      service: "ai-orchestrator"
    });
  });

  it("should return detailed health", () => {
    const result = service.getDetailedHealth();

    expect(result).toEqual({
      status: "ok",
      service: "ai-orchestrator",
      provider: {
        primary: "openai"
      },
      metrics: {
        requests: 10,
        errors: 2,
        retries: 1,
        fallbacks: 0,
        avgLatencyMs: 150,
        errorByCode: {
          openai_timeout: 1
        }
      }
    });
  });
});
