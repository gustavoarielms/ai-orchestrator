import { Body, Controller, Post } from "@nestjs/common";
import { AnalyzeUseCase } from "../application/use-cases/analyze.use-case";
import { AnalyzeRequest } from "../domain/analyze.types";
import { Logger } from "../../../shared/logger/logger";
import { MetricsService } from "../../../shared/metrics/metrics.service";

@Controller("/analyze")
export class AnalyzeController {
  constructor(private readonly analyzeUseCase: AnalyzeUseCase) {}

  @Post()
  async analyze(@Body() body: AnalyzeRequest) {
    const startedAt = Date.now();

    MetricsService.incrementRequest();

    Logger.log("Analyze request received", {
      input: body.text
    });

    try {
      const result = await this.analyzeUseCase.execute(body);

      const durationMs = Date.now() - startedAt;
      MetricsService.recordLatency(durationMs);

      Logger.log("Analyze request completed", {
        durationMs
      });

      return result;
    } catch (error) {
      const durationMs = Date.now() - startedAt;
      MetricsService.recordLatency(durationMs);

      Logger.error("Analyze request failed", {
        durationMs
      });

      throw error;
    }
  }
}