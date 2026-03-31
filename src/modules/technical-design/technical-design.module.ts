import { Module } from "@nestjs/common";
import { TechnicalDesignController } from "./entrypoints/technical-design.controller";
import { TechnicalDesignUseCase } from "./application/use-cases/technical-design.use-case";
import { TECHNICAL_DESIGN_HANDLER } from "./application/tokens/technical-design-handler.token";
import { OpenAiTechnicalDesignProvider } from "./infrastructure/openai-technical-design.provider";
import { TECHNICAL_DESIGN_PROVIDER } from "./application/tokens/technical-design-provider.token";
import { AiModule } from "../../shared/ai/ai.module";

@Module({
  imports: [AiModule],
  controllers: [TechnicalDesignController],
  providers: [
    TechnicalDesignUseCase,
    {
      provide: TECHNICAL_DESIGN_HANDLER,
      useExisting: TechnicalDesignUseCase
    },
    OpenAiTechnicalDesignProvider,
    {
      provide: TECHNICAL_DESIGN_PROVIDER,
      useExisting: OpenAiTechnicalDesignProvider
    }
  ],
  exports: [TechnicalDesignUseCase]
})
export class TechnicalDesignModule {}
