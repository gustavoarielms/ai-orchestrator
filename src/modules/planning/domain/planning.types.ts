import { RefineResponse } from "../../refinement/domain/refinement.types";
import { AnalyzeResponse } from "../../analyze/domain/analyze.types";

export type PlanRequest = {
  text: string;
};

export type PlanResponse = {
  refinement: RefineResponse;
  analysis: AnalyzeResponse;
};