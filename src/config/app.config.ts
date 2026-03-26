import "dotenv/config";
import { EnvSchema } from "./env.schema";

const parsedEnv = EnvSchema.parse(process.env);

export const appConfig = {
  port: parsedEnv.PORT,
  nodeEnv: parsedEnv.NODE_ENV,
  openai: {
    apiKey: parsedEnv.OPENAI_API_KEY,
    model: parsedEnv.OPENAI_MODEL,
    timeoutMs: parsedEnv.OPENAI_TIMEOUT_MS,
    maxAttempts: parsedEnv.OPENAI_MAX_ATTEMPTS
  }
};
