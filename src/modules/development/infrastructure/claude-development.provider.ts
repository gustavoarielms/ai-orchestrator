import { Injectable, NotImplementedException } from "@nestjs/common";
import { DevelopmentProvider } from "../application/ports/development.provider";
import {
  DevelopmentRequest,
  DevelopmentResponse
} from "../domain/development.types";

@Injectable()
export class ClaudeDevelopmentProvider implements DevelopmentProvider {
  async develop(_input: DevelopmentRequest): Promise<DevelopmentResponse> {
    throw new NotImplementedException({
      statusCode: 501,
      message: "Claude development provider is not implemented yet.",
      code: "claude_development_provider_not_implemented"
    });
  }
}
