import { Module } from "@nestjs/common";
import { TaskBreakdownController } from "./entrypoints/task-breakdown.controller";
import { TaskBreakdownUseCase } from "./application/use-cases/task-breakdown.use-case";
import { OpenAiTaskBreakdownProvider } from "./infrastructure/openai-task-breakdown.provider";
import { ClaudeTaskBreakdownProvider } from "./infrastructure/claude-task-breakdown.provider";
import { TASK_BREAKDOWN_PROVIDER } from "./application/tokens/task-breakdown-provider.token";
import { AiModule } from "../../shared/ai/ai.module";
import { createAiProviderSet } from "../../shared/ai/providers/create-ai-provider-set";

@Module({
  imports: [AiModule],
  controllers: [TaskBreakdownController],
  providers: [
    TaskBreakdownUseCase,
    OpenAiTaskBreakdownProvider,
    ClaudeTaskBreakdownProvider,
    ...createAiProviderSet({
      featureToken: TASK_BREAKDOWN_PROVIDER,
      openAiProvider: OpenAiTaskBreakdownProvider,
      claudeProvider: ClaudeTaskBreakdownProvider
    })
  ],
  exports: [TaskBreakdownUseCase]
})
export class TaskBreakdownModule {}
