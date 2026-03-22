import { BadRequestException, Injectable } from "@nestjs/common";
import { RefineUseCase } from "../../../refinement/application/use-cases/refine.use-case";
import { AnalyzeUseCase } from "../../../analyze/application/use-cases/analyze.use-case";
import { PlanRequest, PlanResponse } from "../../domain/planning.types";
import { Logger } from "../../../../shared/logger/logger";

@Injectable()
export class PlanRequirementUseCase {
  constructor(
    private readonly refineUseCase: RefineUseCase,
    private readonly analyzeUseCase: AnalyzeUseCase
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

    Logger.log("Plan requirement use case completed");

    return {
      refinement,
      analysis
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
}