import "dotenv/config";
import { EnvSchema } from "./env.schema";

const parsedEnv = EnvSchema.parse(process.env);

export const appConfig = {
  port: parsedEnv.PORT,
  nodeEnv: parsedEnv.NODE_ENV,
  aiProvider: parsedEnv.AI_PROVIDER,
  fallback: {
    enabled: parsedEnv.AI_FALLBACK_ENABLED,
    provider: parsedEnv.AI_FALLBACK_PROVIDER
  },
  openai: {
    apiKey: parsedEnv.OPENAI_API_KEY,
    model: parsedEnv.OPENAI_MODEL,
    timeoutMs: parsedEnv.OPENAI_TIMEOUT_MS,
    maxAttempts: parsedEnv.OPENAI_MAX_ATTEMPTS
  }
};