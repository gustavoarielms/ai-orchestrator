import { BadRequestException } from "@nestjs/common";
import { AnalyzeResponse } from "../domain/analyze.types";
import { AnalyzeResponseSchema } from "../domain/analyze.schema";

export function parseAnalyzeResponse(rawText: string): AnalyzeResponse {
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

  const result = AnalyzeResponseSchema.safeParse(parsed);

  if (!result.success) {
    throw new BadRequestException({
      statusCode: 400,
      message: "Model response does not match the expected schema.",
      code: "openai_schema_validation_failed",
      details: result.error.flatten()
    });
  }

  return result.data;
}