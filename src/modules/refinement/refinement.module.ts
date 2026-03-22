import { Module } from "@nestjs/common";
import { RefinementController } from "./entrypoints/refinement.controller";
import { RefineUseCase } from "./application/use-cases/refine.use-case";
import { OpenAiRefinementProvider } from "./infrastructure/openai-refinement.provider";
import { REFINEMENT_PROVIDER } from "./application/tokens/refinement-provider.token";

@Module({
  controllers: [RefinementController],
  providers: [
    RefineUseCase,
    OpenAiRefinementProvider,
    {
      provide: REFINEMENT_PROVIDER,
      useExisting: OpenAiRefinementProvider
    }
  ]
})
export class RefinementModule {}