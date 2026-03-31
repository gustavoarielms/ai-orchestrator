import { RefineRequest, RefineResponse } from "../../domain/refinement.types";

export interface RefineHandler {
  execute(input: RefineRequest): Promise<RefineResponse>;
}
