export type AiProviderName = "openai" | "claude";

export type AiRuntimeConfig = {
  primaryProvider: AiProviderName;
  openai: {
    apiKey: string;
    model: string;
    timeoutMs: number;
    maxAttempts: number;
  };
};
