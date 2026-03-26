import { Module } from "@nestjs/common";
import { TechnicalDesignController } from "./entrypoints/technical-design.controller";
import { TechnicalDesignUseCase } from "./application/use-cases/technical-design.use-case";
import { OpenAiTechnicalDesignProvider } from "./infrastructure/openai-technical-design.provider";
import { ClaudeTechnicalDesignProvider } from "./infrastructure/claude-technical-design.provider";
import { TECHNICAL_DESIGN_PROVIDER } from "./application/tokens/technical-design-provider.token";
import { AiModule } from "../../shared/ai/ai.module";
import { createAiProviderSet } from "../../shared/ai/providers/create-ai-provider-set";

@Module({
  imports: [AiModule],
  controllers: [TechnicalDesignController],
  providers: [
    TechnicalDesignUseCase,
    OpenAiTechnicalDesignProvider,
    ClaudeTechnicalDesignProvider,
    ...createAiProviderSet({
      featureToken: TECHNICAL_DESIGN_PROVIDER,
      openAiProvider: OpenAiTechnicalDesignProvider,
      claudeProvider: ClaudeTechnicalDesignProvider
    })
  ],
  exports: [TechnicalDesignUseCase]
})
export class TechnicalDesignModule {}
