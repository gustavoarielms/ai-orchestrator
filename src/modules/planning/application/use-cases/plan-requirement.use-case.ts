import { BadRequestException, Injectable } from "@nestjs/common";
import { RefineUseCase } from "../../../refinement/application/use-cases/refine.use-case";
import { AnalyzeUseCase } from "../../../analyze/application/use-cases/analyze.use-case";
import { TechnicalDesignUseCase } from "../../../technical-design/application/use-cases/technical-design.use-case";
import { TaskBreakdownUseCase } from "../../../task-breakdown/application/use-cases/task-breakdown.use-case";
import { PlanRequest, PlanResponse } from "../../domain/planning.types";
import { Logger } from "../../../../shared/logger/logger";

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

    const enrichedAnalysisInput = this.buildAnalysisInput(refinement);

    const analysis = await this.analyzeUseCase.execute({
      text: enrichedAnalysisInput
    });

    const technicalDesign = await this.technicalDesignUseCase.execute({
      text: this.buildTechnicalDesignInput(analysis)
    });

    const taskBreakdown = await this.taskBreakdownUseCase.execute({
      text: this.buildTaskBreakdownInput(analysis, technicalDesign)
    });

    Logger.log("Plan requirement use case completed");

    return {
      refinement,
      analysis,
      technicalDesign,
      taskBreakdown
    };
  }

  private buildAnalysisInput(refinement: PlanResponse["refinement"]): string {
    return [
      `Problem: ${refinement.problem}`,
      `Goal: ${refinement.goal}`,
      `User Story: ${refinement.userStory}`,
      `Acceptance Criteria: ${refinement.acceptanceCriteria.join("; ")}`,
      `Edge Cases: ${refinement.edgeCases.join("; ")}`
    ].join("\n");
  }

  private buildTechnicalDesignInput(
    analysis: PlanResponse["analysis"]
  ): string {
    return [
      `User Story: ${analysis.userStory}`,
      `Acceptance Criteria: ${analysis.acceptanceCriteria.join("; ")}`,
      `Tasks: ${analysis.tasks.join("; ")}`
    ].join("\n");
  }

  private buildTaskBreakdownInput(
    analysis: PlanResponse["analysis"],
    technicalDesign: PlanResponse["technicalDesign"]
  ): string {
    return [
      `User Story: ${analysis.userStory}`,
      `Acceptance Criteria: ${analysis.acceptanceCriteria.join("; ")}`,
      `Tasks: ${analysis.tasks.join("; ")}`,
      `Architecture: ${technicalDesign.architecture}`,
      `Components: ${technicalDesign.components.join("; ")}`,
      `Risks: ${technicalDesign.risks.join("; ")}`,
      `Observability: ${technicalDesign.observability.join("; ")}`,
      `Rollout Plan: ${technicalDesign.rolloutPlan.join("; ")}`
    ].join("\n");
  }
}
