import { Inject, Injectable } from "@nestjs/common";
import { AI_RUNTIME_CONFIG } from "../tokens/ai-runtime-config.token";
import { AiRuntimeConfig } from "../ai-runtime-config.types";

@Injectable()
export class AiProviderResolver {
  constructor(
    @Inject(AI_RUNTIME_CONFIG)
    private readonly aiRuntimeConfig: AiRuntimeConfig
  ) {}

  resolvePrimary<T>(providers: { openai: T; claude: T }): T {
    return this.aiRuntimeConfig.primaryProvider === "claude"
      ? providers.claude
      : providers.openai;
  }

  resolveFallback<T>(providers: { openai: T; claude: T }): T {
    return this.aiRuntimeConfig.fallbackProvider === "openai"
      ? providers.openai
      : providers.claude;
  }

  shouldUseFallback(): boolean {
    return (
      this.aiRuntimeConfig.fallbackEnabled &&
      this.aiRuntimeConfig.primaryProvider !== this.aiRuntimeConfig.fallbackProvider
    );
  }
}
