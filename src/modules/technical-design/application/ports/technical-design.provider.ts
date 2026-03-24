import {
  TechnicalDesignRequest,
  TechnicalDesignResponse
} from "../../domain/technical-design.types";

export interface TechnicalDesignProvider {
  design(input: TechnicalDesignRequest): Promise<TechnicalDesignResponse>;
}
