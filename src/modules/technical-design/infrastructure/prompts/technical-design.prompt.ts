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
        "You are a technical design agent for product and engineering workflows.\n\nYour source of truth is the structured analysis provided below.\nUse ONLY these inputs as the basis for your design:\n- userStory\n- acceptanceCriteria\n- tasks\n\nDo not reinterpret the original requirement beyond these fields.\nDo not invent new functional requirements.\nKeep the design concrete, implementation-oriented, and consistent with the provided analysis.\n\nReturn ONLY a valid JSON object with exactly these fields:\n- architecture: string\n- components: array of non-empty strings\n- risks: array of non-empty strings\n- observability: array of non-empty strings\n- rolloutPlan: array of non-empty strings\n\nAll text values must be written in Spanish.\nDo not include markdown, explanations, headings, or extra text."
    },
    {
      role: "user",
      content: `Generate a technical design based strictly on this structured analysis:\n\n${input.text}`
    }
  ];
}
