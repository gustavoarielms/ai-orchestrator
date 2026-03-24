import {
  TaskBreakdownRequest,
  TaskBreakdownResponse
} from "../../domain/task-breakdown.types";

export interface TaskBreakdownProvider {
  breakdown(input: TaskBreakdownRequest): Promise<TaskBreakdownResponse>;
}
