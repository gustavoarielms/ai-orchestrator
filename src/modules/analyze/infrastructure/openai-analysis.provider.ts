import { Injectable } from "@nestjs/common";
import { AnalyzeRequest, AnalyzeResponse } from "../domain/analyze.types";
import { AnalysisProvider } from "../application/ports/analysis.provider";
import { buildAnalyzePrompt } from "./prompts/analyze.prompt";
import { OpenAiStructuredExecutor } from "../../../shared/ai/openai/openai-structured-executor";
import { AnalyzeResponseSchema } from "../domain/analyze.schema";

@Injectable()
export class OpenAiAnalysisProvider implements AnalysisProvider {
  constructor(
    private readonly openAiStructuredExecutor: OpenAiStructuredExecutor
  ) {}

  async analyze(input: AnalyzeRequest): Promise<AnalyzeResponse> {
    return this.openAiStructuredExecutor.execute({
      operationName: "analyze_request",
      prompt: buildAnalyzePrompt(input),
      schema: AnalyzeResponseSchema
    });
  }
}
