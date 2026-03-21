import { Module } from "@nestjs/common";
import { HealthController } from "./entrypoints/health.controller";
import { MetricsController } from "./entrypoints/metrics.controller";
import { ResilienceController } from "./entrypoints/resilience.controller";
import { HealthService } from "./services/health.service";

@Module({
  controllers: [HealthController, MetricsController, ResilienceController],
  providers: [HealthService]
})
export class SystemModule {}