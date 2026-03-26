import { Provider, Type } from "@nestjs/common";
import { AiProviderResolver } from "./ai-provider-resolver";

type CreateAiProviderSetParams<TPrimary, TFallback> = {
  featureToken: string;
  primaryToken: string;
  fallbackToken: string;
  openAiProvider: Type<TPrimary>;
  claudeProvider: Type<TPrimary>;
  fallbackProvider: Type<TFallback>;
};

export function createAiProviderSet<TPrimary, TFallback>({
  featureToken,
  primaryToken,
  fallbackToken,
  openAiProvider,
  claudeProvider,
  fallbackProvider
}: CreateAiProviderSetParams<TPrimary, TFallback>): Provider[] {
  return [
    {
      provide: primaryToken,
      useFactory: (
        aiProviderResolver: AiProviderResolver,
        openAiInstance: TPrimary,
        claudeInstance: TPrimary
      ) => {
        return aiProviderResolver.resolvePrimary({
          openai: openAiInstance,
          claude: claudeInstance
        });
      },
      inject: [AiProviderResolver, openAiProvider, claudeProvider]
    },
    {
      provide: fallbackToken,
      useFactory: (
        aiProviderResolver: AiProviderResolver,
        openAiInstance: TPrimary,
        claudeInstance: TPrimary
      ) => {
        return aiProviderResolver.resolveFallback({
          openai: openAiInstance,
          claude: claudeInstance
        });
      },
      inject: [AiProviderResolver, openAiProvider, claudeProvider]
    },
    {
      provide: featureToken,
      useFactory: (
        aiProviderResolver: AiProviderResolver,
        fallbackInstance: TFallback,
        primaryInstance: TPrimary
      ) => {
        if (aiProviderResolver.shouldUseFallback()) {
          return fallbackInstance;
        }

        return primaryInstance;
      },
      inject: [AiProviderResolver, fallbackProvider, primaryToken]
    }
  ];
}
