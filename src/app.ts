import { Module } from "@nestjs/common";
import { AnalyzeModule } from "./modules/analyze/analyze.module";
import { SystemModule } from "./modules/system/system.module";
import { MetricsModule } from "./shared/metrics/metrics.module";
import { ResilienceModule } from "./shared/resilience/resilience.module";

@Module({
  imports: [MetricsModule, ResilienceModule, AnalyzeModule, SystemModule]
})
export class AppModule {}