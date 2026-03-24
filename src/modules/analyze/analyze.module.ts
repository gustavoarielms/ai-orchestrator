import { Module } from "@nestjs/common";
import { AnalyzeController } from "./entrypoints/analyze.controller";
import { AnalyzeUseCase } from "./application/use-cases/analyze.use-case";
import { OpenAiAnalysisProvider } from "./infrastructure/openai-analysis.provider";
import { ClaudeAnalysisProvider } from "./infrastructure/claude-analysis.provider";
import { FallbackAnalysisProvider } from "./infrastructure/fallback/fallback-analysis.provider";
import { AnalysisProvider } from "./application/ports/analysis.provider";
import { ANALYSIS_PROVIDER } from "./application/tokens/analysis-provider.token";
import { MetricsModule } from "../../shared/metrics/metrics.module";
import { appConfig } from "../../config/app.config";
import { ResilienceModule } from "../../shared/resilience/resilience.module";
import { AiModule } from "../../shared/ai/ai.module";
import { AiProviderResolver } from "../../shared/ai/providers/ai-provider-resolver";

@Module({
  imports: [MetricsModule, ResilienceModule, AiModule],
  controllers: [AnalyzeController],
  providers: [
    AnalyzeUseCase,
    OpenAiAnalysisProvider,
    ClaudeAnalysisProvider,
    FallbackAnalysisProvider,
    {
      provide: "PRIMARY_ANALYSIS_PROVIDER",
      useFactory: (
        aiProviderResolver: AiProviderResolver,
        openAiAnalysisProvider: OpenAiAnalysisProvider,
        claudeAnalysisProvider: ClaudeAnalysisProvider
      ) => {
        return aiProviderResolver.resolvePrimary({
          openai: openAiAnalysisProvider,
          claude: claudeAnalysisProvider
        });
      },
      inject: [AiProviderResolver, OpenAiAnalysisProvider, ClaudeAnalysisProvider]
    },
    {
      provide: "FALLBACK_ANALYSIS_PROVIDER",
      useFactory: (
        aiProviderResolver: AiProviderResolver,
        openAiAnalysisProvider: OpenAiAnalysisProvider,
        claudeAnalysisProvider: ClaudeAnalysisProvider
      ) => {
        return aiProviderResolver.resolveFallback({
          openai: openAiAnalysisProvider,
          claude: claudeAnalysisProvider
        });
      },
      inject: [AiProviderResolver, OpenAiAnalysisProvider, ClaudeAnalysisProvider]
    },
    {
      provide: ANALYSIS_PROVIDER,
      useFactory: (
        aiProviderResolver: AiProviderResolver,
        fallbackAnalysisProvider: FallbackAnalysisProvider,
        primaryProvider: AnalysisProvider
      ) => {
        if (aiProviderResolver.shouldUseFallback()) {
          return fallbackAnalysisProvider;
        }

        return primaryProvider;
      },
      inject: [AiProviderResolver, FallbackAnalysisProvider, "PRIMARY_ANALYSIS_PROVIDER"]
    }
  ],
  exports: [AnalyzeUseCase]
})
export class AnalyzeModule {}
