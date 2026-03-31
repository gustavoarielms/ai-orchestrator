import {
  DevelopmentRequest,
  DevelopmentResponse
} from "../../domain/development.types";

export interface DevelopmentHandler {
  execute(input: DevelopmentRequest): Promise<DevelopmentResponse>;
}
