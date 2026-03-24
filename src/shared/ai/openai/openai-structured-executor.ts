import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException
} from "@nestjs/common";
import { ZodSchema } from "zod";
import { openai } from "../../openai/openai.client";
import { appConfig } from "../../../config/app.config";
import { Logger } from "../../logger/logger";
import { MetricsRecorder } from "../../metrics/ports/metrics-recorder";
import { METRICS_RECORDER } from "../../metrics/tokens/metrics-recorder.token";
import {
  extractErrorCode,
  mapOpenAiErrorToHttpException,
  shouldRetryOpenAiError
} from "./errors/openai-error.mapper";
import {
  ExecuteStructuredOpenAiParams,
  OpenAiPromptMessage
} from "./openai-structured-executor.types";

@Injectable()
export class OpenAiStructuredExecutor {
  constructor(
    @Inject(METRICS_RECORDER)
    private readonly metricsRecorder: MetricsRecorder
  ) {}

  async execute<T>({
    operationName,
    prompt,
    schema
  }: ExecuteStructuredOpenAiParams<T>): Promise<T> {
    const maxAttempts = appConfig.openai.maxAttempts;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        Logger.log(`Calling OpenAI for ${operationName}`, {
          attempt,
          timeoutMs: appConfig.openai.timeoutMs
        });

        const response = await openai.responses.create(
          {
            model: appConfig.openai.model,
            input: prompt as Array<{ role: "system" | "user"; content: string }>
          },
          {
            timeout: appConfig.openai.timeoutMs
          }
        );

        const outputText = response.output_text ?? "";
        return this.parseStructuredResponse(outputText, schema, operationName);
      } catch (error: any) {
        Logger.error(`OpenAI ${operationName} executor error`, {
          attempt,
          error: error?.message,
          status: error?.status,
          code: error?.code,
          name: error?.name
        });

        if (shouldRetryOpenAiError(error) && attempt < maxAttempts) {
          this.metricsRecorder.incrementRetry();

          Logger.log("Retrying due to recoverable model output error", {
            operationName,
            attempt,
            errorCode: extractErrorCode(error)
          });

          continue;
        }

        throw mapOpenAiErrorToHttpException(error, operationName);
      }
    }

    throw new InternalServerErrorException({
      statusCode: 500,
      message: `Failed to execute ${operationName} after retry attempts.`,
      code: `${operationName}_failed_after_retries`
    });
  }

  private parseStructuredResponse<T>(
    rawText: string,
    schema: ZodSchema<T>,
    operationName: string
  ): T {
    const trimmed = rawText?.trim();

    if (!trimmed) {
      throw new BadRequestException({
        statusCode: 400,
        message: "Model returned an empty response.",
        code: "openai_empty_response"
      });
    }

    const jsonStart = trimmed.indexOf("{");
    const jsonEnd = trimmed.lastIndexOf("}");

    if (jsonStart === -1 || jsonEnd === -1 || jsonEnd < jsonStart) {
      throw new BadRequestException({
        statusCode: 400,
        message: "Model did not return a valid JSON object.",
        code: "openai_invalid_json"
      });
    }

    const jsonText = trimmed.slice(jsonStart, jsonEnd + 1);

    let parsed: unknown;

    try {
      parsed = JSON.parse(jsonText);
    } catch {
      throw new BadRequestException({
        statusCode: 400,
        message: "Model returned malformed JSON.",
        code: "openai_malformed_json"
      });
    }

    const result = schema.safeParse(parsed);

    if (!result.success) {
      throw new BadRequestException({
        statusCode: 400,
        message: `Model response does not match the expected ${operationName} schema.`,
        code: "openai_schema_validation_failed",
        details: result.error.flatten()
      });
    }

    return result.data;
  }
}
