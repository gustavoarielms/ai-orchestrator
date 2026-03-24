import { Injectable, NotImplementedException } from "@nestjs/common";
import { TaskBreakdownProvider } from "../application/ports/task-breakdown.provider";
import {
  TaskBreakdownRequest,
  TaskBreakdownResponse
} from "../domain/task-breakdown.types";

@Injectable()
export class ClaudeTaskBreakdownProvider implements TaskBreakdownProvider {
  async breakdown(
    _input: TaskBreakdownRequest
  ): Promise<TaskBreakdownResponse> {
    throw new NotImplementedException({
      statusCode: 501,
      message: "Claude task breakdown provider is not implemented yet.",
      code: "claude_task_breakdown_provider_not_implemented"
    });
  }
}
