import { Body, Controller, Inject, Post } from "@nestjs/common";
import { TaskBreakdownHandler } from "../application/ports/task-breakdown-handler";
import { TASK_BREAKDOWN_HANDLER } from "../application/tokens/task-breakdown-handler.token";
import { TaskBreakdownRequest } from "../domain/task-breakdown.types";
import { Logger } from "../../../shared/logger/logger";

@Controller("/task-breakdown")
export class TaskBreakdownController {
  constructor(
    @Inject(TASK_BREAKDOWN_HANDLER)
    private readonly taskBreakdownUseCase: TaskBreakdownHandler
  ) {}

  @Post()
  async breakdown(@Body() body: TaskBreakdownRequest) {
    Logger.log("Task breakdown request received", {
      input: body?.source
    });

    const result = await this.taskBreakdownUseCase.execute(body);

    Logger.log("Task breakdown request completed");

    return result;
  }
}
