import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import {
  TechnicalDesignRequest,
  TechnicalDesignResponse
} from "../../domain/technical-design.types";
import { TECHNICAL_DESIGN_PROVIDER } from "../tokens/technical-design-provider.token";
import { TechnicalDesignProvider } from "../ports/technical-design.provider";
import { Logger } from "../../../../shared/logger/logger";

@Injectable()
export class TechnicalDesignUseCase {
  constructor(
    @Inject(TECHNICAL_DESIGN_PROVIDER)
    private readonly technicalDesignProvider: TechnicalDesignProvider
  ) {}

  async execute(
    input: TechnicalDesignRequest
  ): Promise<TechnicalDesignResponse> {
    Logger.log("Technical design use case started");

    if (!input?.text || typeof input.text !== "string") {
      Logger.error("Invalid technical design input");
      throw new BadRequestException("Invalid input: 'text' is required");
    }

    const result = await this.technicalDesignProvider.design(input);

    Logger.log("Technical design use case completed");

    return result;
  }
}
