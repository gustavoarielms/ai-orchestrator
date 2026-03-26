import { RefineResponse } from "../../../refinement/domain/refinement.types";
import { AnalyzeResponse } from "../../../analyze/domain/analyze.types";
import { TechnicalDesignResponse } from "../../../technical-design/domain/technical-design.types";
import { TaskBreakdownResponse } from "../../../task-breakdown/domain/task-breakdown.types";
import { PlanSummary } from "../../domain/planning.types";

export class PlanSummaryBuilder {
  static fromArtifacts(
    refinement: RefineResponse,
    analysis: AnalyzeResponse,
    technicalDesign: TechnicalDesignResponse,
    taskBreakdown: TaskBreakdownResponse
  ): PlanSummary {
    return {
      summary: `${refinement.goal}. ${analysis.userStory}. La arquitectura recomendada es ${technicalDesign.architecture}.`,
      recommendedApproach: taskBreakdown.technicalApproach,
      keyRisks: technicalDesign.risks,
      deliveryOutline: taskBreakdown.tasks
    };
  }
}
