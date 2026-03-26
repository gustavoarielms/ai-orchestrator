import { Global, Module } from "@nestjs/common";
import { appConfig } from "../../config/app.config";
import { createOpenAiClient } from "../openai/openai.client";
import { OPENAI_CLIENT } from "../openai/tokens/openai-client.token";
import { AI_RUNTIME_CONFIG } from "./tokens/ai-runtime-config.token";
import { AiProviderResolver } from "./providers/ai-provider-resolver";
import { OpenAiStructuredExecutor } from "./openai/openai-structured-executor";

@Global()
@Module({
  providers: [
    {
      provide: AI_RUNTIME_CONFIG,
      useValue: {
        primaryProvider: appConfig.aiProvider,
        openai: {
          apiKey: appConfig.openai.apiKey,
          model: appConfig.openai.model,
          timeoutMs: appConfig.openai.timeoutMs,
          maxAttempts: appConfig.openai.maxAttempts
        }
      }
    },
    {
      provide: OPENAI_CLIENT,
      useFactory: (aiRuntimeConfig: {
        primaryProvider: "openai" | "claude";
        openai: {
          apiKey: string;
          model: string;
          timeoutMs: number;
          maxAttempts: number;
        };
      }) => createOpenAiClient(aiRuntimeConfig),
      inject: [AI_RUNTIME_CONFIG]
    },
    AiProviderResolver,
    OpenAiStructuredExecutor
  ],
  exports: [AI_RUNTIME_CONFIG, OPENAI_CLIENT, AiProviderResolver, OpenAiStructuredExecutor]
})
export class AiModule {}
