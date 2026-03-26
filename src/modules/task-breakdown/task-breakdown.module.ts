import { Module } from "@nestjs/common";
import { TaskBreakdownController } from "./entrypoints/task-breakdown.controller";
import { TaskBreakdownUseCase } from "./application/use-cases/task-breakdown.use-case";
import { OpenAiTaskBreakdownProvider } from "./infrastructure/openai-task-breakdown.provider";
import { ClaudeTaskBreakdownProvider } from "./infrastructure/claude-task-breakdown.provider";
import { FallbackTaskBreakdownProvider } from "./infrastructure/fallback-task-breakdown.provider";
import { TASK_BREAKDOWN_PROVIDER } from "./application/tokens/task-breakdown-provider.token";
import { ResilienceModule } from "../../shared/resilience/resilience.module";
import { AiModule } from "../../shared/ai/ai.module";
import { createAiProviderSet } from "../../shared/ai/providers/create-ai-provider-set";
import { TaskBreakdownProvider } from "./application/ports/task-breakdown.provider";

@Module({
  imports: [ResilienceModule, AiModule],
  controllers: [TaskBreakdownController],
  providers: [
    TaskBreakdownUseCase,
    OpenAiTaskBreakdownProvider,
    ClaudeTaskBreakdownProvider,
    FallbackTaskBreakdownProvider,
    ...createAiProviderSet<TaskBreakdownProvider, FallbackTaskBreakdownProvider>({
      featureToken: TASK_BREAKDOWN_PROVIDER,
      primaryToken: "PRIMARY_TASK_BREAKDOWN_PROVIDER",
      fallbackToken: "FALLBACK_TASK_BREAKDOWN_PROVIDER",
      openAiProvider: OpenAiTaskBreakdownProvider,
      claudeProvider: ClaudeTaskBreakdownProvider,
      fallbackProvider: FallbackTaskBreakdownProvider
    })
  ],
  exports: [TaskBreakdownUseCase]
})
export class TaskBreakdownModule {}
