import { Injectable } from "@nestjs/common";
import {
  CircuitBreaker,
  CircuitBreakerSnapshot,
  CircuitState
} from "../ports/circuit-breaker";
import { appConfig } from "../../../config/app.config";

type ProviderCircuit = {
  state: CircuitState;
  failureCount: number;
  openedAt: number | null;
};

@Injectable()
export class InMemoryCircuitBreakerService implements CircuitBreaker {
  private circuits: Record<string, ProviderCircuit> = {};

  canExecute(provider: string): boolean {
    if (!appConfig.circuitBreaker.enabled) {
      return true;
    }

    const circuit = this.getOrCreate(provider);

    if (circuit.state === "closed") {
      return true;
    }

    if (circuit.state === "open") {
      const now = Date.now();

      if (
        circuit.openedAt !== null &&
        now - circuit.openedAt >= appConfig.circuitBreaker.resetTimeoutMs
      ) {
        circuit.state = "half-open";
        return true;
      }

      return false;
    }

    return true;
  }

  recordSuccess(provider: string): void {
    const circuit = this.getOrCreate(provider);
    circuit.state = "closed";
    circuit.failureCount = 0;
    circuit.openedAt = null;
  }

  recordFailure(provider: string): void {
    if (!appConfig.circuitBreaker.enabled) {
      return;
    }

    const circuit = this.getOrCreate(provider);
    circuit.failureCount += 1;

    if (circuit.failureCount >= appConfig.circuitBreaker.failureThreshold) {
      circuit.state = "open";
      circuit.openedAt = Date.now();
      return;
    }

    if (circuit.state === "half-open") {
      circuit.state = "open";
      circuit.openedAt = Date.now();
    }
  }

  getState(provider: string): CircuitBreakerSnapshot {
    const circuit = this.getOrCreate(provider);

    return {
      provider,
      state: circuit.state,
      failureCount: circuit.failureCount,
      openedAt: circuit.openedAt
    };
  }

  getAllStates(): CircuitBreakerSnapshot[] {
    return Object.keys(this.circuits).map((provider) => this.getState(provider));
  }

  private getOrCreate(provider: string): ProviderCircuit {
    if (!this.circuits[provider]) {
      this.circuits[provider] = {
        state: "closed",
        failureCount: 0,
        openedAt: null
      };
    }

    return this.circuits[provider];
  }
}