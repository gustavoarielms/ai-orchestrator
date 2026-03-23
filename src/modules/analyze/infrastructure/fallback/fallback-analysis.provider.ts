import { Inject, Injectable } from "@nestjs/common";
import { AnalysisProvider } from "../../application/ports/analysis.provider";
import { AnalyzeRequest, AnalyzeResponse } from "../../domain/analyze.types";
import { appConfig } from "../../../../config/app.config";
import { ProviderFailoverExecutor } from "../../../../shared/resilience/executors/provider-failover-executor";

@Injectable()
export class FallbackAnalysisProvider implements AnalysisProvider {
  constructor(
    @Inject("PRIMARY_ANALYSIS_PROVIDER")
    private readonly primaryProvider: AnalysisProvider,
    @Inject("FALLBACK_ANALYSIS_PROVIDER")
    private readonly fallbackProvider: AnalysisProvider,
    private readonly providerFailoverExecutor: ProviderFailoverExecutor
  ) {}

  analyze(input: AnalyzeRequest): Promise<AnalyzeResponse> {
    return this.providerFailoverExecutor.execute({
      primaryProviderName: appConfig.aiProvider,
      fallbackProviderName: appConfig.fallback.provider,
      fallbackEnabled: appConfig.fallback.enabled,
      executePrimary: () => this.primaryProvider.analyze(input),
      executeFallback: () => this.fallbackProvider.analyze(input)
    });
  }
}
