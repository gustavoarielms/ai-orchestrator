import { RefineResponse } from "../../../refinement/domain/refinement.types";

export class AnalysisInputBuilder {
  static fromRefinement(refinement: RefineResponse): string {
    return [
      `Problem: ${refinement.problem}`,
      `Goal: ${refinement.goal}`,
      `User Story: ${refinement.userStory}`,
      `Acceptance Criteria: ${refinement.acceptanceCriteria.join("; ")}`,
      `Edge Cases: ${refinement.edgeCases.join("; ")}`
    ].join("\n");
  }
}
