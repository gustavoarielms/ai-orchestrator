import { Global, Module } from "@nestjs/common";
import { CIRCUIT_BREAKER } from "./tokens/circuit-breaker.token";
import { InMemoryCircuitBreakerService } from "./services/in-memory-circuit-breaker.service";

@Global()
@Module({
  providers: [
    InMemoryCircuitBreakerService,
    {
      provide: CIRCUIT_BREAKER,
      useExisting: InMemoryCircuitBreakerService
    }
  ],
  exports: [CIRCUIT_BREAKER, InMemoryCircuitBreakerService]
})
export class ResilienceModule {}