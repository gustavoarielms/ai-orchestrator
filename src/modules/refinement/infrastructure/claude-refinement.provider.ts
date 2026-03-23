import { Injectable, NotImplementedException } from "@nestjs/common";
import { RefinementProvider } from "../application/ports/refinement.provider";
import { RefineRequest, RefineResponse } from "../domain/refinement.types";

@Injectable()
export class ClaudeRefinementProvider implements RefinementProvider {
  async refine(_input: RefineRequest): Promise<RefineResponse> {
    throw new NotImplementedException({
      statusCode: 501,
      message: "Claude refinement provider is not implemented yet.",
      code: "claude_refinement_provider_not_implemented"
    });
  }
}