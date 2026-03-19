import { Controller, Get, Module } from "@nestjs/common";
import { AnalyzeController } from "./modules/analyze/entrypoints/analyze.controller";
import { AnalyzeUseCase } from "./modules/analyze/application/use-cases/analyze.use-case";
import { OpenAiAnalysisProvider } from "./modules/analyze/infrastructure/openai-analysis.provider";

@Controller()
class HealthController {
  @Get("/health")
  getHealth() {
    return {
      status: "ok",
      service: "ai-orchestrator"
    };
  }
}

@Module({
  controllers: [HealthController, AnalyzeController],
  providers: [
    AnalyzeUseCase,
    OpenAiAnalysisProvider,
    {
      provide: "AnalysisProvider",
      useExisting: OpenAiAnalysisProvider
    }
  ]
})
export class AppModule {}