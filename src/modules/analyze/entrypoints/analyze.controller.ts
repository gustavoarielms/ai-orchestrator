import { Body, Controller, Inject, Post } from "@nestjs/common";
import { AnalyzeUseCase } from "../application/use-cases/analyze.use-case";
import { AnalyzeRequest } from "../domain/analyze.types";
import { Logger } from "../../../shared/logger/logger";
import { MetricsRecorder } from "../../../shared/metrics/ports/metrics-recorder";
import { METRICS_RECORDER } from "../../../shared/metrics/tokens/metrics-recorder.token";

@Controller("/analyze")
export class AnalyzeController {
  constructor(
    private readonly analyzeUseCase: AnalyzeUseCase,
    @Inject(METRICS_RECORDER)
    private readonly metricsRecorder: MetricsRecorder
  ) {}

  @Post()
  async analyze(@Body() body: AnalyzeRequest) {
    const startedAt = Date.now();

    this.metricsRecorder.incrementRequest();

    Logger.log("Analyze request received", {
      input: body?.text
    });

    try {
      const result = await this.analyzeUseCase.execute(body);

      const durationMs = Date.now() - startedAt;
      this.metricsRecorder.recordLatency(durationMs);

      Logger.log("Analyze request completed", {
        durationMs
      });

      return result;
    } catch (error) {
      const durationMs = Date.now() - startedAt;
      this.metricsRecorder.recordLatency(durationMs);

      Logger.error("Analyze request failed", {
        durationMs
      });

      throw error;
    }
  }
}