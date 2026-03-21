import { Module } from "@nestjs/common";
import { AnalyzeModule } from "./modules/analyze/analyze.module";
import { SystemModule } from "./modules/system/system.module";
import { MetricsModule } from "./shared/metrics/metrics.module";

@Module({
  imports: [MetricsModule, AnalyzeModule, SystemModule]
})
export class AppModule {}