import { Module } from "@nestjs/common";
import { DevelopmentController } from "./entrypoints/development.controller";
import { DevelopmentUseCase } from "./application/use-cases/development.use-case";
import { OpenAiDevelopmentProvider } from "./infrastructure/openai-development.provider";
import { ClaudeDevelopmentProvider } from "./infrastructure/claude-development.provider";
import { FallbackDevelopmentProvider } from "./infrastructure/fallback-development.provider";
import { DEVELOPMENT_PROVIDER } from "./application/tokens/development-provider.token";
import { ResilienceModule } from "../../shared/resilience/resilience.module";
import { AiModule } from "../../shared/ai/ai.module";
import { createAiProviderSet } from "../../shared/ai/providers/create-ai-provider-set";
import { DevelopmentProvider } from "./application/ports/development.provider";

@Module({
  imports: [ResilienceModule, AiModule],
  controllers: [DevelopmentController],
  providers: [
    DevelopmentUseCase,
    OpenAiDevelopmentProvider,
    ClaudeDevelopmentProvider,
    FallbackDevelopmentProvider,
    ...createAiProviderSet<DevelopmentProvider, FallbackDevelopmentProvider>({
      featureToken: DEVELOPMENT_PROVIDER,
      primaryToken: "PRIMARY_DEVELOPMENT_PROVIDER",
      fallbackToken: "FALLBACK_DEVELOPMENT_PROVIDER",
      openAiProvider: OpenAiDevelopmentProvider,
      claudeProvider: ClaudeDevelopmentProvider,
      fallbackProvider: FallbackDevelopmentProvider
    })
  ],
  exports: [DevelopmentUseCase]
})
export class DevelopmentModule {}
