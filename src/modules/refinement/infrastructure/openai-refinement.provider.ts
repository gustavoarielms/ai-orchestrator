import { Injectable } from "@nestjs/common";
import { RefineRequest, RefineResponse } from "../domain/refinement.types";
import { RefinementProvider } from "../application/ports/refinement.provider";
import { buildRefinementPrompt } from "./prompts/refinement.prompt";
import { RefineResponseSchema } from "../domain/refinement.schema";
import { OpenAiStructuredExecutor } from "../../../shared/ai/openai/openai-structured-executor";

@Injectable()
export class OpenAiRefinementProvider implements RefinementProvider {
  constructor(
    private readonly openAiStructuredExecutor: OpenAiStructuredExecutor
  ) {}

  async refine(input: RefineRequest): Promise<RefineResponse> {
    return this.openAiStructuredExecutor.execute({
      operationName: "refine_request",
      prompt: buildRefinementPrompt(input),
      schema: RefineResponseSchema
    });
  }
}