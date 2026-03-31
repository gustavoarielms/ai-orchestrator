import { AnalyzeRequest, AnalyzeResponse } from "../../domain/analyze.types";

export interface AnalyzeHandler {
  execute(input: AnalyzeRequest): Promise<AnalyzeResponse>;
}
