import { Module } from "@nestjs/common";
import { TaskBreakdownController } from "./entrypoints/task-breakdown.controller";
import { TaskBreakdownUseCase } from "./application/use-cases/task-breakdown.use-case";
import { OpenAiTaskBreakdownProvider } from "./infrastructure/openai-task-breakdown.provider";
import { ClaudeTaskBreakdownProvider } from "./infrastructure/claude-task-breakdown.provider";
import { FallbackTaskBreakdownProvider } from "./infrastructure/fallback-task-breakdown.provider";
import { TASK_BREAKDOWN_PROVIDER } from "./application/tokens/task-breakdown-provider.token";
import { ResilienceModule } from "../../shared/resilience/resilience.module";
import { AiModule } from "../../shared/ai/ai.module";
import { AiProviderResolver } from "../../shared/ai/providers/ai-provider-resolver";

@Module({
  imports: [ResilienceModule, AiModule],
  controllers: [TaskBreakdownController],
  providers: [
    TaskBreakdownUseCase,
    OpenAiTaskBreakdownProvider,
    ClaudeTaskBreakdownProvider,
    FallbackTaskBreakdownProvider,
    {
      provide: "PRIMARY_TASK_BREAKDOWN_PROVIDER",
      useFactory: (
        aiProviderResolver: AiProviderResolver,
        openAiTaskBreakdownProvider: OpenAiTaskBreakdownProvider,
        claudeTaskBreakdownProvider: ClaudeTaskBreakdownProvider
      ) => {
        return aiProviderResolver.resolvePrimary({
          openai: openAiTaskBreakdownProvider,
          claude: claudeTaskBreakdownProvider
        });
      },
      inject: [
        AiProviderResolver,
        OpenAiTaskBreakdownProvider,
        ClaudeTaskBreakdownProvider
      ]
    },
    {
      provide: "FALLBACK_TASK_BREAKDOWN_PROVIDER",
      useFactory: (
        aiProviderResolver: AiProviderResolver,
        openAiTaskBreakdownProvider: OpenAiTaskBreakdownProvider,
        claudeTaskBreakdownProvider: ClaudeTaskBreakdownProvider
      ) => {
        return aiProviderResolver.resolveFallback({
          openai: openAiTaskBreakdownProvider,
          claude: claudeTaskBreakdownProvider
        });
      },
      inject: [
        AiProviderResolver,
        OpenAiTaskBreakdownProvider,
        ClaudeTaskBreakdownProvider
      ]
    },
    {
      provide: TASK_BREAKDOWN_PROVIDER,
      useFactory: (
        aiProviderResolver: AiProviderResolver,
        fallbackTaskBreakdownProvider: FallbackTaskBreakdownProvider,
        primaryProvider:
          | OpenAiTaskBreakdownProvider
          | ClaudeTaskBreakdownProvider
      ) => {
        if (aiProviderResolver.shouldUseFallback()) {
          return fallbackTaskBreakdownProvider;
        }

        return primaryProvider;
      },
      inject: [
        AiProviderResolver,
        FallbackTaskBreakdownProvider,
        "PRIMARY_TASK_BREAKDOWN_PROVIDER"
      ]
    }
  ],
  exports: [TaskBreakdownUseCase]
})
export class TaskBreakdownModule {}
