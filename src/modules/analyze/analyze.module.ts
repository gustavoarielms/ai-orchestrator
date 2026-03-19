import { Module } from "@nestjs/common";
import { AnalyzeController } from "./entrypoints/analyze.controller";
import { AnalyzeUseCase } from "./application/use-cases/analyze.use-case";
import { OpenAiAnalysisProvider } from "./infrastructure/openai-analysis.provider";
import { ANALYSIS_PROVIDER } from "./application/tokens/analysis-provider.token";

@Module({
  controllers: [AnalyzeController],
  providers: [
    AnalyzeUseCase,
    OpenAiAnalysisProvider,
    {
      provide: ANALYSIS_PROVIDER,
      useExisting: OpenAiAnalysisProvider
    }
  ],
  exports: [AnalyzeUseCase]
})
export class AnalyzeModule {}