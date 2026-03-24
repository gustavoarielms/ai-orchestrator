import { Injectable, NotImplementedException } from "@nestjs/common";
import { TechnicalDesignProvider } from "../application/ports/technical-design.provider";
import {
  TechnicalDesignRequest,
  TechnicalDesignResponse
} from "../domain/technical-design.types";

@Injectable()
export class ClaudeTechnicalDesignProvider implements TechnicalDesignProvider {
  async design(
    _input: TechnicalDesignRequest
  ): Promise<TechnicalDesignResponse> {
    throw new NotImplementedException({
      statusCode: 501,
      message: "Claude technical design provider is not implemented yet.",
      code: "claude_technical_design_provider_not_implemented"
    });
  }
}
