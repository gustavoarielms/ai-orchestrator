import { BadRequestException, Injectable } from "@nestjs/common";
import { RefineUseCase } from "../../../refinement/application/use-cases/refine.use-case";
import { AnalyzeUseCase } from "../../../analyze/application/use-cases/analyze.use-case";
import { TechnicalDesignUseCase } from "../../../technical-design/application/use-cases/technical-design.use-case";
import { TaskBreakdownUseCase } from "../../../task-breakdown/application/use-cases/task-breakdown.use-case";
import { PlanRequest, PlanResponse } from "../../domain/planning.types";
import { Logger } from "../../../../shared/logger/logger";
import { AnalysisInputBuilder } from "../builders/analysis-input.builder";
import { TechnicalDesignInputBuilder } from "../builders/technical-design-input.builder";
import { TaskBreakdownInputBuilder } from "../builders/task-breakdown-input.builder";
import { PlanSummaryBuilder } from "../builders/plan-summary.builder";

@Injectable()
export class PlanRequirementUseCase {
  constructor(
    private readonly refineUseCase: RefineUseCase,
    private readonly analyzeUseCase: AnalyzeUseCase,
    private readonly technicalDesignUseCase: TechnicalDesignUseCase,
    private readonly taskBreakdownUseCase: TaskBreakdownUseCase
  ) {}

  async execute(input: PlanRequest): Promise<PlanResponse> {
    Logger.log("Plan requirement use case started");

    if (!input?.text || typeof input.text !== "string") {
      Logger.error("Invalid plan input");
      throw new BadRequestException("Invalid input: 'text' is required");
    }

    const refinement = await this.refineUseCase.execute({
      text: input.text
    });

    const analysis = await this.analyzeUseCase.execute({
      text: AnalysisInputBuilder.fromRefinement(refinement)
    });

    const technicalDesign = await this.technicalDesignUseCase.execute({
      source: TechnicalDesignInputBuilder.fromAnalysis(analysis)
    });

    const taskBreakdown = await this.taskBreakdownUseCase.execute({
      source: TaskBreakdownInputBuilder.fromAnalysisAndTechnicalDesign(
        analysis,
        technicalDesign
      )
    });

    const summary = PlanSummaryBuilder.fromArtifacts(
      refinement,
      analysis,
      technicalDesign,
      taskBreakdown
    );

    Logger.log("Plan requirement use case completed");

    return {
      refinement,
      analysis,
      technicalDesign,
      taskBreakdown,
      summary
    };
  }
}
