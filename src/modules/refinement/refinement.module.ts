import { Module } from "@nestjs/common";
import { RefinementController } from "./entrypoints/refinement.controller";
import { RefineUseCase } from "./application/use-cases/refine.use-case";
import { REFINE_HANDLER } from "./application/tokens/refine-handler.token";
import { OpenAiRefinementProvider } from "./infrastructure/openai-refinement.provider";
import { REFINEMENT_PROVIDER } from "./application/tokens/refinement-provider.token";
import { AiModule } from "../../shared/ai/ai.module";

@Module({
  imports: [AiModule],
  controllers: [RefinementController],
  providers: [
    RefineUseCase,
    {
      provide: REFINE_HANDLER,
      useExisting: RefineUseCase
    },
    OpenAiRefinementProvider,
    {
      provide: REFINEMENT_PROVIDER,
      useExisting: OpenAiRefinementProvider
    }
  ],
  exports: [RefineUseCase]
})
export class RefinementModule {}
