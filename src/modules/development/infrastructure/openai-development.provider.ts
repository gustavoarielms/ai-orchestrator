import { Injectable } from "@nestjs/common";
import { DevelopmentProvider } from "../application/ports/development.provider";
import {
  DevelopmentRequest,
  DevelopmentResponse
} from "../domain/development.types";
import { OpenAiStructuredExecutor } from "../../../shared/ai/openai/openai-structured-executor";
import { buildDevelopmentPrompt } from "./development.prompt";
import { DevelopmentResponseSchema } from "../domain/development.schema";

@Injectable()
export class OpenAiDevelopmentProvider implements DevelopmentProvider {
  constructor(
    private readonly openAiStructuredExecutor: OpenAiStructuredExecutor
  ) {}

  develop(input: DevelopmentRequest): Promise<DevelopmentResponse> {
    return this.openAiStructuredExecutor.execute({
      operationName: "development_request",
      prompt: buildDevelopmentPrompt(input),
      schema: DevelopmentResponseSchema
    });
  }
}
