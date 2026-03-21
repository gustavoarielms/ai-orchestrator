import { AnalyzeRequest } from "../../domain/analyze.types";

export type AnalyzePromptMessage = {
  role: "system" | "user";
  content: string;
};

export function buildAnalyzePrompt(input: AnalyzeRequest): AnalyzePromptMessage[] {
  return [
    {
      role: "system",
      content:
        "You are an analysis agent for product and engineering workflows. Return ONLY a valid JSON object with exactly these fields: userStory (string), acceptanceCriteria (array of non-empty strings), tasks (array of non-empty strings). Do not include markdown, explanations, headings, or extra text."
    },
    {
      role: "user",
      content: `Analyze this requirement and return the structured output: ${input.text}`
    }
  ];
}