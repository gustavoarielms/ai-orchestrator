import {
  Injectable,
  InternalServerErrorException,
  Inject
} from "@nestjs/common";
import { openai } from "../../../shared/openai/openai.client";
import { appConfig } from "../../../config/app.config";
import { AnalyzeRequest, AnalyzeResponse } from "../domain/analyze.types";
import { parseAnalyzeResponse } from "../application/services/parse-analyze-response";
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

@Injectable()
export class OpenAiAnalysisProvider implements AnalysisProvider {
  constructor(
    @Inject(METRICS_RECORDER)
    private readonly metricsRecorder: MetricsRecorder
  ) {}

  async analyze(input: AnalyzeRequest): Promise<AnalyzeResponse> {
    const maxAttempts = appConfig.openai.maxAttempts;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        Logger.log("Calling OpenAI", {
          attempt,
          timeoutMs: appConfig.openai.timeoutMs
        });

        const outputText = await this.callOpenAi(input);
        return parseAnalyzeResponse(outputText);
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

  private async callOpenAi(input: AnalyzeRequest): Promise<string> {
    const response = await openai.responses.create(
      {
        model: appConfig.openai.model,
        input: buildAnalyzePrompt(input)
      },
      {
        timeout: appConfig.openai.timeoutMs
      }
    );

    return response.output_text ?? "";
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