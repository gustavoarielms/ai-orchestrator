import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException
} from "@nestjs/common";
import { ZodSchema } from "zod";
import { openai } from "../../openai/openai.client";
import { appConfig } from "../../../config/app.config";
import { Logger } from "../../logger/logger";
import {
  ExecuteStructuredOpenAiParams,
  OpenAiPromptMessage
} from "./openai-structured-executor.types";

@Injectable()
export class OpenAiStructuredExecutor {
  async execute<T>({
    operationName,
    prompt,
    schema
  }: ExecuteStructuredOpenAiParams<T>): Promise<T> {
    try {
      Logger.log(`Calling OpenAI for ${operationName}`, {
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
        error: error?.message,
        status: error?.status,
        code: error?.code,
        name: error?.name
      });

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
        message: `Failed to execute ${operationName}.`,
        code: `${operationName}_failed`
      });
    }
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