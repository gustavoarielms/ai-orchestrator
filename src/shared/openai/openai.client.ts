import OpenAI from "openai";
import { AiRuntimeConfig } from "../ai/ai-runtime-config.types";

export function createOpenAiClient(config: AiRuntimeConfig): OpenAI {
  return new OpenAI({
    apiKey: config.openai.apiKey
  });
}
