import { Module } from "@nestjs/common";
import { PlanningController } from "./entrypoints/planning.controller";
import { PlanRequirementUseCase } from "./application/use-cases/plan-requirement.use-case";
import { AnalyzeModule } from "../analyze/analyze.module";
import { RefinementModule } from "../refinement/refinement.module";

@Module({
  imports: [AnalyzeModule, RefinementModule],
  controllers: [PlanningController],
  providers: [PlanRequirementUseCase]
})
export class PlanningModule {}