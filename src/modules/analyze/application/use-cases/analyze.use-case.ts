import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { AnalyzeRequest, AnalyzeResponse } from "../../domain/analyze.types";
import { AnalysisProvider } from "../ports/analysis.provider";
import { ANALYSIS_PROVIDER } from "../tokens/analysis-provider.token";

@Injectable()
export class AnalyzeUseCase {
  constructor(
    @Inject(ANALYSIS_PROVIDER)
    private readonly analysisProvider: AnalysisProvider
  ) {}

  async execute(input: AnalyzeRequest): Promise<AnalyzeResponse> {
    if (!input?.text || typeof input.text !== "string") {
      throw new BadRequestException("Invalid input: 'text' is required");
    }

    return await this.analysisProvider.analyze(input);
  }
}