import { Module } from "@nestjs/common";
import { HealthController } from "./entrypoints/health.controller";
import { MetricsController } from "./entrypoints/metrics.controller";
import { ResilienceController } from "./entrypoints/resilience.controller";

@Module({
  controllers: [HealthController, MetricsController, ResilienceController]
})
export class SystemModule {}