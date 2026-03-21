import {
  Inject,
  Injectable,
  ServiceUnavailableException
} from "@nestjs/common";
import { AnalysisProvider } from "../../application/ports/analysis.provider";
import { AnalyzeRequest, AnalyzeResponse } from "../../domain/analyze.types";
import { Logger } from "../../../../shared/logger/logger";
import { MetricsRecorder } from "../../../../shared/metrics/ports/metrics-recorder";
import { METRICS_RECORDER } from "../../../../shared/metrics/tokens/metrics-recorder.token";
import { appConfig } from "../../../../config/app.config";
import { CircuitBreaker } from "../../../../shared/resilience/ports/circuit-breaker";
import { CIRCUIT_BREAKER } from "../../../../shared/resilience/tokens/circuit-breaker.token";

@Injectable()
export class FallbackAnalysisProvider implements AnalysisProvider {
  constructor(
    @Inject("PRIMARY_ANALYSIS_PROVIDER")
    private readonly primaryProvider: AnalysisProvider,
    @Inject("FALLBACK_ANALYSIS_PROVIDER")
    private readonly fallbackProvider: AnalysisProvider,
    @Inject(METRICS_RECORDER)
    private readonly metricsRecorder: MetricsRecorder,
    @Inject(CIRCUIT_BREAKER)
    private readonly circuitBreaker: CircuitBreaker
  ) {}

  async analyze(input: AnalyzeRequest): Promise<AnalyzeResponse> {
    const primaryProviderName = appConfig.aiProvider;
    const fallbackProviderName = appConfig.fallback.provider;

    try {
      this.assertCircuitAllowsExecution(primaryProviderName);
      const result = await this.primaryProvider.analyze(input);
      this.circuitBreaker.recordSuccess(primaryProviderName);
      return result;
    } catch (primaryError: any) {
      this.circuitBreaker.recordFailure(primaryProviderName);

      if (!appConfig.fallback.enabled) {
        throw primaryError;
      }

      Logger.error("Primary provider failed, attempting fallback", {
        primaryProvider: primaryProviderName,
        fallbackProvider: fallbackProviderName,
        error: primaryError?.message,
        code: primaryError?.response?.code ?? primaryError?.code
      });

      this.metricsRecorder.incrementFallback();

      this.assertCircuitAllowsExecution(fallbackProviderName);

      try {
        const result = await this.fallbackProvider.analyze(input);
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