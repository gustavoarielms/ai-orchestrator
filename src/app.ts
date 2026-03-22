import { Module } from "@nestjs/common";
import { AnalyzeModule } from "./modules/analyze/analyze.module";
import { RefinementModule } from "./modules/refinement/refinement.module";
import { PlanningModule } from "./modules/planning/planning.module";
import { SystemModule } from "./modules/system/system.module";
import { MetricsModule } from "./shared/metrics/metrics.module";
import { ResilienceModule } from "./shared/resilience/resilience.module";

@Module({
  imports: [
    MetricsModule,
    ResilienceModule,
    AnalyzeModule,
    RefinementModule,
    PlanningModule,
    SystemModule
  ]
})
export class AppModule {}