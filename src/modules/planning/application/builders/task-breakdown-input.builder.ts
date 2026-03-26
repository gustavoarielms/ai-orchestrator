import { AnalyzeResponse } from "../../../analyze/domain/analyze.types";
import { TechnicalDesignResponse } from "../../../technical-design/domain/technical-design.types";

export class TaskBreakdownInputBuilder {
  static fromAnalysisAndTechnicalDesign(
    analysis: AnalyzeResponse,
    technicalDesign: TechnicalDesignResponse
  ): string {
    return [
      `User Story: ${analysis.userStory}`,
      `Acceptance Criteria: ${analysis.acceptanceCriteria.join("; ")}`,
      `Tasks: ${analysis.tasks.join("; ")}`,
      `Architecture: ${technicalDesign.architecture}`,
      `Components: ${technicalDesign.components.join("; ")}`,
      `Risks: ${technicalDesign.risks.join("; ")}`,
      `Observability: ${technicalDesign.observability.join("; ")}`,
      `Rollout Plan: ${technicalDesign.rolloutPlan.join("; ")}`
    ].join("\n");
  }
}
