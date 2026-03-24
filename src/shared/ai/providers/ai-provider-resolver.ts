import { Injectable } from "@nestjs/common";
import { appConfig } from "../../../config/app.config";

@Injectable()
export class AiProviderResolver {
  resolvePrimary<T>(providers: { openai: T; claude: T }): T {
    return appConfig.aiProvider === "claude"
      ? providers.claude
      : providers.openai;
  }

  resolveFallback<T>(providers: { openai: T; claude: T }): T {
    return appConfig.fallback.provider === "openai"
      ? providers.openai
      : providers.claude;
  }

  shouldUseFallback(): boolean {
    return (
      appConfig.fallback.enabled &&
      appConfig.aiProvider !== appConfig.fallback.provider
    );
  }
}
