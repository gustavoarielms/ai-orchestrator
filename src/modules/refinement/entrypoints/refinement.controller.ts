import { Body, Controller, Post } from "@nestjs/common";
import { RefineUseCase } from "../application/use-cases/refine.use-case";
import { RefineRequest } from "../domain/refinement.types";
import { Logger } from "../../../shared/logger/logger";

@Controller("/refine")
export class RefinementController {
  constructor(private readonly refineUseCase: RefineUseCase) {}

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