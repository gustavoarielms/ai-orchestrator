import { AnalyzeResponse } from "../../../analyze/domain/analyze.types";
import { TechnicalDesignResponse } from "../../../technical-design/domain/technical-design.types";
import { TaskBreakdownSource } from "../../../task-breakdown/domain/task-breakdown.types";

export class TaskBreakdownInputBuilder {
  static fromAnalysisAndTechnicalDesign(
    analysis: AnalyzeResponse,
    technicalDesign: TechnicalDesignResponse
  ): TaskBreakdownSource {
    return {
      analysis: {
        userStory: analysis.userStory,
        acceptanceCriteria: analysis.acceptanceCriteria,
        tasks: analysis.tasks
      },
      technicalDesign: {
        architecture: technicalDesign.architecture,
        components: technicalDesign.components,
        risks: technicalDesign.risks,
        observability: technicalDesign.observability,
        rolloutPlan: technicalDesign.rolloutPlan
      }
    };
  }
}
