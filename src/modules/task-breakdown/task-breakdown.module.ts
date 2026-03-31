import { Module } from "@nestjs/common";
import { TaskBreakdownController } from "./entrypoints/task-breakdown.controller";
import { TaskBreakdownUseCase } from "./application/use-cases/task-breakdown.use-case";
import { TASK_BREAKDOWN_HANDLER } from "./application/tokens/task-breakdown-handler.token";
import { OpenAiTaskBreakdownProvider } from "./infrastructure/openai-task-breakdown.provider";
import { TASK_BREAKDOWN_PROVIDER } from "./application/tokens/task-breakdown-provider.token";
import { AiModule } from "../../shared/ai/ai.module";

@Module({
  imports: [AiModule],
  controllers: [TaskBreakdownController],
  providers: [
    TaskBreakdownUseCase,
    {
      provide: TASK_BREAKDOWN_HANDLER,
      useExisting: TaskBreakdownUseCase
    },
    OpenAiTaskBreakdownProvider,
    {
      provide: TASK_BREAKDOWN_PROVIDER,
      useExisting: OpenAiTaskBreakdownProvider
    }
  ],
  exports: [TaskBreakdownUseCase]
})
export class TaskBreakdownModule {}
