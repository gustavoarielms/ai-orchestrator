import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { AnalyzeRequest, AnalyzeResponse } from "../../domain/analyze.types";
import { AnalysisProvider } from "../ports/analysis.provider";
import { ANALYSIS_PROVIDER } from "../tokens/analysis-provider.token";
import { Logger } from "../../../../shared/logger/logger";

@Injectable()
export class AnalyzeUseCase {
  constructor(
    @Inject(ANALYSIS_PROVIDER)
    private readonly analysisProvider: AnalysisProvider
  ) {}

  async execute(input: AnalyzeRequest): Promise<AnalyzeResponse> {
    Logger.log("Analyze use case started");

    if (!input?.text || typeof input.text !== "string") {
      Logger.error("Invalid analyze input");
      throw new BadRequestException("Invalid input: 'text' is required");
    }

    const result = await this.analysisProvider.analyze(input);

    Logger.log("Analyze use case completed");

    return result;
  }
}