import { Controller, Get, Module } from "@nestjs/common";
import { AnalyzeModule } from "./modules/analyze/analyze.module";
import { MetricsService } from "./shared/metrics/metrics.service";

@Controller()
class HealthController {
  @Get("/health")
  getHealth() {
    return {
      status: "ok",
      service: "ai-orchestrator"
    };
  } 
}

@Controller()
class MetricsController{
  @Get("/metrics")
  getMetrics() {
    return MetricsService.getMetrics();
  }
}

@Module({
  imports: [AnalyzeModule],
  controllers: [HealthController, MetricsController]
})
export class AppModule {}