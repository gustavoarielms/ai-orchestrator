import { Module } from "@nestjs/common";
import { AnalyzeController } from "./entrypoints/analyze.controller";
import { AnalyzeUseCase } from "./application/use-cases/analyze.use-case";
import { OpenAiAnalysisProvider } from "./infrastructure/openai-analysis.provider";
import { ClaudeAnalysisProvider } from "./infrastructure/claude-analysis.provider";
import { FallbackAnalysisProvider } from "./infrastructure/fallback/fallback-analysis.provider";
import { AnalysisProvider } from "./application/ports/analysis.provider";
import { ANALYSIS_PROVIDER } from "./application/tokens/analysis-provider.token";
import { MetricsModule } from "../../shared/metrics/metrics.module";
import { ResilienceModule } from "../../shared/resilience/resilience.module";
import { AiModule } from "../../shared/ai/ai.module";
import { createAiProviderSet } from "../../shared/ai/providers/create-ai-provider-set";

@Module({
  imports: [MetricsModule, ResilienceModule, AiModule],
  controllers: [AnalyzeController],
  providers: [
    AnalyzeUseCase,
    OpenAiAnalysisProvider,
    ClaudeAnalysisProvider,
    FallbackAnalysisProvider,
    ...createAiProviderSet<AnalysisProvider, FallbackAnalysisProvider>({
      featureToken: ANALYSIS_PROVIDER,
      primaryToken: "PRIMARY_ANALYSIS_PROVIDER",
      fallbackToken: "FALLBACK_ANALYSIS_PROVIDER",
      openAiProvider: OpenAiAnalysisProvider,
      claudeProvider: ClaudeAnalysisProvider,
      fallbackProvider: FallbackAnalysisProvider
    })
  ],
  exports: [AnalyzeUseCase]
})
export class AnalyzeModule {}
