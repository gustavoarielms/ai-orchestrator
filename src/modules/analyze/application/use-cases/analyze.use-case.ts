import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { AnalyzeRequest, AnalyzeResponse } from "../../domain/analyze.types";
import { AnalysisProvider } from "../ports/analysis.provider";
import { ANALYSIS_PROVIDER } from "../tokens/analysis-provider.token";
import { Logger } from "../../../../shared/logger/logger";
import { MetricsRecorder } from "../../../../shared/metrics/ports/metrics-recorder";
import { METRICS_RECORDER } from "../../../../shared/metrics/tokens/metrics-recorder.token";

@Injectable()
export class AnalyzeUseCase {
  constructor(
    @Inject(ANALYSIS_PROVIDER)
    private readonly analysisProvider: AnalysisProvider,
    @Inject(METRICS_RECORDER)
    private readonly metricsRecorder: MetricsRecorder
  ) {}

  async execute(input: AnalyzeRequest): Promise<AnalyzeResponse> {
    Logger.log("Analyze use case started");

    if (!input?.text || typeof input.text !== "string") {
      Logger.error("Invalid analyze input");
      throw new BadRequestException("Invalid input: 'text' is required");
    }

    try {
      const result = await this.analysisProvider.analyze(input);
      return result;
    } catch (error: any) {
      const errorCode = error?.response?.code ?? error?.code ?? "unknown_error";

      this.metricsRecorder.incrementError(errorCode);

      Logger.error("Analyze use case failed", {
        error: error?.message,
        status: error?.status,
        code: errorCode
      });

      throw error;
    }
  }
}