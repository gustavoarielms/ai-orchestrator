import {
  BadRequestException,
  GatewayTimeoutException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException
} from "@nestjs/common";
import { openai } from "../../../shared/openai/openai.client";
import { appConfig } from "../../../config/app.config";
import { AnalyzeRequest, AnalyzeResponse } from "../domain/analyze.types";
import { parseAnalyzeResponse } from "../application/services/parse-analyze-response";
import { AnalysisProvider } from "../application/ports/analysis.provider";
import { Logger } from "../../../shared/logger/logger";

@Injectable()
export class OpenAiAnalysisProvider implements AnalysisProvider {
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

        if (this.shouldRetry(error) && attempt < maxAttempts) {
          Logger.log("Retrying due to recoverable model output error", {
            attempt,
            errorCode: this.extractErrorCode(error)
          });

          continue;
        }

        throw this.mapToHttpException(error);
      }
    }

    throw new InternalServerErrorException({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to analyze request after retry attempts.",
      code: "analyze_request_failed_after_retries"
    });
  }

  private async callOpenAi(input: AnalyzeRequest): Promise<string> {
    const response = await openai.responses.create(
      {
        model: appConfig.openai.model,
        input: [
          {
            role: "system",
            content:
              "You are an analysis agent for product and engineering workflows. Return ONLY a valid JSON object with exactly these fields: userStory (string), acceptanceCriteria (array of non-empty strings), tasks (array of non-empty strings). Do not include markdown, explanations, headings, or extra text."
          },
          {
            role: "user",
            content: `Analyze this requirement and return the structured output: ${input.text}`
          }
        ]
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

  private extractErrorCode(error: any): string | null {
    const errorResponse =
      error instanceof BadRequestException ? error.getResponse() : null;

    if (
      typeof errorResponse === "object" &&
      errorResponse !== null &&
      "code" in errorResponse &&
      typeof errorResponse.code === "string"
    ) {
      return errorResponse.code;
    }

    return null;
  }

  private shouldRetry(error: any): boolean {
    const errorCode = this.extractErrorCode(error);

    return (
      error instanceof BadRequestException &&
      [
        "openai_empty_response",
        "openai_invalid_json",
        "openai_malformed_json",
        "openai_schema_validation_failed"
      ].includes(errorCode ?? "")
    );
  }

  private mapToHttpException(error: any): Error {
    if (error?.name === "APIConnectionTimeoutError") {
      return new GatewayTimeoutException({
        statusCode: HttpStatus.GATEWAY_TIMEOUT,
        message: "OpenAI request timed out.",
        code: "openai_timeout"
      });
    }

    if (error?.status === 429 && error?.code === "insufficient_quota") {
      return new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: "OpenAI quota exceeded. Check billing or API usage limits.",
          code: "openai_insufficient_quota"
        },
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    if (error?.status === 429) {
      return new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: "OpenAI rate limit exceeded. Please try again later.",
          code: "openai_rate_limit_exceeded"
        },
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    if (error?.status === 401) {
      return new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: "OpenAI authentication failed. Check API key configuration.",
        code: "openai_authentication_failed"
      });
    }

    if (error instanceof BadRequestException) {
      return error;
    }

    return new InternalServerErrorException({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to analyze request.",
      code: "analyze_request_failed"
    });
  }
}