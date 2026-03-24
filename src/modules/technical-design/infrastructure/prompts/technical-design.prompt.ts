import { TechnicalDesignRequest } from "../../domain/technical-design.types";

export type TechnicalDesignPromptMessage = {
  role: "system" | "user";
  content: string;
};

export function buildTechnicalDesignPrompt(
  input: TechnicalDesignRequest
): TechnicalDesignPromptMessage[] {
  return [
    {
      role: "system",
      content:
        "You are a technical design agent for product and engineering workflows. Return ONLY a valid JSON object with exactly these fields: architecture (string), components (array of non-empty strings), risks (array of non-empty strings), observability (array of non-empty strings), rolloutPlan (array of non-empty strings). Do not include markdown, explanations, headings, or extra text."
    },
    {
      role: "user",
      content: `Create a technical design for this requirement and return the structured output: ${input.text}`
    }
  ];
}
