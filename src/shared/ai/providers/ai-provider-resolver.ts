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
}
