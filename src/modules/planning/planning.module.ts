import { Module } from "@nestjs/common";
import { PlanningController } from "./entrypoints/planning.controller";
import { PlanRequirementUseCase } from "./application/use-cases/plan-requirement.use-case";
import { AnalyzeModule } from "../analyze/analyze.module";
import { RefinementModule } from "../refinement/refinement.module";
import { TechnicalDesignModule } from "../technical-design/technical-design.module";

@Module({
  imports: [AnalyzeModule, RefinementModule, TechnicalDesignModule],
  controllers: [PlanningController],
  providers: [PlanRequirementUseCase]
})
export class PlanningModule {}
