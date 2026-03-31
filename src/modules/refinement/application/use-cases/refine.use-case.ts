import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { RefineRequest, RefineResponse } from "../../domain/refinement.types";
import { RefineHandler } from "../ports/refine-handler";
import { RefinementProvider } from "../ports/refinement.provider";
import { REFINEMENT_PROVIDER } from "../tokens/refinement-provider.token";
import { Logger } from "../../../../shared/logger/logger";

@Injectable()
export class RefineUseCase implements RefineHandler {
  constructor(
    @Inject(REFINEMENT_PROVIDER)
    private readonly refinementProvider: RefinementProvider
  ) {}

  async execute(input: RefineRequest): Promise<RefineResponse> {
    Logger.log("Refine use case started");

    if (!input?.text || typeof input.text !== "string") {
      Logger.error("Invalid refine input");
      throw new BadRequestException("Invalid input: 'text' is required");
    }

    const result = await this.refinementProvider.refine(input);

    Logger.log("Refine use case completed");

    return result;
  }
}
