import { ZodSchema } from "zod";

export type OpenAiPromptMessage = {
  role: "system" | "user";
  content: string;
};

export type ExecuteStructuredOpenAiParams<T> = {
  operationName: string;
  prompt: OpenAiPromptMessage[];
  schema: ZodSchema<T>;
};