import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException
} from "@nestjs/common";
import { openai } from "../../../shared/openai/openai.client";
import { appConfig } from "../../../config/app.config";
import { Logger } from "../../../shared/logger/logger";
import { RefineRequest, RefineResponse } from "../domain/refinement.types";
import { RefinementProvider } from "../application/ports/refinement.provider";
import { buildRefinementPrompt } from "./prompts/refinement.prompt";
import { RefineResponseSchema } from "../domain/refinement.schema";

@Injectable()
export class OpenAiRefinementProvider implements RefinementProvider {
  async refine(input: RefineRequest): Promise<RefineResponse> {
    try {
      Logger.log("Calling OpenAI for refinement", {
        timeoutMs: appConfig.openai.timeoutMs
      });

      const response = await openai.responses.create(
        {
          model: appConfig.openai.model,
          input: buildRefinementPrompt(input)
        },
        {
          timeout: appConfig.openai.timeoutMs
        }
      );

      const outputText = response.output_text ?? "";
      return this.parseRefinementResponse(outputText);
    } catch (error: any) {
      Logger.error("OpenAI refinement provider error", {
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
        message: "Failed to refine request.",
        code: "refine_request_failed"
      });
    }
  }

  private parseRefinementResponse(rawText: string): RefineResponse {
    const trimmed = rawText?.trim();

    if (!trimmed) {
      throw new BadRequestException({
        statusCode: 400,
        message: "Model returned an empty refinement response.",
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

    const result = RefineResponseSchema.safeParse(parsed);

    if (!result.success) {
      throw new BadRequestException({
        statusCode: 400,
        message: "Model response does not match the expected refinement schema.",
        code: "openai_schema_validation_failed",
        details: result.error.flatten()
      });
    }

    return result.data;
  }
}