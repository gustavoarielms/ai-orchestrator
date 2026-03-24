import {
  DevelopmentRequest,
  DevelopmentResponse
} from "../../domain/development.types";

export interface DevelopmentProvider {
  develop(input: DevelopmentRequest): Promise<DevelopmentResponse>;
}
