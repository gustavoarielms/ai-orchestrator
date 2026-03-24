import { Module } from "@nestjs/common";
import { TechnicalDesignController } from "./entrypoints/technical-design.controller";
import { TechnicalDesignUseCase } from "./application/use-cases/technical-design.use-case";
import { OpenAiTechnicalDesignProvider } from "./infrastructure/openai-technical-design.provider";
import { ClaudeTechnicalDesignProvider } from "./infrastructure/claude-technical-design.provider";
import { FallbackTechnicalDesignProvider } from "./infrastructure/fallback-technical-design.provider";
import { TECHNICAL_DESIGN_PROVIDER } from "./application/tokens/technical-design-provider.token";
import { ResilienceModule } from "../../shared/resilience/resilience.module";
import { AiModule } from "../../shared/ai/ai.module";
import { AiProviderResolver } from "../../shared/ai/providers/ai-provider-resolver";

@Module({
  imports: [ResilienceModule, AiModule],
  controllers: [TechnicalDesignController],
  providers: [
    TechnicalDesignUseCase,
    OpenAiTechnicalDesignProvider,
    ClaudeTechnicalDesignProvider,
    FallbackTechnicalDesignProvider,
    {
      provide: "PRIMARY_TECHNICAL_DESIGN_PROVIDER",
      useFactory: (
        aiProviderResolver: AiProviderResolver,
        openAiTechnicalDesignProvider: OpenAiTechnicalDesignProvider,
        claudeTechnicalDesignProvider: ClaudeTechnicalDesignProvider
      ) => {
        return aiProviderResolver.resolvePrimary({
          openai: openAiTechnicalDesignProvider,
          claude: claudeTechnicalDesignProvider
        });
      },
      inject: [
        AiProviderResolver,
        OpenAiTechnicalDesignProvider,
        ClaudeTechnicalDesignProvider
      ]
    },
    {
      provide: "FALLBACK_TECHNICAL_DESIGN_PROVIDER",
      useFactory: (
        aiProviderResolver: AiProviderResolver,
        openAiTechnicalDesignProvider: OpenAiTechnicalDesignProvider,
        claudeTechnicalDesignProvider: ClaudeTechnicalDesignProvider
      ) => {
        return aiProviderResolver.resolveFallback({
          openai: openAiTechnicalDesignProvider,
          claude: claudeTechnicalDesignProvider
        });
      },
      inject: [
        AiProviderResolver,
        OpenAiTechnicalDesignProvider,
        ClaudeTechnicalDesignProvider
      ]
    },
    {
      provide: TECHNICAL_DESIGN_PROVIDER,
      useFactory: (
        aiProviderResolver: AiProviderResolver,
        fallbackTechnicalDesignProvider: FallbackTechnicalDesignProvider,
        primaryProvider:
          | OpenAiTechnicalDesignProvider
          | ClaudeTechnicalDesignProvider
      ) => {
        if (aiProviderResolver.shouldUseFallback()) {
          return fallbackTechnicalDesignProvider;
        }

        return primaryProvider;
      },
      inject: [
        AiProviderResolver,
        FallbackTechnicalDesignProvider,
        "PRIMARY_TECHNICAL_DESIGN_PROVIDER"
      ]
    }
  ],
  exports: [TechnicalDesignUseCase]
})
export class TechnicalDesignModule {}
