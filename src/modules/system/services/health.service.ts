import { Inject, Injectable } from "@nestjs/common";
import { appConfig } from "../../../config/app.config";
import { MetricsRecorder } from "../../../shared/metrics/ports/metrics-recorder";
import { METRICS_RECORDER } from "../../../shared/metrics/tokens/metrics-recorder.token";

@Injectable()
export class HealthService {
  constructor(
    @Inject(METRICS_RECORDER)
    private readonly metricsRecorder: MetricsRecorder
  ) {}

  getBasicHealth() {
    return {
      status: "ok",
      service: "ai-orchestrator"
    };
  }

  getDetailedHealth() {
    const metrics = this.metricsRecorder.getMetrics();

    return {
      status: "ok",
      service: "ai-orchestrator",
      provider: {
        primary: appConfig.aiProvider
      },
      metrics
    };
  }
}
