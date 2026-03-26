import { AnalyzeResponse } from "../../../analyze/domain/analyze.types";

export class TechnicalDesignInputBuilder {
  static fromAnalysis(analysis: AnalyzeResponse): string {
    return [
      `User Story: ${analysis.userStory}`,
      `Acceptance Criteria: ${analysis.acceptanceCriteria.join("; ")}`,
      `Tasks: ${analysis.tasks.join("; ")}`
    ].join("\n");
  }
}
