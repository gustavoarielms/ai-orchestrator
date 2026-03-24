import { Module } from "@nestjs/common";
import { RefinementController } from "./entrypoints/refinement.controller";
import { RefineUseCase } from "./application/use-cases/refine.use-case";
import { OpenAiRefinementProvider } from "./infrastructure/openai-refinement.provider";
import { ClaudeRefinementProvider } from "./infrastructure/claude-refinement.provider";
import { FallbackRefinementProvider } from "./infrastructure/fallback-refinement.provider";
import { REFINEMENT_PROVIDER } from "./application/tokens/refinement-provider.token";
import { ResilienceModule } from "../../shared/resilience/resilience.module";
import { AiModule } from "../../shared/ai/ai.module";
import { AiProviderResolver } from "../../shared/ai/providers/ai-provider-resolver";

@Module({
  imports: [ResilienceModule, AiModule],
  controllers: [RefinementController],
  providers: [
    RefineUseCase,
    OpenAiRefinementProvider,
    ClaudeRefinementProvider,
    FallbackRefinementProvider,
    {
      provide: "PRIMARY_REFINEMENT_PROVIDER",
      useFactory: (
        aiProviderResolver: AiProviderResolver,
        openAiRefinementProvider: OpenAiRefinementProvider,
        claudeRefinementProvider: ClaudeRefinementProvider
      ) => {
        return aiProviderResolver.resolvePrimary({
          openai: openAiRefinementProvider,
          claude: claudeRefinementProvider
        });
      },
      inject: [
        AiProviderResolver,
        OpenAiRefinementProvider,
        ClaudeRefinementProvider
      ]
    },
    {
      provide: "FALLBACK_REFINEMENT_PROVIDER",
      useFactory: (
        aiProviderResolver: AiProviderResolver,
        openAiRefinementProvider: OpenAiRefinementProvider,
        claudeRefinementProvider: ClaudeRefinementProvider
      ) => {
        return aiProviderResolver.resolveFallback({
          openai: openAiRefinementProvider,
          claude: claudeRefinementProvider
        });
      },
      inject: [
        AiProviderResolver,
        OpenAiRefinementProvider,
        ClaudeRefinementProvider
      ]
    },
    {
      provide: REFINEMENT_PROVIDER,
      useFactory: (
        aiProviderResolver: AiProviderResolver,
        fallbackRefinementProvider: FallbackRefinementProvider,
        primaryProvider: OpenAiRefinementProvider | ClaudeRefinementProvider
      ) => {
        if (aiProviderResolver.shouldUseFallback()) {
          return fallbackRefinementProvider;
        }

        return primaryProvider;
      },
      inject: [
        AiProviderResolver,
        FallbackRefinementProvider,
        "PRIMARY_REFINEMENT_PROVIDER"
      ]
    }
  ],
  exports: [RefineUseCase]
})
export class RefinementModule {}
