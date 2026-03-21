import { Controller, Get, Inject } from "@nestjs/common";
import { CircuitBreaker } from "../../../shared/resilience/ports/circuit-breaker";
import { CIRCUIT_BREAKER } from "../../../shared/resilience/tokens/circuit-breaker.token";

@Controller()
export class ResilienceController {
  constructor(
    @Inject(CIRCUIT_BREAKER)
    private readonly circuitBreaker: CircuitBreaker
  ) {}

  @Get("/resilience/circuits")
  getCircuitStates() {
    return this.circuitBreaker.getAllStates();
  }
}