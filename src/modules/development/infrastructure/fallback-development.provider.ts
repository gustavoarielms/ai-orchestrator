import { Inject, Injectable } from "@nestjs/common";
import { DevelopmentProvider } from "../application/ports/development.provider";
import {
  DevelopmentRequest,
  DevelopmentResponse
} from "../domain/development.types";
import { appConfig } from "../../../config/app.config";
import { ProviderFailoverExecutor } from "../../../shared/resilience/executors/provider-failover-executor";

@Injectable()
export class FallbackDevelopmentProvider implements DevelopmentProvider {
  constructor(
    @Inject("PRIMARY_DEVELOPMENT_PROVIDER")
    private readonly primaryProvider: DevelopmentProvider,
    @Inject("FALLBACK_DEVELOPMENT_PROVIDER")
    private readonly fallbackProvider: DevelopmentProvider,
    private readonly providerFailoverExecutor: ProviderFailoverExecutor
  ) {}

  develop(input: DevelopmentRequest): Promise<DevelopmentResponse> {
    return this.providerFailoverExecutor.execute({
      primaryProviderName: appConfig.aiProvider,
      fallbackProviderName: appConfig.fallback.provider,
      fallbackEnabled: appConfig.fallback.enabled,
      executePrimary: () => this.primaryProvider.develop(input),
      executeFallback: () => this.fallbackProvider.develop(input)
    });
  }
}
