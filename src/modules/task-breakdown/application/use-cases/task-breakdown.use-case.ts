import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import {
  TaskBreakdownRequest,
  TaskBreakdownResponse
} from "../../domain/task-breakdown.types";
import { TASK_BREAKDOWN_PROVIDER } from "../tokens/task-breakdown-provider.token";
import { TaskBreakdownProvider } from "../ports/task-breakdown.provider";
import { Logger } from "../../../../shared/logger/logger";

@Injectable()
export class TaskBreakdownUseCase {
  constructor(
    @Inject(TASK_BREAKDOWN_PROVIDER)
    private readonly taskBreakdownProvider: TaskBreakdownProvider
  ) {}

  async execute(input: TaskBreakdownRequest): Promise<TaskBreakdownResponse> {
    Logger.log("Task breakdown use case started");

    if (!input?.text || typeof input.text !== "string") {
      Logger.error("Invalid task breakdown input");
      throw new BadRequestException("Invalid input: 'text' is required");
    }

    const result = await this.taskBreakdownProvider.breakdown(input);

    Logger.log("Task breakdown use case completed");

    return result;
  }
}
