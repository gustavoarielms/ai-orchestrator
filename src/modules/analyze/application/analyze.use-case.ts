import { BadRequestException, Injectable } from "@nestjs/common";
import { AnalyzeRequest, AnalyzeResponse } from "../domain/analyze.types";
import { OpenAiAnalysisProvider } from "../infrastructure/openai-analysis.provider";

@Injectable()
export class AnalyzeUseCase {
  constructor(
    private readonly openAiAnalysisProvider: OpenAiAnalysisProvider
  ) {}

  async execute(input: AnalyzeRequest): Promise<AnalyzeResponse> {
    if (!input?.text || typeof input.text !== "string") {
      throw new BadRequestException("Invalid input: 'text' is required");
    }

    return await this.openAiAnalysisProvider.analyze(input);
  }
}