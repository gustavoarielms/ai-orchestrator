export type AiRuntimeConfig = {
  openai: {
    apiKey: string;
    model: string;
    timeoutMs: number;
    maxAttempts: number;
  };
};
