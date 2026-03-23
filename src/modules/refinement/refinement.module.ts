import { Module } from "@nestjs/common";
import { RefinementController } from "./entrypoints/refinement.controller";
import { RefineUseCase } from "./application/use-cases/refine.use-case";
import { OpenAiRefinementProvider } from "./infrastructure/openai-refinement.provider";
import { ClaudeRefinementProvider } from "./infrastructure/claude-refinement.provider";
import { FallbackRefinementProvider } from "./infrastructure/fallback-refinement.provider";
import { REFINEMENT_PROVIDER } from "./application/tokens/refinement-provider.token";
import { appConfig } from "../../config/app.config";
import { ResilienceModule } from "../../shared/resilience/resilience.module";
import { OpenAiStructuredExecutor } from "../../shared/ai/openai/openai-structured-executor";

@Module({
  imports: [ResilienceModule],
  controllers: [RefinementController],
  providers: [
    RefineUseCase,
    OpenAiStructuredExecutor,
    OpenAiRefinementProvider,
    ClaudeRefinementProvider,
    FallbackRefinementProvider,
    {
      provide: "PRIMARY_REFINEMENT_PROVIDER",
      useFactory: (
        openAiRefinementProvider: OpenAiRefinementProvider,
        claudeRefinementProvider: ClaudeRefinementProvider
      ) => {
        return appConfig.aiProvider === "claude"
          ? claudeRefinementProvider
          : openAiRefinementProvider;
      },
      inject: [OpenAiRefinementProvider, ClaudeRefinementProvider]
    },
    {
      provide: "FALLBACK_REFINEMENT_PROVIDER",
      useFactory: (
        openAiRefinementProvider: OpenAiRefinementProvider,
        claudeRefinementProvider: ClaudeRefinementProvider
      ) => {
        return appConfig.fallback.provider === "openai"
          ? openAiRefinementProvider
          : claudeRefinementProvider;
      },
      inject: [OpenAiRefinementProvider, ClaudeRefinementProvider]
    },
    {
      provide: REFINEMENT_PROVIDER,
      useFactory: (
        fallbackRefinementProvider: FallbackRefinementProvider,
        primaryProvider: OpenAiRefinementProvider | ClaudeRefinementProvider
      ) => {
        if (
          appConfig.fallback.enabled &&
          appConfig.aiProvider !== appConfig.fallback.provider
        ) {
          return fallbackRefinementProvider;
        }

        return primaryProvider;
      },
      inject: [FallbackRefinementProvider, "PRIMARY_REFINEMENT_PROVIDER"]
    }
  ],
  exports: [RefineUseCase]
})
export class RefinementModule {}