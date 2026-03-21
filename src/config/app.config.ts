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
  circuitBreaker: {
    enabled: parsedEnv.AI_CIRCUIT_BREAKER_ENABLED,
    failureThreshold: parsedEnv.AI_CIRCUIT_BREAKER_FAILURE_THRESHOLD,
    resetTimeoutMs: parsedEnv.AI_CIRCUIT_BREAKER_RESET_TIMEOUT_MS
  },
  openai: {
    apiKey: parsedEnv.OPENAI_API_KEY,
    model: parsedEnv.OPENAI_MODEL,
    timeoutMs: parsedEnv.OPENAI_TIMEOUT_MS,
    maxAttempts: parsedEnv.OPENAI_MAX_ATTEMPTS
  }
};