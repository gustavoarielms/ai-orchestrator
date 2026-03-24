import { Inject, Injectable } from "@nestjs/common";
import { TaskBreakdownProvider } from "../application/ports/task-breakdown.provider";
import {
  TaskBreakdownRequest,
  TaskBreakdownResponse
} from "../domain/task-breakdown.types";
import { appConfig } from "../../../config/app.config";
import { ProviderFailoverExecutor } from "../../../shared/resilience/executors/provider-failover-executor";

@Injectable()
export class FallbackTaskBreakdownProvider implements TaskBreakdownProvider {
  constructor(
    @Inject("PRIMARY_TASK_BREAKDOWN_PROVIDER")
    private readonly primaryProvider: TaskBreakdownProvider,
    @Inject("FALLBACK_TASK_BREAKDOWN_PROVIDER")
    private readonly fallbackProvider: TaskBreakdownProvider,
    private readonly providerFailoverExecutor: ProviderFailoverExecutor
  ) {}

  breakdown(input: TaskBreakdownRequest): Promise<TaskBreakdownResponse> {
    return this.providerFailoverExecutor.execute({
      primaryProviderName: appConfig.aiProvider,
      fallbackProviderName: appConfig.fallback.provider,
      fallbackEnabled: appConfig.fallback.enabled,
      executePrimary: () => this.primaryProvider.breakdown(input),
      executeFallback: () => this.fallbackProvider.breakdown(input)
    });
  }
}
