import { Body, Controller, Inject, Post } from "@nestjs/common";
import { RefineHandler } from "../application/ports/refine-handler";
import { REFINE_HANDLER } from "../application/tokens/refine-handler.token";
import { RefineRequest } from "../domain/refinement.types";
import { Logger } from "../../../shared/logger/logger";

@Controller("/refine")
export class RefinementController {
  constructor(
    @Inject(REFINE_HANDLER)
    private readonly refineUseCase: RefineHandler
  ) {}

  @Post()
  async refine(@Body() body: RefineRequest) {
    Logger.log("Refine request received", {
      input: body?.text
    });

    const result = await this.refineUseCase.execute(body);

    Logger.log("Refine request completed");

    return result;
  }
}
