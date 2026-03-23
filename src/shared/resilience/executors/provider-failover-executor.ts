import { Inject, Injectable, ServiceUnavailableException } from "@nestjs/common";
import { Logger } from "../../logger/logger";
import { MetricsRecorder } from "../../metrics/ports/metrics-recorder";
import { METRICS_RECORDER } from "../../metrics/tokens/metrics-recorder.token";
import { CircuitBreaker } from "../ports/circuit-breaker";
import { CIRCUIT_BREAKER } from "../tokens/circuit-breaker.token";
import { ExecuteWithFailoverParams } from "./provider-failover-executor.types";

@Injectable()
export class ProviderFailoverExecutor {
  constructor(
    @Inject(METRICS_RECORDER)
    private readonly metricsRecorder: MetricsRecorder,
    @Inject(CIRCUIT_BREAKER)
    private readonly circuitBreaker: CircuitBreaker
  ) {}

  async execute<T>({
    primaryProviderName,
    fallbackProviderName,
    fallbackEnabled,
    executePrimary,
    executeFallback
  }: ExecuteWithFailoverParams<T>): Promise<T> {
    this.assertCircuitAllowsExecution(primaryProviderName);

    try {
      const result = await executePrimary();
      this.circuitBreaker.recordSuccess(primaryProviderName);
      return result;
    } catch (primaryError: any) {
      this.circuitBreaker.recordFailure(primaryProviderName);

      if (!fallbackEnabled) {
        throw primaryError;
      }

      Logger.error("Primary provider failed, attempting fallback", {
        primaryProvider: primaryProviderName,
        fallbackProvider: fallbackProviderName,
        error: primaryError?.message,
        code: primaryError?.response?.code ?? primaryError?.code
      });

      this.assertCircuitAllowsExecution(fallbackProviderName);
      this.metricsRecorder.incrementFallback();

      try {
        const result = await executeFallback();
        this.circuitBreaker.recordSuccess(fallbackProviderName);
        return result;
      } catch (fallbackError) {
        this.circuitBreaker.recordFailure(fallbackProviderName);
        throw fallbackError;
      }
    }
  }

  private assertCircuitAllowsExecution(provider: string): void {
    if (this.circuitBreaker.canExecute(provider)) {
      return;
    }

    Logger.error("Circuit breaker is open for provider", {
      provider,
      state: this.circuitBreaker.getState(provider)
    });

    throw new ServiceUnavailableException({
      statusCode: 503,
      message: `Provider ${provider} is temporarily unavailable.`,
      code: "provider_circuit_open"
    });
  }
}