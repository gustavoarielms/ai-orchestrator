import {
  TaskBreakdownRequest,
  TaskBreakdownResponse
} from "../../domain/task-breakdown.types";

export interface TaskBreakdownHandler {
  execute(input: TaskBreakdownRequest): Promise<TaskBreakdownResponse>;
}
