export type CircuitState = "closed" | "open" | "half-open";

export interface CircuitBreakerSnapshot {
  provider: string;
  state: CircuitState;
  failureCount: number;
  openedAt: number | null;
}

export interface CircuitBreaker {
  canExecute(provider: string): boolean;
  recordSuccess(provider: string): void;
  recordFailure(provider: string): void;
  getState(provider: string): CircuitBreakerSnapshot;
  getAllStates(): CircuitBreakerSnapshot[];
}