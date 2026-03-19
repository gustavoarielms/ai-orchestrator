import { AnalyzeRequest, AnalyzeResponse } from "../../domain/analyze.types";

export interface AnalysisProvider {
  analyze(input: AnalyzeRequest): Promise<AnalyzeResponse>;
}