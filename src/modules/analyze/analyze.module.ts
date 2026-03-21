import { Module } from "@nestjs/common";
import { AnalyzeController } from "./entrypoints/analyze.controller";
import { AnalyzeUseCase } from "./application/use-cases/analyze.use-case";
import { OpenAiAnalysisProvider } from "./infrastructure/openai-analysis.provider";
import { ClaudeAnalysisProvider } from "./infrastructure/claude-analysis.provider";
import { ANALYSIS_PROVIDER } from "./application/tokens/analysis-provider.token";
import { MetricsModule } from "../../shared/metrics/metrics.module";
import { appConfig } from "../../config/app.config";

@Module({
  imports: [MetricsModule],
  controllers: [AnalyzeController],
  providers: [
    AnalyzeUseCase,
    OpenAiAnalysisProvider,
    ClaudeAnalysisProvider,
    {
      provide: ANALYSIS_PROVIDER,
      useFactory: (
        openAiAnalysisProvider: OpenAiAnalysisProvider,
        claudeAnalysisProvider: ClaudeAnalysisProvider
      ) => {
        if (appConfig.aiProvider === "claude") {
          return claudeAnalysisProvider;
        }

        return openAiAnalysisProvider;
      },
      inject: [OpenAiAnalysisProvider, ClaudeAnalysisProvider]
    }
  ],
  exports: [AnalyzeUseCase]
})
export class AnalyzeModule {}