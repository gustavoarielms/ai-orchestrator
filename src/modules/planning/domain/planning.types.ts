import { RefineResponse } from "../../refinement/domain/refinement.types";
import { AnalyzeResponse } from "../../analyze/domain/analyze.types";
import { TechnicalDesignResponse } from "../../technical-design/domain/technical-design.types";
import { TaskBreakdownResponse } from "../../task-breakdown/domain/task-breakdown.types";

export type PlanRequest = {
  text: string;
};

export type PlanResponse = {
  refinement: RefineResponse;
  analysis: AnalyzeResponse;
  technicalDesign: TechnicalDesignResponse;
  taskBreakdown: TaskBreakdownResponse;
};
