import { Module } from "@nestjs/common";
import { DevelopmentController } from "./entrypoints/development.controller";
import { DevelopmentUseCase } from "./application/use-cases/development.use-case";
import { DEVELOPMENT_HANDLER } from "./application/tokens/development-handler.token";
import { OpenAiDevelopmentProvider } from "./infrastructure/openai-development.provider";
import { DEVELOPMENT_PROVIDER } from "./application/tokens/development-provider.token";
import { AiModule } from "../../shared/ai/ai.module";

@Module({
  imports: [AiModule],
  controllers: [DevelopmentController],
  providers: [
    DevelopmentUseCase,
    {
      provide: DEVELOPMENT_HANDLER,
      useExisting: DevelopmentUseCase
    },
    OpenAiDevelopmentProvider,
    {
      provide: DEVELOPMENT_PROVIDER,
      useExisting: OpenAiDevelopmentProvider
    }
  ],
  exports: [DevelopmentUseCase]
})
export class DevelopmentModule {}
