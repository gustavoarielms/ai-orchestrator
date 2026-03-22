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
import { OpenAiStructuredExecutor } from "../../shared/ai/openai/openai-structured-executor";

@Module({
  imports: [MetricsModule],
  controllers: [AnalyzeController],
  providers: [
    AnalyzeUseCase,
    OpenAiStructuredExecutor,
    OpenAiAnalysisProvider,
    ClaudeAnalysisProvider,
    FallbackAnalysisProvider,
    {
      provide: "PRIMARY_ANALYSIS_PROVIDER",
      useFactory: (
        openAiAnalysisProvider: OpenAiAnalysisProvider,
        claudeAnalysisProvider: ClaudeAnalysisProvider
      ) => {
        return appConfig.aiProvider === "claude"
          ? claudeAnalysisProvider
          : openAiAnalysisProvider;
      },
      inject: [OpenAiAnalysisProvider, ClaudeAnalysisProvider]
    },
    {
      provide: "FALLBACK_ANALYSIS_PROVIDER",
      useFactory: (
        openAiAnalysisProvider: OpenAiAnalysisProvider,
        claudeAnalysisProvider: ClaudeAnalysisProvider
      ) => {
        return appConfig.fallback.provider === "openai"
          ? openAiAnalysisProvider
          : claudeAnalysisProvider;
      },
      inject: [OpenAiAnalysisProvider, ClaudeAnalysisProvider]
    },
    {
      provide: ANALYSIS_PROVIDER,
      useFactory: (
        fallbackAnalysisProvider: FallbackAnalysisProvider,
        primaryProvider: AnalysisProvider
      ) => {
        if (
          appConfig.fallback.enabled &&
          appConfig.aiProvider !== appConfig.fallback.provider
        ) {
          return fallbackAnalysisProvider;
        }

        return primaryProvider;
      },
      inject: [FallbackAnalysisProvider, "PRIMARY_ANALYSIS_PROVIDER"]
    }
  ],
  exports: [AnalyzeUseCase]
})
export class AnalyzeModule {}