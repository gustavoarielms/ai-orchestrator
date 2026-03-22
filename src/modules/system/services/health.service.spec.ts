jest.mock("../../../config/app.config", () => ({
  appConfig: {
    aiProvider: "openai",
    fallback: {
      enabled: true,
      provider: "claude"
    }
  }
}));

import { HealthService } from "./health.service";
import { MetricsRecorder } from "../../../shared/metrics/ports/metrics-recorder";
import { CircuitBreaker } from "../../../shared/resilience/ports/circuit-breaker";

describe("HealthService", () => {
  let service: HealthService;
  let metricsRecorder: jest.Mocked<MetricsRecorder>;
  let circuitBreaker: jest.Mocked<CircuitBreaker>;

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
        fallbacks: 1,
        avgLatencyMs: 150,
        errorByCode: {
          openai_timeout: 1,
          provider_circuit_open: 1
        }
      })
    };

    circuitBreaker = {
      canExecute: jest.fn(),
      recordSuccess: jest.fn(),
      recordFailure: jest.fn(),
      getState: jest.fn(),
      getAllStates: jest.fn().mockReturnValue([
        {
          provider: "openai",
          state: "closed",
          failureCount: 0,
          openedAt: null
        },
        {
          provider: "claude",
          state: "closed",
          failureCount: 0,
          openedAt: null
        }
      ])
    };

    service = new HealthService(metricsRecorder, circuitBreaker);
  });

  it("should return basic health", () => {
    expect(service.getBasicHealth()).toEqual({
      status: "ok",
      service: "ai-orchestrator"
    });
  });

  it("should return ok detailed health when all circuits are closed", () => {
    const result = service.getDetailedHealth();

    expect(result).toEqual({
      status: "ok",
      service: "ai-orchestrator",
      provider: {
        primary: "openai",
        fallbackEnabled: true,
        fallback: "claude"
      },
      circuits: [
        {
          provider: "openai",
          state: "closed",
          failureCount: 0,
          openedAt: null
        },
        {
          provider: "claude",
          state: "closed",
          failureCount: 0,
          openedAt: null
        }
      ],
      metrics: {
        requests: 10,
        errors: 2,
        retries: 1,
        fallbacks: 1,
        avgLatencyMs: 150,
        errorByCode: {
          openai_timeout: 1,
          provider_circuit_open: 1
        }
      }
    });
  });

  it("should return degraded detailed health if at least one circuit is open", () => {
    circuitBreaker.getAllStates.mockReturnValue([
      {
        provider: "openai",
        state: "open",
        failureCount: 3,
        openedAt: Date.now()
      }
    ]);

    const result = service.getDetailedHealth();

    expect(result.status).toBe("degraded");
    expect(result.circuits).toEqual([
      {
        provider: "openai",
        state: "open",
        failureCount: 3,
        openedAt: expect.any(Number)
      }
    ]);
  });
});