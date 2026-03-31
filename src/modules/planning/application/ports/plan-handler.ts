import { PlanRequest, PlanResponse } from "../../domain/planning.types";

export interface PlanHandler {
  execute(input: PlanRequest): Promise<PlanResponse>;
}
