import {
  TechnicalDesignRequest,
  TechnicalDesignResponse
} from "../../domain/technical-design.types";

export interface TechnicalDesignHandler {
  execute(input: TechnicalDesignRequest): Promise<TechnicalDesignResponse>;
}
