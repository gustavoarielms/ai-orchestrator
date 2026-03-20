import { Controller, Get } from "@nestjs/common";
import { MetricsService } from "../../../shared/metrics/metrics.service";

@Controller()
export class MetricsController {
  @Get("/metrics")
  getMetrics() {
    return MetricsService.getMetrics();
  }
}