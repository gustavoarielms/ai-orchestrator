import { Module } from "@nestjs/common";
import { RefinementController } from "./entrypoints/refinement.controller";
import { RefineUseCase } from "./application/use-cases/refine.use-case";
import { OpenAiRefinementProvider } from "./infrastructure/openai-refinement.provider";
import { ClaudeRefinementProvider } from "./infrastructure/claude-refinement.provider";
import { FallbackRefinementProvider } from "./infrastructure/fallback-refinement.provider";
import { REFINEMENT_PROVIDER } from "./application/tokens/refinement-provider.token";
import { ResilienceModule } from "../../shared/resilience/resilience.module";
import { AiModule } from "../../shared/ai/ai.module";
import { createAiProviderSet } from "../../shared/ai/providers/create-ai-provider-set";
import { RefinementProvider } from "./application/ports/refinement.provider";

@Module({
  imports: [ResilienceModule, AiModule],
  controllers: [RefinementController],
  providers: [
    RefineUseCase,
    OpenAiRefinementProvider,
    ClaudeRefinementProvider,
    FallbackRefinementProvider,
    ...createAiProviderSet<RefinementProvider, FallbackRefinementProvider>({
      featureToken: REFINEMENT_PROVIDER,
      primaryToken: "PRIMARY_REFINEMENT_PROVIDER",
      fallbackToken: "FALLBACK_REFINEMENT_PROVIDER",
      openAiProvider: OpenAiRefinementProvider,
      claudeProvider: ClaudeRefinementProvider,
      fallbackProvider: FallbackRefinementProvider
    })
  ],
  exports: [RefineUseCase]
})
export class RefinementModule {}
