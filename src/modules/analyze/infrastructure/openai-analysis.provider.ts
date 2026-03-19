import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException
} from "@nestjs/common";
import { openai } from "../../../shared/openai/openai.client";
import { env } from "../../../config/env";
import { AnalyzeRequest, AnalyzeResponse } from "../domain/analyze.types";

@Injectable()
export class OpenAiAnalysisProvider {
  async analyze(input: AnalyzeRequest): Promise<AnalyzeResponse> {
    try {
      const response = await openai.responses.create({
        model: env.openAiModel,
        input: [
          {
            role: "system",
            content:
              "You are an analysis agent for product and engineering workflows. Return ONLY a valid JSON object with exactly these fields: userStory (string), acceptanceCriteria (array of strings), tasks (array of strings). Do not include any extra text."
          },
          {
            role: "user",
            content: `Analyze this requirement and return the structured output: ${input.text}`
          }
        ]
      });

      const outputText = response.output_text?.trim();

      if (!outputText) {
        throw new InternalServerErrorException("OpenAI returned an empty response");
      }

      const parsed = JSON.parse(outputText) as AnalyzeResponse;

      return {
        userStory: parsed.userStory,
        acceptanceCriteria: parsed.acceptanceCriteria,
        tasks: parsed.tasks
      };
    } catch (error: any) {
      console.error("OpenAiAnalysisProvider error:", error);

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

      if (error instanceof SyntaxError) {
        throw new InternalServerErrorException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: "OpenAI returned an invalid JSON response.",
          code: "openai_invalid_json"
        });
      }

      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Failed to analyze request.",
        code: "analyze_request_failed"
      });
    }
  }
}