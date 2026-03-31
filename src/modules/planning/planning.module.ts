import { Module } from "@nestjs/common";
import { PlanningController } from "./entrypoints/planning.controller";
import { PlanRequirementUseCase } from "./application/use-cases/plan-requirement.use-case";
import { PLAN_HANDLER } from "./application/tokens/plan-handler.token";
import { AnalyzeModule } from "../analyze/analyze.module";
import { RefinementModule } from "../refinement/refinement.module";
import { TechnicalDesignModule } from "../technical-design/technical-design.module";
import { TaskBreakdownModule } from "../task-breakdown/task-breakdown.module";

@Module({
  imports: [
    AnalyzeModule,
    RefinementModule,
    TechnicalDesignModule,
    TaskBreakdownModule
  ],
  controllers: [PlanningController],
  providers: [
    PlanRequirementUseCase,
    {
      provide: PLAN_HANDLER,
      useExisting: PlanRequirementUseCase
    }
  ]
})
export class PlanningModule {}
