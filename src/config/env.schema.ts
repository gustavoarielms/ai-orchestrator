import { z } from "zod";

export const EnvSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.string().default("development"),
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_MODEL: z.string().default("gpt-5.4")
});

export type EnvSchemaType = z.infer<typeof EnvSchema>;