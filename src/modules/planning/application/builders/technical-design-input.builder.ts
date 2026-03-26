import { AnalyzeResponse } from "../../../analyze/domain/analyze.types";
import { TechnicalDesignSource } from "../../../technical-design/domain/technical-design.types";

export class TechnicalDesignInputBuilder {
  static fromAnalysis(analysis: AnalyzeResponse): TechnicalDesignSource {
    return {
      userStory: analysis.userStory,
      acceptanceCriteria: analysis.acceptanceCriteria,
      tasks: analysis.tasks
    };
  }
}
