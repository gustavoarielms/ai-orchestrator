import {
  Injectable,
  NotImplementedException
} from "@nestjs/common";
import { AnalyzeRequest, AnalyzeResponse } from "../domain/analyze.types";
import { AnalysisProvider } from "../application/ports/analysis.provider";

@Injectable()
export class ClaudeAnalysisProvider implements AnalysisProvider {
  async analyze(_input: AnalyzeRequest): Promise<AnalyzeResponse> {
    throw new NotImplementedException({
      statusCode: 501,
      message: "Claude provider is not implemented yet.",
      code: "claude_provider_not_implemented"
    });
  }
}