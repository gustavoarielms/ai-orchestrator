import { Provider, Type } from "@nestjs/common";
import { AiProviderResolver } from "./ai-provider-resolver";

type CreateAiProviderSetParams<TProvider> = {
  featureToken: string;
  openAiProvider: Type<TProvider>;
  claudeProvider: Type<TProvider>;
};

export function createAiProviderSet<TProvider>({
  featureToken,
  openAiProvider,
  claudeProvider
}: CreateAiProviderSetParams<TProvider>): Provider[] {
  return [
    {
      provide: featureToken,
      useFactory: (
        aiProviderResolver: AiProviderResolver,
        openAiInstance: TProvider,
        claudeInstance: TProvider
      ) => {
        return aiProviderResolver.resolvePrimary({
          openai: openAiInstance,
          claude: claudeInstance
        });
      },
      inject: [AiProviderResolver, openAiProvider, claudeProvider]
    }
  ];
}
