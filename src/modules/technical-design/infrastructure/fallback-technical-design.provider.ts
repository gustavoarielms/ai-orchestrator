import { Inject, Injectable } from "@nestjs/common";
import { TechnicalDesignProvider } from "../application/ports/technical-design.provider";
import {
  TechnicalDesignRequest,
  TechnicalDesignResponse
} from "../domain/technical-design.types";
import { appConfig } from "../../../config/app.config";
import { ProviderFailoverExecutor } from "../../../shared/resilience/executors/provider-failover-executor";

@Injectable()
export class FallbackTechnicalDesignProvider
  implements TechnicalDesignProvider
{
  constructor(
    @Inject("PRIMARY_TECHNICAL_DESIGN_PROVIDER")
    private readonly primaryProvider: TechnicalDesignProvider,
    @Inject("FALLBACK_TECHNICAL_DESIGN_PROVIDER")
    private readonly fallbackProvider: TechnicalDesignProvider,
    private readonly providerFailoverExecutor: ProviderFailoverExecutor
  ) {}

  design(input: TechnicalDesignRequest): Promise<TechnicalDesignResponse> {
    return this.providerFailoverExecutor.execute({
      primaryProviderName: appConfig.aiProvider,
      fallbackProviderName: appConfig.fallback.provider,
      fallbackEnabled: appConfig.fallback.enabled,
      executePrimary: () => this.primaryProvider.design(input),
      executeFallback: () => this.fallbackProvider.design(input)
    });
  }
}
