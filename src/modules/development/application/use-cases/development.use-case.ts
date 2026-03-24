import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import {
  DevelopmentRequest,
  DevelopmentResponse
} from "../../domain/development.types";
import { DEVELOPMENT_PROVIDER } from "../tokens/development-provider.token";
import { DevelopmentProvider } from "../ports/development.provider";
import { Logger } from "../../../../shared/logger/logger";

@Injectable()
export class DevelopmentUseCase {
  constructor(
    @Inject(DEVELOPMENT_PROVIDER)
    private readonly developmentProvider: DevelopmentProvider
  ) {}

  async execute(input: DevelopmentRequest): Promise<DevelopmentResponse> {
    Logger.log("Development use case started");

    if (!this.isValidInput(input)) {
      Logger.error("Invalid development input");
      throw new BadRequestException("Invalid input for development request");
    }

    const result = await this.developmentProvider.develop(input);

    Logger.log("Development use case completed");

    return result;
  }

  private isValidInput(input: DevelopmentRequest | undefined): boolean {
    return (
      !!input &&
      typeof input.analysis?.userStory === "string" &&
      this.isStringArray(input.analysis?.acceptanceCriteria) &&
      this.isStringArray(input.analysis?.tasks) &&
      typeof input.technicalDesign?.architecture === "string" &&
      this.isStringArray(input.technicalDesign?.components) &&
      this.isStringArray(input.technicalDesign?.risks) &&
      this.isStringArray(input.technicalDesign?.observability) &&
      this.isStringArray(input.technicalDesign?.rolloutPlan) &&
      this.isStringArray(input.taskBreakdown?.tasks) &&
      typeof input.taskBreakdown?.technicalApproach === "string" &&
      this.isStringArray(input.taskBreakdown?.tests) &&
      this.isStringArray(input.taskBreakdown?.definitionOfDone) &&
      input.implementationContext?.framework === "nestjs" &&
      input.implementationContext?.language === "typescript" &&
      input.implementationContext?.testingFramework === "jest" &&
      input.implementationContext?.architectureStyle === "modular" &&
      input.implementationContext?.logging === "nestjs-logger"
    );
  }

  private isStringArray(value: unknown): boolean {
    return (
      Array.isArray(value) &&
      value.length > 0 &&
      value.every((item) => typeof item === "string" && item.length > 0)
    );
  }
}
