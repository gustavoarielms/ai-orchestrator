import { z } from "zod";

export const EnvSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.string().default("development"),
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_MODEL: z.string().default("gpt-5.4"),
  OPENAI_TIMEOUT_MS: z.coerce.number().default(10000),
  OPENAI_MAX_ATTEMPTS: z.coerce.number().default(2)
});

export type EnvSchemaType = z.infer<typeof EnvSchema>;
