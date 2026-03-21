import { Global, Module } from "@nestjs/common";
import { InMemoryMetricsService } from "./services/in-memory-metrics.service";
import { METRICS_RECORDER } from "./tokens/metrics-recorder.token";

@Global()
@Module({
  providers: [
    InMemoryMetricsService,
    {
      provide: METRICS_RECORDER,
      useExisting: InMemoryMetricsService
    }
  ],
  exports: [METRICS_RECORDER, InMemoryMetricsService]
})
export class MetricsModule {}