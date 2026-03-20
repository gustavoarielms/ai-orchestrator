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

        const outputText = response.output_text ?? "";
        return parseAnalyzeResponse(outputText);
      } catch (error: any) {
        Logger.error("OpenAI provider error", {
          attempt,
          error: error?.message,
          status: error?.status,
          code: error?.code,
          name: error?.name
        });

        const errorResponse =
          error instanceof BadRequestException ? error.getResponse() : null;

        const errorCode =
          typeof errorResponse === "object" &&
          errorResponse !== null &&
          "code" in errorResponse &&
          typeof errorResponse.code === "string"
            ? errorResponse.code
            : null;

        const isRecoverableModelOutputError =
          error instanceof BadRequestException &&
          [
            "openai_empty_response",
            "openai_invalid_json",
            "openai_malformed_json",
            "openai_schema_validation_failed"
          ].includes(errorCode ?? "");

        if (isRecoverableModelOutputError && attempt < maxAttempts) {
          Logger.log("Retrying due to recoverable model output error", {
            attempt,
            errorCode
          });

          continue;
        }

        if (error?.name === "APIConnectionTimeoutError") {
          throw new GatewayTimeoutException({
            statusCode: HttpStatus.GATEWAY_TIMEOUT,
            message: "OpenAI request timed out.",
            code: "openai_timeout"
          });
        }

        if (error?.status === 429 && error?.code === "insufficient_quota") {
          throw new HttpException(
            {
              statusCode: HttpStatus.TOO_MANY_REQUESTS,
              message: "OpenAI quota exceeded. Check billing or API usage limits.",
              code: "openai_insufficient_quota"
            },
            HttpStatus.TOO_MANY_REQUESTS
          );
        }

        if (error?.status === 429) {
          throw new HttpException(
            {
              statusCode: HttpStatus.TOO_MANY_REQUESTS,
              message: "OpenAI rate limit exceeded. Please try again later.",
              code: "openai_rate_limit_exceeded"
            },
            HttpStatus.TOO_MANY_REQUESTS
          );
        }

        if (error?.status === 401) {
          throw new UnauthorizedException({
            statusCode: HttpStatus.UNAUTHORIZED,
            message: "OpenAI authentication failed. Check API key configuration.",
            code: "openai_authentication_failed"
          });
        }

        if (error instanceof BadRequestException) {
          throw error;
        }

        throw new InternalServerErrorException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: "Failed to analyze request.",
          code: "analyze_request_failed"
        });
      }
    }

    throw new InternalServerErrorException({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to analyze request after retry attempts.",
      code: "analyze_request_failed_after_retries"
    });
  }
}