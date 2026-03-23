import { Global, Module } from "@nestjs/common";
import { CIRCUIT_BREAKER } from "./tokens/circuit-breaker.token";
import { InMemoryCircuitBreakerService } from "./services/in-memory-circuit-breaker.service";
import { ProviderFailoverExecutor } from "./executors/provider-failover-executor";

@Global()
@Module({
  providers: [
    InMemoryCircuitBreakerService,
    ProviderFailoverExecutor,
    {
      provide: CIRCUIT_BREAKER,
      useExisting: InMemoryCircuitBreakerService
    }
  ],
  exports: [
    CIRCUIT_BREAKER,
    InMemoryCircuitBreakerService,
    ProviderFailoverExecutor
  ]
})
export class ResilienceModule {}