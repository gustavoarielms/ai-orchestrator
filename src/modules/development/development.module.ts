import { Module } from "@nestjs/common";
import { DevelopmentController } from "./entrypoints/development.controller";
import { DevelopmentUseCase } from "./application/use-cases/development.use-case";
import { OpenAiDevelopmentProvider } from "./infrastructure/openai-development.provider";
import { ClaudeDevelopmentProvider } from "./infrastructure/claude-development.provider";
import { DEVELOPMENT_PROVIDER } from "./application/tokens/development-provider.token";
import { AiModule } from "../../shared/ai/ai.module";
import { createAiProviderSet } from "../../shared/ai/providers/create-ai-provider-set";

@Module({
  imports: [AiModule],
  controllers: [DevelopmentController],
  providers: [
    DevelopmentUseCase,
    OpenAiDevelopmentProvider,
    ClaudeDevelopmentProvider,
    ...createAiProviderSet({
      featureToken: DEVELOPMENT_PROVIDER,
      openAiProvider: OpenAiDevelopmentProvider,
      claudeProvider: ClaudeDevelopmentProvider
    })
  ],
  exports: [DevelopmentUseCase]
})
export class DevelopmentModule {}
