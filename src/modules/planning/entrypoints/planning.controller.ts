import { Body, Controller, Inject, Post } from "@nestjs/common";
import { PlanHandler } from "../application/ports/plan-handler";
import { PLAN_HANDLER } from "../application/tokens/plan-handler.token";
import { PlanRequest } from "../domain/planning.types";
import { Logger } from "../../../shared/logger/logger";

@Controller("/plan")
export class PlanningController {
  constructor(
    @Inject(PLAN_HANDLER)
    private readonly planRequirementUseCase: PlanHandler
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
