import { TaskBreakdownRequest } from "../../domain/task-breakdown.types";

export type TaskBreakdownPromptMessage = {
  role: "system" | "user";
  content: string;
};

export function buildTaskBreakdownPrompt(
  input: TaskBreakdownRequest
): TaskBreakdownPromptMessage[] {
  const { analysis, technicalDesign } = input.source;

  return [
    {
      role: "system",
      content:
        "You are a task breakdown agent for product and engineering workflows.\n\nYour source of truth is the structured analysis and technical design provided below.\nUse ONLY these inputs as the basis for your response:\n- userStory\n- acceptanceCriteria\n- tasks\n- architecture\n- components\n- risks\n- observability\n- rolloutPlan\n\nDo not invent new functional requirements.\nDo not redefine the architecture.\nFocus on converting the provided design into executable, testable team work.\n\nReturn ONLY a valid JSON object with exactly these fields:\n- tasks: array of non-empty strings\n- technicalApproach: string\n- tests: array of non-empty strings\n- definitionOfDone: array of non-empty strings\n\nAll text values must be written in Spanish.\nDo not include markdown, explanations, headings, or extra text."
    },
    {
      role: "user",
      content: [
        "Generate a task breakdown based strictly on this structured analysis and technical design:",
        "",
        `User Story: ${analysis.userStory}`,
        `Acceptance Criteria: ${analysis.acceptanceCriteria.join("; ")}`,
        `Tasks: ${analysis.tasks.join("; ")}`,
        `Architecture: ${technicalDesign.architecture}`,
        `Components: ${technicalDesign.components.join("; ")}`,
        `Risks: ${technicalDesign.risks.join("; ")}`,
        `Observability: ${technicalDesign.observability.join("; ")}`,
        `Rollout Plan: ${technicalDesign.rolloutPlan.join("; ")}`
      ].join("\n")
    }
  ];
}
