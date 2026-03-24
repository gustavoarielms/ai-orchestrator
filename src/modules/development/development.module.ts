import { Module } from "@nestjs/common";
import { DevelopmentController } from "./entrypoints/development.controller";
import { DevelopmentUseCase } from "./application/use-cases/development.use-case";
import { OpenAiDevelopmentProvider } from "./infrastructure/openai-development.provider";
import { ClaudeDevelopmentProvider } from "./infrastructure/claude-development.provider";
import { FallbackDevelopmentProvider } from "./infrastructure/fallback-development.provider";
import { DEVELOPMENT_PROVIDER } from "./application/tokens/development-provider.token";
import { ResilienceModule } from "../../shared/resilience/resilience.module";
import { AiModule } from "../../shared/ai/ai.module";
import { AiProviderResolver } from "../../shared/ai/providers/ai-provider-resolver";

@Module({
  imports: [ResilienceModule, AiModule],
  controllers: [DevelopmentController],
  providers: [
    DevelopmentUseCase,
    OpenAiDevelopmentProvider,
    ClaudeDevelopmentProvider,
    FallbackDevelopmentProvider,
    {
      provide: "PRIMARY_DEVELOPMENT_PROVIDER",
      useFactory: (
        aiProviderResolver: AiProviderResolver,
        openAiDevelopmentProvider: OpenAiDevelopmentProvider,
        claudeDevelopmentProvider: ClaudeDevelopmentProvider
      ) => {
        return aiProviderResolver.resolvePrimary({
          openai: openAiDevelopmentProvider,
          claude: claudeDevelopmentProvider
        });
      },
      inject: [
        AiProviderResolver,
        OpenAiDevelopmentProvider,
        ClaudeDevelopmentProvider
      ]
    },
    {
      provide: "FALLBACK_DEVELOPMENT_PROVIDER",
      useFactory: (
        aiProviderResolver: AiProviderResolver,
        openAiDevelopmentProvider: OpenAiDevelopmentProvider,
        claudeDevelopmentProvider: ClaudeDevelopmentProvider
      ) => {
        return aiProviderResolver.resolveFallback({
          openai: openAiDevelopmentProvider,
          claude: claudeDevelopmentProvider
        });
      },
      inject: [
        AiProviderResolver,
        OpenAiDevelopmentProvider,
        ClaudeDevelopmentProvider
      ]
    },
    {
      provide: DEVELOPMENT_PROVIDER,
      useFactory: (
        aiProviderResolver: AiProviderResolver,
        fallbackDevelopmentProvider: FallbackDevelopmentProvider,
        primaryProvider:
          | OpenAiDevelopmentProvider
          | ClaudeDevelopmentProvider
      ) => {
        if (aiProviderResolver.shouldUseFallback()) {
          return fallbackDevelopmentProvider;
        }

        return primaryProvider;
      },
      inject: [
        AiProviderResolver,
        FallbackDevelopmentProvider,
        "PRIMARY_DEVELOPMENT_PROVIDER"
      ]
    }
  ],
  exports: [DevelopmentUseCase]
})
export class DevelopmentModule {}
