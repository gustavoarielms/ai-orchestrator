import { Inject, Injectable } from "@nestjs/common";
import { appConfig } from "../../../config/app.config";
import { MetricsRecorder } from "../../../shared/metrics/ports/metrics-recorder";
import { METRICS_RECORDER } from "../../../shared/metrics/tokens/metrics-recorder.token";
import { CircuitBreaker } from "../../../shared/resilience/ports/circuit-breaker";
import { CIRCUIT_BREAKER } from "../../../shared/resilience/tokens/circuit-breaker.token";

@Injectable()
export class HealthService {
  constructor(
    @Inject(METRICS_RECORDER)
    private readonly metricsRecorder: MetricsRecorder,
    @Inject(CIRCUIT_BREAKER)
    private readonly circuitBreaker: CircuitBreaker
  ) {}

  getBasicHealth() {
    return {
      status: "ok",
      service: "ai-orchestrator"
    };
  }

  getDetailedHealth() {
    const circuits = this.circuitBreaker.getAllStates();
    const metrics = this.metricsRecorder.getMetrics();

    const hasOpenCircuit = circuits.some((circuit) => circuit.state === "open");

    return {
      status: hasOpenCircuit ? "degraded" : "ok",
      service: "ai-orchestrator",
      provider: {
        primary: appConfig.aiProvider,
        fallbackEnabled: appConfig.fallback.enabled,
        fallback: appConfig.fallback.provider
      },
      circuits,
      metrics
    };
  }
}