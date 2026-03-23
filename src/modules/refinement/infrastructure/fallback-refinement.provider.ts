import { Inject, Injectable } from "@nestjs/common";
import { RefinementProvider } from "../application/ports/refinement.provider";
import { RefineRequest, RefineResponse } from "../domain/refinement.types";
import { appConfig } from "../../../config/app.config";
import { ProviderFailoverExecutor } from "../../../shared/resilience/executors/provider-failover-executor";

@Injectable()
export class FallbackRefinementProvider implements RefinementProvider {
  constructor(
    @Inject("PRIMARY_REFINEMENT_PROVIDER")
    private readonly primaryProvider: RefinementProvider,
    @Inject("FALLBACK_REFINEMENT_PROVIDER")
    private readonly fallbackProvider: RefinementProvider,
    private readonly providerFailoverExecutor: ProviderFailoverExecutor
  ) {}

  async refine(input: RefineRequest): Promise<RefineResponse> {
    return this.providerFailoverExecutor.execute({
      primaryProviderName: appConfig.aiProvider,
      fallbackProviderName: appConfig.fallback.provider,
      fallbackEnabled: appConfig.fallback.enabled,
      executePrimary: () => this.primaryProvider.refine(input),
      executeFallback: () => this.fallbackProvider.refine(input)
    });
  }
}