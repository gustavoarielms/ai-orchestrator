import { Module } from "@nestjs/common";
import { RefinementController } from "./entrypoints/refinement.controller";
import { RefineUseCase } from "./application/use-cases/refine.use-case";
import { OpenAiRefinementProvider } from "./infrastructure/openai-refinement.provider";
import { ClaudeRefinementProvider } from "./infrastructure/claude-refinement.provider";
import { REFINEMENT_PROVIDER } from "./application/tokens/refinement-provider.token";
import { AiModule } from "../../shared/ai/ai.module";
import { createAiProviderSet } from "../../shared/ai/providers/create-ai-provider-set";

@Module({
  imports: [AiModule],
  controllers: [RefinementController],
  providers: [
    RefineUseCase,
    OpenAiRefinementProvider,
    ClaudeRefinementProvider,
    ...createAiProviderSet({
      featureToken: REFINEMENT_PROVIDER,
      openAiProvider: OpenAiRefinementProvider,
      claudeProvider: ClaudeRefinementProvider
    })
  ],
  exports: [RefineUseCase]
})
export class RefinementModule {}
