import { ServiceUnavailableException } from "@nestjs/common";
import { FallbackAnalysisProvider } from "./fallback-analysis.provider";
import { AnalysisProvider } from "../../application/ports/analysis.provider";
import { MetricsRecorder } from "../../../../shared/metrics/ports/metrics-recorder";
import { CircuitBreaker } from "../../../../shared/resilience/ports/circuit-breaker";

jest.mock("../../../../config/app.config", () => ({
  appConfig: {
    fallback: {
      enabled: true,
      provider: "claude"
    },
    aiProvider: "openai"
  }
}));

import { appConfig } from "../../../../config/app.config";

describe("FallbackAnalysisProvider", () => {
  let primaryProvider: jest.Mocked<AnalysisProvider>;
  let fallbackProvider: jest.Mocked<AnalysisProvider>;
  let metricsRecorder: jest.Mocked<MetricsRecorder>;
  let circuitBreaker: jest.Mocked<CircuitBreaker>;
  let provider: FallbackAnalysisProvider;

  beforeEach(() => {
    primaryProvider = {
      analyze: jest.fn()
    };

    fallbackProvider = {
      analyze: jest.fn()
    };

    metricsRecorder = {
      incrementRequest: jest.fn(),
      incrementError: jest.fn(),
      incrementRetry: jest.fn(),
      incrementFallback: jest.fn(),
      recordLatency: jest.fn(),
      getMetrics: jest.fn()
    };

    circuitBreaker = {
      canExecute: jest.fn().mockReturnValue(true),
      recordSuccess: jest.fn(),
      recordFailure: jest.fn(),
      getState: jest.fn().mockReturnValue({
        provider: "openai",
        state: "open",
        failureCount: 3,
        openedAt: Date.now()
      }),
      getAllStates: jest.fn()
    };

    provider = new FallbackAnalysisProvider(
      primaryProvider,
      fallbackProvider,
      metricsRecorder,
      circuitBreaker
    );

    jest.clearAllMocks();
  });

  it("should return primary provider response when successful", async () => {
    primaryProvider.analyze.mockResolvedValue({
      userStory: "As a user...",
      acceptanceCriteria: ["Criterion 1"],
      tasks: ["Task 1"]
    });

    const result = await provider.analyze({ text: "implement OTP login" });

    expect(primaryProvider.analyze).toHaveBeenCalledTimes(1);
    expect(fallbackProvider.analyze).not.toHaveBeenCalled();
    expect(circuitBreaker.recordSuccess).toHaveBeenCalledWith("openai");
    expect(result.userStory).toBe("As a user...");
  });

  it("should not fallback when fallback.enabled = false", async () => {
    (appConfig.fallback as any).enabled = false;

    const error = new Error("Primary failed");
    primaryProvider.analyze.mockRejectedValue(error);

    await expect(
      provider.analyze({ text: "implement OTP login" })
    ).rejects.toBe(error);

    expect(primaryProvider.analyze).toHaveBeenCalledTimes(1);
    expect(fallbackProvider.analyze).not.toHaveBeenCalled();
    expect(metricsRecorder.incrementFallback).not.toHaveBeenCalled();
    expect(circuitBreaker.recordFailure).toHaveBeenCalledWith("openai");

    (appConfig.fallback as any).enabled = true;
  });

  it("should throw 503 when primary circuit is open", async () => {
    circuitBreaker.canExecute.mockReturnValue(false);

    await expect(
      provider.analyze({ text: "implement OTP login" })
    ).rejects.toBeInstanceOf(ServiceUnavailableException);

    expect(primaryProvider.analyze).not.toHaveBeenCalled();
    expect(fallbackProvider.analyze).not.toHaveBeenCalled();
    expect(metricsRecorder.incrementFallback).not.toHaveBeenCalled();
  });

  it("should fallback when primary provider fails", async () => {
    primaryProvider.analyze.mockRejectedValue(new Error("Primary failed"));

    fallbackProvider.analyze.mockResolvedValue({
      userStory: "Fallback user story",
      acceptanceCriteria: ["Fallback criterion"],
      tasks: ["Fallback task"]
    });

    const result = await provider.analyze({ text: "implement OTP login" });

    expect(primaryProvider.analyze).toHaveBeenCalledTimes(1);
    expect(fallbackProvider.analyze).toHaveBeenCalledTimes(1);
    expect(metricsRecorder.incrementFallback).toHaveBeenCalledTimes(1);
    expect(circuitBreaker.recordFailure).toHaveBeenCalledWith("openai");
    expect(circuitBreaker.recordSuccess).toHaveBeenCalledWith("claude");
    expect(result.userStory).toBe("Fallback user story");
  });

  it("should propagate fallback error when fallback provider also fails", async () => {
    primaryProvider.analyze.mockRejectedValue(new Error("Primary failed"));
    const fallbackError = new Error("Fallback failed");
    fallbackProvider.analyze.mockRejectedValue(fallbackError);

    await expect(
      provider.analyze({ text: "implement OTP login" })
    ).rejects.toBe(fallbackError);

    expect(primaryProvider.analyze).toHaveBeenCalledTimes(1);
    expect(fallbackProvider.analyze).toHaveBeenCalledTimes(1);
    expect(metricsRecorder.incrementFallback).toHaveBeenCalledTimes(1);
  });

  it("should recordFailure for fallback provider when secondary fails", async () => {
    primaryProvider.analyze.mockRejectedValue(new Error("Primary failed"));
    fallbackProvider.analyze.mockRejectedValue(new Error("Fallback failed"));

    await expect(
      provider.analyze({ text: "implement OTP login" })
    ).rejects.toThrow("Fallback failed");

    expect(circuitBreaker.recordFailure).toHaveBeenCalledWith("openai");
    expect(circuitBreaker.recordFailure).toHaveBeenCalledWith("claude");
  });

  it("should not increment fallback if request is rejected before trying fallback provider", async () => {
    primaryProvider.analyze.mockRejectedValue(new Error("Primary failed"));

    circuitBreaker.canExecute.mockImplementation((providerName: string) => {
      if (providerName === "openai") {
        return true;
      }

      return false;
    });

    await expect(
      provider.analyze({ text: "implement OTP login" })
    ).rejects.toBeInstanceOf(ServiceUnavailableException);

    expect(fallbackProvider.analyze).not.toHaveBeenCalled();
    expect(metricsRecorder.incrementFallback).not.toHaveBeenCalled();
  });

  it("should not recordFailure when request is rejected because primary circuit is already open", async () => {
    circuitBreaker.canExecute.mockReturnValue(false);

    await expect(
      provider.analyze({ text: "implement OTP login" })
    ).rejects.toBeInstanceOf(ServiceUnavailableException);

    expect(circuitBreaker.recordFailure).not.toHaveBeenCalled();
    expect(primaryProvider.analyze).not.toHaveBeenCalled();
  });
});