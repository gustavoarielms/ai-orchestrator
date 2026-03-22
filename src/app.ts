import { Module } from "@nestjs/common";
import { AnalyzeModule } from "./modules/analyze/analyze.module";
import { SystemModule } from "./modules/system/system.module";
import { MetricsModule } from "./shared/metrics/metrics.module";
import { ResilienceModule } from "./shared/resilience/resilience.module";
import { RefinementModule } from "./modules/refinement/refinement.module";

@Module({
  imports: [MetricsModule, ResilienceModule, AnalyzeModule, RefinementModule, SystemModule]
})
export class AppModule {}