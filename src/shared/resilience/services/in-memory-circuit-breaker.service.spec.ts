import { InMemoryCircuitBreakerService } from "./in-memory-circuit-breaker.service";

jest.mock("../../../config/app.config", () => ({
  appConfig: {
    circuitBreaker: {
      enabled: true,
      failureThreshold: 3,
      resetTimeoutMs: 30000
    }
  }
}));

describe("InMemoryCircuitBreakerService", () => {
  let service: InMemoryCircuitBreakerService;

  beforeEach(() => {
    service = new InMemoryCircuitBreakerService();
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-03-22T12:00:00.000Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should start in closed state", () => {
    const state = service.getState("openai");

    expect(state).toEqual({
      provider: "openai",
      state: "closed",
      failureCount: 0,
      openedAt: null
    });
  });

  it("should stay closed before reaching threshold", () => {
    service.recordFailure("openai");
    service.recordFailure("openai");

    const state = service.getState("openai");

    expect(state.state).toBe("closed");
    expect(state.failureCount).toBe(2);
    expect(service.canExecute("openai")).toBe(true);
  });

  it("should transition from closed to open when threshold is reached", () => {
    service.recordFailure("openai");
    service.recordFailure("openai");
    service.recordFailure("openai");

    const state = service.getState("openai");

    expect(state.state).toBe("open");
    expect(state.failureCount).toBe(3);
    expect(state.openedAt).not.toBeNull();
    expect(service.canExecute("openai")).toBe(false);
  });

  it("should transition from open to half-open after reset timeout", () => {
    service.recordFailure("openai");
    service.recordFailure("openai");
    service.recordFailure("openai");

    expect(service.canExecute("openai")).toBe(false);

    jest.advanceTimersByTime(30000);

    expect(service.canExecute("openai")).toBe(true);

    const state = service.getState("openai");
    expect(state.state).toBe("half-open");
  });

  it("should transition from half-open to closed on success", () => {
    service.recordFailure("openai");
    service.recordFailure("openai");
    service.recordFailure("openai");

    jest.advanceTimersByTime(30000);
    service.canExecute("openai");

    service.recordSuccess("openai");

    const state = service.getState("openai");

    expect(state).toEqual({
      provider: "openai",
      state: "closed",
      failureCount: 0,
      openedAt: null
    });
  });

  it("should transition from half-open back to open on failure", () => {
    service.recordFailure("openai");
    service.recordFailure("openai");
    service.recordFailure("openai");

    jest.advanceTimersByTime(30000);
    service.canExecute("openai");

    service.recordFailure("openai");

    const state = service.getState("openai");

    expect(state.state).toBe("open");
    expect(state.openedAt).not.toBeNull();
  });

  it("should return all circuit states", () => {
    service.recordFailure("openai");
    service.recordFailure("claude");

    const states = service.getAllStates();

    expect(states).toHaveLength(2);
    expect(states.map((s) => s.provider).sort()).toEqual(["claude", "openai"]);
  });
});