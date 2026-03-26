export type AiProviderName = "openai" | "claude";

export type AiRuntimeConfig = {
  primaryProvider: AiProviderName;
  fallbackEnabled: boolean;
  fallbackProvider: AiProviderName;
  openai: {
    apiKey: string;
    model: string;
    timeoutMs: number;
    maxAttempts: number;
  };
};
