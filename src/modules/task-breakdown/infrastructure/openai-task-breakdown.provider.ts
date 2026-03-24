import { Injectable } from "@nestjs/common";
import { TaskBreakdownProvider } from "../application/ports/task-breakdown.provider";
import {
  TaskBreakdownRequest,
  TaskBreakdownResponse
} from "../domain/task-breakdown.types";
import { OpenAiStructuredExecutor } from "../../../shared/ai/openai/openai-structured-executor";
import { buildTaskBreakdownPrompt } from "./prompts/task-breakdown.prompt";
import { TaskBreakdownResponseSchema } from "../domain/task-breakdown.schema";

@Injectable()
export class OpenAiTaskBreakdownProvider implements TaskBreakdownProvider {
  constructor(
    private readonly openAiStructuredExecutor: OpenAiStructuredExecutor
  ) {}

  breakdown(input: TaskBreakdownRequest): Promise<TaskBreakdownResponse> {
    return this.openAiStructuredExecutor.execute({
      operationName: "task_breakdown_request",
      prompt: buildTaskBreakdownPrompt(input),
      schema: TaskBreakdownResponseSchema
    });
  }
}
