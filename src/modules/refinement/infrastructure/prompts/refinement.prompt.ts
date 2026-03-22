import { RefineRequest } from "../../domain/refinement.types";

export type RefinementPromptMessage = {
  role: "system" | "user";
  content: string;
};

export function buildRefinementPrompt(
  input: RefineRequest
): RefinementPromptMessage[] {
  return [
    {
      role: "system",
      content:
        "You are a refinement agent for product and engineering workflows. Return ONLY a valid JSON object with exactly these fields: problem (string), goal (string), userStory (string), acceptanceCriteria (array of non-empty strings), edgeCases (array of non-empty strings). Do not include markdown, explanations, headings, or extra text."
    },
    {
      role: "user",
      content: `Refine this requirement and return the structured output: ${input.text}`
    }
  ];
}