import { Body, Controller, Post } from "@nestjs/common";
import { TaskBreakdownUseCase } from "../application/use-cases/task-breakdown.use-case";
import { TaskBreakdownRequest } from "../domain/task-breakdown.types";
import { Logger } from "../../../shared/logger/logger";

@Controller("/task-breakdown")
export class TaskBreakdownController {
  constructor(private readonly taskBreakdownUseCase: TaskBreakdownUseCase) {}

  @Post()
  async breakdown(@Body() body: TaskBreakdownRequest) {
    Logger.log("Task breakdown request received", {
      input: body?.text
    });

    const result = await this.taskBreakdownUseCase.execute(body);

    Logger.log("Task breakdown request completed");

    return result;
  }
}
