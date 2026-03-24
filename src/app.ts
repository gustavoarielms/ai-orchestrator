import { Module } from "@nestjs/common";
import { AnalyzeModule } from "./modules/analyze/analyze.module";
import { RefinementModule } from "./modules/refinement/refinement.module";
import { PlanningModule } from "./modules/planning/planning.module";
import { SystemModule } from "./modules/system/system.module";
import { TechnicalDesignModule } from "./modules/technical-design/technical-design.module";
import { TaskBreakdownModule } from "./modules/task-breakdown/task-breakdown.module";
import { MetricsModule } from "./shared/metrics/metrics.module";
import { ResilienceModule } from "./shared/resilience/resilience.module";
import { AiModule } from "./shared/ai/ai.module";

@Module({
  imports: [
    MetricsModule,
    ResilienceModule,
    AiModule,
    AnalyzeModule,
    RefinementModule,
    TechnicalDesignModule,
    TaskBreakdownModule,
    PlanningModule,
    SystemModule
  ]
})
export class AppModule {}
