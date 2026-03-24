import { Injectable } from "@nestjs/common";
import { TechnicalDesignProvider } from "../application/ports/technical-design.provider";
import {
  TechnicalDesignRequest,
  TechnicalDesignResponse
} from "../domain/technical-design.types";
import { OpenAiStructuredExecutor } from "../../../shared/ai/openai/openai-structured-executor";
import { buildTechnicalDesignPrompt } from "./prompts/technical-design.prompt";
import { TechnicalDesignResponseSchema } from "../domain/technical-design.schema";

@Injectable()
export class OpenAiTechnicalDesignProvider implements TechnicalDesignProvider {
  constructor(
    private readonly openAiStructuredExecutor: OpenAiStructuredExecutor
  ) {}

  design(input: TechnicalDesignRequest): Promise<TechnicalDesignResponse> {
    return this.openAiStructuredExecutor.execute({
      operationName: "technical_design_request",
      prompt: buildTechnicalDesignPrompt(input),
      schema: TechnicalDesignResponseSchema
    });
  }
}
