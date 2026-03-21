import { Inject, Injectable } from "@nestjs/common";
import { AnalysisProvider } from "../../application/ports/analysis.provider";
import { AnalyzeRequest, AnalyzeResponse } from "../../domain/analyze.types";
import { Logger } from "../../../../shared/logger/logger";
import { MetricsRecorder } from "../../../../shared/metrics/ports/metrics-recorder";
import { METRICS_RECORDER } from "../../../../shared/metrics/tokens/metrics-recorder.token";
import { appConfig } from "../../../../config/app.config";

@Injectable()
export class FallbackAnalysisProvider implements AnalysisProvider {
  constructor(
    @Inject("PRIMARY_ANALYSIS_PROVIDER")
    private readonly primaryProvider: AnalysisProvider,
    @Inject("FALLBACK_ANALYSIS_PROVIDER")
    private readonly fallbackProvider: AnalysisProvider,
    @Inject(METRICS_RECORDER)
    private readonly metricsRecorder: MetricsRecorder
  ) {}

  async analyze(input: AnalyzeRequest): Promise<AnalyzeResponse> {
    try {
      return await this.primaryProvider.analyze(input);
    } catch (primaryError: any) {
      if (!appConfig.fallback.enabled) {
        throw primaryError;
      }

      Logger.error("Primary provider failed, attempting fallback", {
        primaryProvider: appConfig.aiProvider,
        fallbackProvider: appConfig.fallback.provider,
        error: primaryError?.message,
        code: primaryError?.response?.code ?? primaryError?.code
      });

      this.metricsRecorder.incrementFallback();

      return await this.fallbackProvider.analyze(input);
    }
  }
}