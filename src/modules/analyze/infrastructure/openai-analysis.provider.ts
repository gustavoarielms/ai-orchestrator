import {
  Injectable,
  InternalServerErrorException,
  Inject
} from "@nestjs/common";
import { appConfig } from "../../../config/app.config";
import { AnalyzeRequest, AnalyzeResponse } from "../domain/analyze.types";
import { AnalysisProvider } from "../application/ports/analysis.provider";
import { Logger } from "../../../shared/logger/logger";
import { MetricsRecorder } from "../../../shared/metrics/ports/metrics-recorder";
import { METRICS_RECORDER } from "../../../shared/metrics/tokens/metrics-recorder.token";
import { buildAnalyzePrompt } from "./prompts/analyze.prompt";
import {
  extractErrorCode,
  mapOpenAiErrorToHttpException,
  shouldRetryOpenAiError
} from "./errors/openai-error.mapper";
import { OpenAiStructuredExecutor } from "../../../shared/ai/openai/openai-structured-executor";
import { AnalyzeResponseSchema } from "../domain/analyze.schema";

@Injectable()
export class OpenAiAnalysisProvider implements AnalysisProvider {
  constructor(
    @Inject(METRICS_RECORDER)
    private readonly metricsRecorder: MetricsRecorder,
    private readonly openAiStructuredExecutor: OpenAiStructuredExecutor
  ) {}

  async analyze(input: AnalyzeRequest): Promise<AnalyzeResponse> {
    const maxAttempts = appConfig.openai.maxAttempts;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        Logger.log("Calling OpenAI", {
          attempt,
          timeoutMs: appConfig.openai.timeoutMs
        });

        return await this.callOpenAi(input);
      } catch (error: any) {
        this.logProviderError(error, attempt);

        if (shouldRetryOpenAiError(error) && attempt < maxAttempts) {
          this.metricsRecorder.incrementRetry();

          Logger.log("Retrying due to recoverable model output error", {
            attempt,
            errorCode: extractErrorCode(error)
          });

          continue;
        }

        throw mapOpenAiErrorToHttpException(error);
      }
    }

    throw new InternalServerErrorException({
      statusCode: 500,
      message: "Failed to analyze request after retry attempts.",
      code: "analyze_request_failed_after_retries"
    });
  }

  private async callOpenAi(input: AnalyzeRequest): Promise<AnalyzeResponse> {
    return this.openAiStructuredExecutor.execute({
      operationName: "analyze_request",
      prompt: buildAnalyzePrompt(input),
      schema: AnalyzeResponseSchema
    });
  }

  private logProviderError(error: any, attempt: number): void {
    Logger.error("OpenAI provider error", {
      attempt,
      error: error?.message,
      status: error?.status,
      code: error?.code,
      name: error?.name
    });
  }
}