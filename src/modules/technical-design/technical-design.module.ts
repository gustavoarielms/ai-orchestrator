import { Module } from "@nestjs/common";
import { TechnicalDesignController } from "./entrypoints/technical-design.controller";
import { TechnicalDesignUseCase } from "./application/use-cases/technical-design.use-case";
import { OpenAiTechnicalDesignProvider } from "./infrastructure/openai-technical-design.provider";
import { ClaudeTechnicalDesignProvider } from "./infrastructure/claude-technical-design.provider";
import { FallbackTechnicalDesignProvider } from "./infrastructure/fallback-technical-design.provider";
import { TECHNICAL_DESIGN_PROVIDER } from "./application/tokens/technical-design-provider.token";
import { ResilienceModule } from "../../shared/resilience/resilience.module";
import { AiModule } from "../../shared/ai/ai.module";
import { createAiProviderSet } from "../../shared/ai/providers/create-ai-provider-set";
import { TechnicalDesignProvider } from "./application/ports/technical-design.provider";

@Module({
  imports: [ResilienceModule, AiModule],
  controllers: [TechnicalDesignController],
  providers: [
    TechnicalDesignUseCase,
    OpenAiTechnicalDesignProvider,
    ClaudeTechnicalDesignProvider,
    FallbackTechnicalDesignProvider,
    ...createAiProviderSet<
      TechnicalDesignProvider,
      FallbackTechnicalDesignProvider
    >({
      featureToken: TECHNICAL_DESIGN_PROVIDER,
      primaryToken: "PRIMARY_TECHNICAL_DESIGN_PROVIDER",
      fallbackToken: "FALLBACK_TECHNICAL_DESIGN_PROVIDER",
      openAiProvider: OpenAiTechnicalDesignProvider,
      claudeProvider: ClaudeTechnicalDesignProvider,
      fallbackProvider: FallbackTechnicalDesignProvider
    })
  ],
  exports: [TechnicalDesignUseCase]
})
export class TechnicalDesignModule {}
