import { DevelopmentRequest } from "../domain/development.types";

export type DevelopmentPromptMessage = {
  role: "system" | "user";
  content: string;
};

export function buildDevelopmentPrompt(
  input: DevelopmentRequest
): DevelopmentPromptMessage[] {
  const analysisBlock = [
    `User Story: ${input.analysis.userStory}`,
    `Acceptance Criteria: ${input.analysis.acceptanceCriteria.join("; ")}`,
    `Tasks: ${input.analysis.tasks.join("; ")}`
  ].join("\n");

  const technicalDesignBlock = [
    `Architecture: ${input.technicalDesign.architecture}`,
    `Components: ${input.technicalDesign.components.join("; ")}`,
    `Risks: ${input.technicalDesign.risks.join("; ")}`,
    `Observability: ${input.technicalDesign.observability.join("; ")}`,
    `Rollout Plan: ${input.technicalDesign.rolloutPlan.join("; ")}`
  ].join("\n");

  const taskBreakdownBlock = [
    `Tasks: ${input.taskBreakdown.tasks.join("; ")}`,
    `Technical Approach: ${input.taskBreakdown.technicalApproach}`,
    `Tests: ${input.taskBreakdown.tests.join("; ")}`,
    `Definition of Done: ${input.taskBreakdown.definitionOfDone.join("; ")}`
  ].join("\n");

  const implementationContextBlock = [
    `Framework: ${input.implementationContext.framework}`,
    `Language: ${input.implementationContext.language}`,
    `Testing Framework: ${input.implementationContext.testingFramework}`,
    `Architecture Style: ${input.implementationContext.architectureStyle}`,
    `Logging: ${input.implementationContext.logging}`
  ].join("\n");

  return [
    {
      role: "system",
      content:
        "You are a development agent for product and engineering workflows.\n\nYour source of truth is the structured analysis, technical design, task breakdown, and implementation context provided below.\nUse ONLY these inputs as the basis for your response.\nDo not invent new functional requirements.\nPropose concrete, executable implementation changes.\nRespect the provided stack exactly.\n\nHard rules:\n- do not use Express if the framework is NestJS\n- do not use console.log, console.error, or any console.* logging\n- respect modules, controllers, providers, and dependency injection\n- use Jest for tests if the testing framework is Jest\n- do not invent project structure outside the stack and architecture indicated\n- keep all proposed changes concrete, executable, and aligned with the existing codebase\n\nReturn strict JSON only.\nAll text values must be written in Spanish.\n\nReturn ONLY a valid JSON object with exactly these fields:\n- filesToChange: array of non-empty strings\n- codeChanges: array of objects with file, changeType (create|update), summary, content\n- testsToAdd: array of objects with file, summary, content\n- notes: array of non-empty strings\n\nDo not include markdown, explanations, headings, or extra text."
    },
    {
      role: "user",
      content: `Generate a development plan based strictly on the following inputs:\n\n[Analysis]\n${analysisBlock}\n\n[Technical Design]\n${technicalDesignBlock}\n\n[Task Breakdown]\n${taskBreakdownBlock}\n\n[Implementation Context]\n${implementationContextBlock}`
    }
  ];
}
