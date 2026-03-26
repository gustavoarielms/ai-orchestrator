import { Global, Module } from "@nestjs/common";
import { appConfig } from "../../config/app.config";
import { createOpenAiClient } from "../openai/openai.client";
import { OPENAI_CLIENT } from "../openai/tokens/openai-client.token";
import { AI_RUNTIME_CONFIG } from "./tokens/ai-runtime-config.token";
import { OpenAiStructuredExecutor } from "./openai/openai-structured-executor";
import { AiRuntimeConfig } from "./ai-runtime-config.types";

@Global()
@Module({
  providers: [
    {
      provide: AI_RUNTIME_CONFIG,
      useValue: <AiRuntimeConfig>{
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
      useFactory: (aiRuntimeConfig: AiRuntimeConfig) =>
        createOpenAiClient(aiRuntimeConfig),
      inject: [AI_RUNTIME_CONFIG]
    },
    OpenAiStructuredExecutor
  ],
  exports: [AI_RUNTIME_CONFIG, OPENAI_CLIENT, OpenAiStructuredExecutor]
})
export class AiModule {}
