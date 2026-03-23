import { Body, Controller, Post } from "@nestjs/common";
import { PlanRequirementUseCase } from "../application/use-cases/plan-requirement.use-case";
import { PlanRequest } from "../domain/planning.types";
import { Logger } from "../../../shared/logger/logger";

@Controller("/plan")
export class PlanningController {
  constructor(
    private readonly planRequirementUseCase: PlanRequirementUseCase
  ) {}

  @Post()
  async plan(@Body() body: PlanRequest) {
    Logger.log("Plan request received", {
      input: body?.text
    });

    const result = await this.planRequirementUseCase.execute(body);

    Logger.log("Plan request completed");

    return result;
  }
}