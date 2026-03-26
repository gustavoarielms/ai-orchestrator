import { Module } from "@nestjs/common";
import { HealthController } from "./entrypoints/health.controller";
import { MetricsController } from "./entrypoints/metrics.controller";
import { HealthService } from "./services/health.service";

@Module({
  controllers: [HealthController, MetricsController],
  providers: [HealthService]
})
export class SystemModule {}
