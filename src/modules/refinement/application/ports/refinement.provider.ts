import { RefineRequest, RefineResponse } from "../../domain/refinement.types";

export interface RefinementProvider {
  refine(input: RefineRequest): Promise<RefineResponse>;
}