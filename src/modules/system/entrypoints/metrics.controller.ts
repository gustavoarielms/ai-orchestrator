import { Controller, Get, Inject } from "@nestjs/common";
import { MetricsRecorder } from "../../../shared/metrics/ports/metrics-recorder";
import { METRICS_RECORDER } from "../../../shared/metrics/tokens/metrics-recorder.token";

@Controller()
export class MetricsController {
  constructor(
    @Inject(METRICS_RECORDER)
    private readonly metricsRecorder: MetricsRecorder
  ) {}

  @Get("/metrics")
  getMetrics() {
    return this.metricsRecorder.getMetrics();
  }
}