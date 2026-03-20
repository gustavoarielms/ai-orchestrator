import { Module } from "@nestjs/common";
import { HealthController } from "./entrypoints/health.controller";
import { MetricsController } from "./entrypoints/metrics.controller";

@Module({
  controllers: [HealthController, MetricsController]
})
export class SystemModule {}