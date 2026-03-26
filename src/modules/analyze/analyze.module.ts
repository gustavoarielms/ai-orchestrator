import { Module } from "@nestjs/common";
import { AnalyzeController } from "./entrypoints/analyze.controller";
import { AnalyzeUseCase } from "./application/use-cases/analyze.use-case";
import { OpenAiAnalysisProvider } from "./infrastructure/openai-analysis.provider";
import { ClaudeAnalysisProvider } from "./infrastructure/claude-analysis.provider";
import { ANALYSIS_PROVIDER } from "./application/tokens/analysis-provider.token";
import { MetricsModule } from "../../shared/metrics/metrics.module";
import { AiModule } from "../../shared/ai/ai.module";
import { createAiProviderSet } from "../../shared/ai/providers/create-ai-provider-set";

@Module({
  imports: [MetricsModule, AiModule],
  controllers: [AnalyzeController],
  providers: [
    AnalyzeUseCase,
    OpenAiAnalysisProvider,
    ClaudeAnalysisProvider,
    ...createAiProviderSet({
      featureToken: ANALYSIS_PROVIDER,
      openAiProvider: OpenAiAnalysisProvider,
      claudeProvider: ClaudeAnalysisProvider
    })
  ],
  exports: [AnalyzeUseCase]
})
export class AnalyzeModule {}
