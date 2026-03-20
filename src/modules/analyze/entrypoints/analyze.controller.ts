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
    MetricsService.incrementRequest();

    Logger.log("Analyze request received", {
      input: body.text
    });

    const result = await this.analyzeUseCase.execute(body);

    Logger.log("Analyze request completed");

    return result;
  }
}